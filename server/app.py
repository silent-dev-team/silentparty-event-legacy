from cProfile import label
import re
from flask import Flask, Response, request, render_template, make_response, send_from_directory, redirect, jsonify
from flask_sse import sse
from datetime import datetime
import redis, json, sys, os, uuid
from dotenv import load_dotenv
from pickle import loads, dumps
from models import *
load_dotenv()

### CONST ###

LOCAL:bool = sys.argv[1] == 'local'
SALT:str = os.getenv('SALT')

### VAR ###

#### Classes ####


class Subdomain:
  def __init__(self, local:bool=False):
    self.api        = 'api'    if not local else None
    self.ticket     = 'ticket' if not local else None
    self.kasse      = 'kasse'  if not local else None
    self.dashboard  = 'dashboard'  if not local else None


class Entry:
  def __init__(self, value:bool = False):
    self._value = value
  def start(self):
    self._value = True
  def stop(self):
    self._value = False
  def get(self):
    return self._value

### FUNCS ###

def decode(b_obj:list or dict):
  if type(b_obj) == list:
    return [bytes(e).decode() for e in b_obj]
  if type(b_obj) == dict:
    return {bytes(k).decode():bytes(v).decode() for k,v in b_obj.items()}
  return b_obj

### INSTANCES ###

app = Flask(__name__)
app.config["REDIS_URL"] = 'redis://localhost' if LOCAL else "redis://sp"
app.register_blueprint(sse, url_prefix='/stream')
db = redis.Redis()

sd = Subdomain(LOCAL)

entry = Entry(True)

### DB-FUNCS ###

def loadOrders(start:int=0,stop:int=-1,*args) -> list[Order] or list[int or str]:
  if args:
    return list(filter(lambda o: any(arg in o.__dict__.keys() for arg in args), loadOrders(start,stop)))
  return [loads(order) for order in db.lrange('orders',start,stop)]
    
def getItemsFromOrder(orders:list[Order], id:int=None) -> list[OrderPos]:
  if id:
    return [item for item in getItemsFromOrder(orders) if item.id == id]
  items = []
  for order in orders:
    items += order.items
  return items

def countItems(id) -> int:
  count:int = 0
  for item in getItemsFromOrder(loadOrders(), id):
    count += int(item.number)
  return count

### STATS ###
def increaseVal(name,key):
  value = db.hget(name,key)
  if not value:
    value = 0
  else:
    value = int(value.decode())
  db.hset(name,key,str(value+1))

def updateDJs(DJs):
  db.hset("stat:djs","json",json.dumps(DJs))

def publishDJs():
  sse.publish(json.loads(db.hget("stat:djs","json").decode()),"djs")
  
def updateRollTexts(rolltext):
  db.hset("stat:rolltext","json",json.dumps(rolltext))

def publishRollTexts():
  sse.publish(json.loads(db.hget("stat:rolltext","json").decode()),"rolltext")

def countTicketSell():
  increaseVal("stat:user","sells")

def countTicketActivate():
  increaseVal("stat:user","checked")

def countCurrentHeadphone():
  increaseVal("stat:user","current")
  
def countHeadphoneReturn():
  increaseVal("stat:user","returned")

def getReturnedFromOrders():
  pass

def publishUserstats():
  stats = {}
  data = db.hgetall("stat:user")
  for k in data:
    stats[k.decode()] = data[k].decode()
  sse.publish(stats,"userstats")

def syncStats():
  tickets = []
  ticketNames = [ticket.decode() for ticket in db.keys('ticket:*')]
  for ticketn in ticketNames:
    data = db.hgetall(ticketn)
    tick = {}
    for k in data.keys():
      tick[k.decode()] = data[k].decode()
    tickets.append(tick)
  print(tickets)
  db.hset("stat:user","sells",len(list(filter(lambda t: True if t["activeted"] != "0" else False, tickets) )))
  db.hset("stat:user","checked",len(list(filter(lambda t:True if t["checked"] != "0" else False, tickets))))
  db.hset("stat:user","current",str(countItems(1)))
  db.hset("stat:user","returned","0")


### ROUTES ###

### STARTPAGE ###

@app.route('/')
def localWebServer_index():
  return redirect('index.html')

@app.route('/<path:path>')
def localWebServer_pwa(path):
  return send_from_directory('../localWebServer/',path)

