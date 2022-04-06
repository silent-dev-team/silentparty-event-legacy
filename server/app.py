from flask import Flask, Response, request, make_response, send_from_directory, redirect, jsonify
from datetime import datetime

app = Flask(__name__)


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

@app.route('/')
def index():
  return redirect('./templates/index.html')

### TICKET ###

@app.route('/<path:path>')
def ticket_pwa(path):
  return send_from_directory('../ticket-pwa/dist',path)

@app.route('/api/ping', host='ticket.lan')
def ping():
  return jsonify({
      'ping':True
    }), 200

@app.route('/api/tickets', methods = ['GET'], host='ticket.lan')
def tickets():
  return jsonify({
      'data':test
    }), 200
  
@app.route('/api/tickets/<id>', methods = ['PUT', 'GET'], host='ticket.lan')
def ticket(id):
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


### KASSE ###

@app.route('/<path:path>', host='kasse.lan')
def kasse_pwa(path):
  return send_from_directory('../kasse/dist',path)


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