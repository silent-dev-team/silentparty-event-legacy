from flask import Flask, Response, request, render_template, make_response, send_from_directory, redirect, jsonify
from flask_sse import sse
from datetime import datetime
import redis, json, sys, os
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
    self.api='api'
    self.ticket='ticket'
    self.kasse='kasse'
    if local:
      self.api=None
      self.ticket=None
      self.kasse=None

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


### INSTANCES ###

app = Flask(__name__)
app.config["REDIS_URL"] = 'redis://localhost' if LOCAL else "redis://sp"
app.register_blueprint(sse, url_prefix='/stream')
db = redis.Redis()

sd = Subdomain(LOCAL)

entry = Entry(True)

### STARTPAGE ###

@app.route('/')
def localWebServer_index():
  return redirect('index.html')

@app.route('/<path:path>')
def localWebServer_pwa(path):
  return send_from_directory('../localWebServer/',path)


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


@app.route('/tickets', subdomain=sd.api, methods = ['GET'])
def get_tickets():
  tickets = [ticket.decode() for ticket in db.keys('ticket:*')]
  filtered_tickets = [] if len(request.args) > 0 else tickets
  for k, v in request.args.to_dict().items():
    for ticket in tickets:
      hash = db.hget(ticket,k)
      if not hash:
        continue
      if hash.decode() == v:
        filtered_tickets+=[ticket]
  tickets = list(dict.fromkeys(filtered_tickets))
  return jsonify({
      'data':tickets
    }), 200

@app.route('/tickets/<id>', subdomain=sd.api, methods = ['GET'])
def get_ticket(id): 
  ticket_b = db.hgetall('ticket:'+str(id))
  ticket = {k.decode(): v.decode() for k,v in ticket_b.items()}
  return jsonify({'data':ticket}), 200

#in progress
@app.route('/tickets/<id>', subdomain=sd.api, methods = ['PUT'])
def ticket_checkin(id): 
  ticket_b = db.hgetall('ticket:'+str(id))
  ticket = {k.decode(): v.decode() for k,v in ticket_b.items()}
  return jsonify({'data':ticket}), 200

#legacy
@app.route('/legacy/tickets/<id>', subdomain=sd.api, methods = ['PUT', 'GET']) 
def tickets_checkin_legacy(id):
  if id not in test:
    return jsonify({
      'id':id,
      'valid':False,
      'data': None
    }), 400
  data = request.get_json() or {}
  checkin:bool = False
  if request.method == 'PUT' and 'checkin' in data:
    checkin = data['checkin'] == True
  card = dict(test[id])
  if not card['checked'] and checkin:
    card['time'] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    test[id] = dict(card)
    test[id]['checked'] = True
  return jsonify({
      'id':id,
      'valid':True,
      'data':card
    }), 200

@app.route('/shopItems', subdomain=sd.api, methods = ['GET'])
def get_shopItems():
  """Lädt die Items (Getränke, Angebote, HP) aus der Datenbank

  Returns:
      list<Itmes>: Liste aller Items
  """
  items = json.loads(db.get('shopItems'))
  return jsonify({'data':items}), 200

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
  stop = request.args.get('stop') or db.llen('orders')
  orders = [loads(order) for order in db.lrange('orders',start,stop)]
  return jsonify({'data':orders}), 200

@app.route('/orders', subdomain=sd.api, methods = ['POST'])
def new_order():
  """Anhängen einer neuen Bestellung.
  Schema entspricht der dataclass 'Order'
  Returns:
      dict('success':bool): Vorgang erfolgreich?
  """
  data:dict = request.get_json()
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
  return jsonify({'success': True}), 200
  

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