### DASHBOARD ###

@app.route('/<path:path>', subdomain=sd.dashboard)
def dashboard_pwa(path):
  return send_from_directory('../dashboard/dashboard/dist/dashboard',path)

### KASSE ###

@app.route('/', subdomain=sd.kasse)
def kasse_index():
  return redirect('index.html')

@app.route('/<path:path>',subdomain=sd.kasse)
def kasse_pwa(path):
  return send_from_directory('../kasse/dist',path)


### TICKET ###

@app.route('/', subdomain=sd.ticket)
def ticket_index():
  return redirect('index.html')

@app.route('/<path:path>', subdomain=sd.ticket)
def ticket_pwa(path):
  return send_from_directory('../ticket-pwa/dist',path)


### API ###

@app.route('/ping', subdomain=sd.api)
def ping():
  return jsonify({
      'ping':True
    }), 200

@app.route('/entry', subdomain=sd.api, methods = ['PUT', 'GET'])
def control_entry():
  # PUT 
  if request.method == 'PUT':
    data = request.get_json()
    if 'entry' not in data:
      return jsonify({'error':'missing entry'}), 400
    if data['entry']:
      entry.start()
    else:
      entry.stop()
  # GET & PUT
  response = {"entry": entry.get()}
  sse.publish(response, type='entry')
  return jsonify(**response), 200

@app.route('/salt', subdomain=sd.api, methods = ['GET'])
def get_salt():
  return jsonify({
    'salt': SALT
  }), 200

@app.route('/djs', subdomain=sd.api, methods = ['POST'])
def handleDJ():
  updateDJs(request.json)
  publishDJs()
  return "{}"

@app.route('/rolltext', subdomain=sd.api, methods = ['POST'])
def handleRollText():
  updateRollTexts(request.json)
  publishRollTexts()
  return "{}"

@app.route('/refresh', subdomain=sd.api)
def test():
  syncStats()
  publishUserstats()
  publishDJs()
  publishRollTexts()
  return "{}"

@app.route('/tickets', subdomain=sd.api, methods = ['GET'])
def get_tickets():
  idfy = lambda key: key.split(':')[1]
  ticket_keys = [ticket.decode() for ticket in db.keys('ticket:*')]
  filtered_tickets = [] if len(request.args) > 0 else ticket_keys
  for k, v in request.args.to_dict().items():
    for id in ticket_keys:
      hash = db.hget(id,k)
      if not hash:
        continue
      if hash.decode() == v:
        filtered_tickets+=[id]
  ticket_keys = list(dict.fromkeys(filtered_tickets))
  tickets = {idfy(key):decode(db.hgetall(key)) for key in ticket_keys}
  return jsonify({
      'data':tickets
    }), 200

@app.route('/tickets/<id>/<mutation>', subdomain=sd.api, methods = ['GET','PATCH'])
def ticket(id:str, mutation:str):
  CHECKIN:str =  mutation == 'checkin'
  ACTIVATION:str = mutation == 'activate'
  hash:str = None
  now:str = str(datetime.now().isoformat())
  
  if request.method == 'GET':
    try: 
      hash = request.args.get('hash')
    except:
      return jsonify({'error':'no hash'}), 400
  elif request.method == 'PATCH':
    try: 
      hash = request.get_json()['hash']
    except:
      return jsonify({'error':'no hash'}), 400
  else:
    return jsonify({'error':'method not allowed'}), 405
  
  ticket_b = db.hgetall('ticket:'+str(id))
  if len(ticket_b) == 0:
    return jsonify({'error':'no ticket'}), 404
  ticket = decode(ticket_b)
  if ticket['hash'] != hash:
    return jsonify({'error':'invalid hash'}), 400
  
  if ACTIVATION:
    if ticket['activeted'] == '1':
      return jsonify({'error':'already activated','data':ticket}), 200
    if request.method == 'PATCH':
      db.hset(
        'ticket:'+str(id),
        'activation_time', now
      )
      db.hset(
        'ticket:'+str(id),
        'activeted', '1'
      )
  if CHECKIN:
    if ticket['activeted'] == '0':
      return jsonify({'error':'ticket not activeted','data':ticket}), 200
    if ticket['checked'] != '0':
      return jsonify({'error':'ticket already checked','data':ticket}), 208
    if request.method == 'PATCH':
      db.hset(
        'ticket:'+str(id), 
        'checkin_time', now
      )
      db.hset(
        'ticket:'+str(id),
        'checked', '1'
      )
  return jsonify({'data':ticket}), 200

