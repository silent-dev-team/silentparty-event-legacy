from flask import Flask, Response, request, render_template, make_response, send_from_directory, redirect, jsonify
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

@app.route('/api/ping')
def ping():
  return jsonify({
      'ping':True
    }), 200

@app.route('/api/tickets', methods = ['GET'])
def tickets():
  return jsonify({
      'data':test
    }), 200
  
@app.route('/api/tickets/<id>', methods = ['PUT', 'GET'])
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
  
if __name__ == "__main__":
  app.config['SERVER_NAME']='sp:443'
  app.run(debug=True, ssl_context=('server.cer', 'server.key'))