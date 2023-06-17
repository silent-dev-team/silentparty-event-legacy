import redis, json, sys
from pickle import loads, dumps
from dataclasses import dataclass
from typing import List, Dict
sys.path.append('./server')
#from models import *

r = redis.Redis()

with open('./redis/init/items.json') as f:
  items = json.loads(f.read())

#with open('./redis/init/tickets.json') as f:
#  tickets = json.loads(f.read())

#for id, content in tickets.items():
#  r.hset('ticket:'+id,mapping=content)

#items = dumps(objList(j['items'],ShopItem))

r.mset({
  "shopItems": json.dumps(items)
})
print('Fertig')