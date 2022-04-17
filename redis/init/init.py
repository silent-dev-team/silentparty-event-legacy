import redis, json, sys
from pickle import loads, dumps
from dataclasses import dataclass
from typing import List, Dict
sys.path.append('./server')
from models import *

r = redis.Redis()

with open('./redis/init/init.json') as f:
  j = json.loads(f.read())

for id, content in j['tickets'].items():
  r.hset('ticket:'+id,mapping=content)

items = dumps(objList(j['items'],ShopItem))
r.mset({
  "shopItems": items,
  "seed": 'jdjdjdjdjdjdjdj'
})