@app.route('/shopItems', subdomain=sd.api, methods = ['GET'])
def get_shopItems():
  """Lädt die Items (Getränke, Angebote, HP) aus der Datenbank

  Returns:
      list<Itmes>: Liste aller Items
  """
  items = json.loads(db.get('shopItems'))
  return jsonify({'data':items}), 200


@app.route('/orders/items', subdomain=sd.api, methods = ['GET'])
def get_order_items() -> list: 
  items = getItemsFromOrder(loadOrders())
  return jsonify({'data':items}), 200

@app.route('/orders/items/<id>', subdomain=sd.api, methods = ['GET'])
def get_order_items_id(id:int) -> list:
  id = int(id)
  items = getItemsFromOrder(loadOrders(),id)
  return jsonify({'data':items}), 200

@app.route('/orders/items/<id>/count', subdomain=sd.api, methods = ['GET'])
def count_order_items(id:int) -> list: 
  id = int(id)
  return jsonify({'data':{'count':countItems(id)}}), 200

#TODO create filter and funciton for returned headphones
@app.route('/orders', subdomain=sd.api, methods = ['GET'])
def get_order() -> list: 
  """Gibt die Liste (oder einen Ausschnitt) der Bestellungen aus.
  Pos 0 ist die neuste Bestellung.
  
  Params:
      start: Startposition der Ausgabe
      stop: Endposition der Ausgabe
  Returns:
      list: Liste der Bestellungen
  """
  start = request.args.get('start') or 0
  stop = request.args.get('stop') or -1
  orders:list[Order] = loadOrders(start,stop)
  return jsonify({'data':orders}), 200

@app.route('/orders/<id>', subdomain=sd.api, methods = ['DELETE'])
def delete_order(id) -> list:
  """Löscht eine Bestellung aus der Datenbank.
  
  Params:
      id: ID der Bestellung
  Returns:
      list: Liste der Bestellungen
  """
  length = db.llen('orders')
  for i in range(0,length,100):
    chunk:dict[str,Order] = {loads(order).id:order for order in db.lrange('orders',i,i+99)}
    if id in chunk:
      order:Order = loads(chunk[id])
      db.lrem('orders',1,chunk[id])
      return jsonify({
        'message':'order deleted',
        'data':order
      }), 200
  return jsonify({'error':f'order {id} not found'}), 200

@app.route('/orders', subdomain=sd.api, methods = ['POST'])
def new_order():
  """Anhängen einer neuen Bestellung.
  Schema entspricht der dataclass 'Order'
  Returns:
      dict('success':bool): Vorgang erfolgreich?
  """
  data:dict = request.get_json()
  data.update({'id':str(uuid.uuid4())})
  data.update({'timestamp': datetime.now()})
  try:
    items = [OrderPos(**item) for item in data['items']]
  except TypeError:
    return jsonify({'success':False, 'message':'Schema Item nicht korrekt'}), 200
  data['items'] = items
  try:
    order = Order(**data)
  except TypeError:
    return jsonify({'success':False, 'message':'Schema Order nicht korrekt'}), 200
  db.lpush("orders",dumps(order))
  return jsonify({'success': True,'data':data}), 200
  

### OPTIONS ###

@app.before_request
def optionRequestCors():
    if request.method == "OPTIONS":
        response = make_response()
        response.headers.add("Access-Control-Allow-Origin", "*")
        response.headers.add('Access-Control-Allow-Headers', "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, Authorization")
        response.headers.add('Access-Control-Allow-Methods', "DELETE, PATCH, POST, PUT, GET, OPTIONS")
        return response

@app.after_request
def normalRequestCors(response):
    if not request.method == "OPTIONS":
        response.headers.add("Access-Control-Allow-Origin", "*")
    return response

### MAIN ###

if __name__ == "__main__":
  if LOCAL:
    app.config['SERVER_NAME']='localhost:5000'
    app.run(debug=True)
  else:
    app.config['SERVER_NAME']='sp:443'
    app.run(debug=True, ssl_context=('server.cer', 'server.key'))