from flask import Flask, Response, request, render_template, make_response, send_from_directory, redirect, jsonify
from flask_sse import sse
from datetime import datetime
import redis, json, sys
from pickle import loads, dumps
from models import *

### VAR ###
#### Classes ####


class Entry:
  def __init__(self, value:bool = False):
    self._value = value
  def start(self):
    self._value = True
  def stop(self):
    self._value = False
  def get(self):
    return self._value

test = {
  '9999' : {
    "checked" : False,
    "time": None
  },
  '9998' : {
    "checked" : False,
    "time": None
  }
}

### INSTANCES ###

app = Flask(__name__)
app.config["REDIS_URL"] = 'redis://localhost' #"redis://sp"
app.register_blueprint(sse, url_prefix='/stream')
db = redis.Redis()

entry = Entry(True)

### STARTPAGE ###

@app.route('/')
def startpage_index():
  return redirect('index.html')

@app.route('/<path:path>')
def startpage_pwa(path):
  return send_from_directory('../startpage/',path)


### KASSE ###

@app.route('/', subdomain="kasse")
def kasse_index():
  return redirect('index.html')

@app.route('/<path:path>',subdomain="kasse")
def kasse_pwa(path):
  return send_from_directory('../kasse/dist',path)


### TICKET ###

@app.route('/', subdomain='ticket')
def ticket_index():
  return redirect('index.html')

@app.route('/<path:path>', subdomain='ticket')
def ticket_pwa(path):
  return send_from_directory('../ticket-pwa/dist',path)


### API ###

@app.route('/ping', subdomain='api')
def ping():
  return jsonify({
      'ping':True
    }), 200

@app.route('/entry', subdomain='api', methods = ['PUT', 'GET'])
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


@app.route('/tickets', subdomain='api', methods = ['GET'])
def get_tickets():
  return jsonify({
      'data':test
    }), 200
  
@app.route('/tickets/<id>', subdomain='api', methods = ['PUT', 'GET'])
def tickets(id):
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

@app.route('/items', subdomain='api', methods = ['GET'])
def get_items():
  items = loads(db.get('items'))
  return jsonify({'data':items}), 200


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
  if 'dev' in sys.argv:
    app.config['SERVER_NAME']='localhost:5000'
    app.run(debug=True)
  else:
    app.config['SERVER_NAME']='sp:443'
    app.run(debug=True, ssl_context=('server.cer', 'server.key'))