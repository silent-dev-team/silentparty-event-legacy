import redis, json, sys
from pickle import loads, dumps
from dataclasses import dataclass
from typing import List, Dict
sys.path.append('./server')
from models import *

r = redis.Redis()

items = [
  {
    'id': 100,
    'name': 'Bier',
    'img': 'https://www.fuessenaktuell.de/wp-content/uploads/2019/08/FA_09_19_Bier.jpg',
    'price': 2.5,
    'cup': True
  },
  {
    'id': 101,
    'name': 'Cola',
    'img': 'https://www.cocacolaep.com/assets/Uploads/resources/04996d7841/Neue-Verschlusse-Coca-Cola900x550__ScaleMaxWidthWzk0MF0.jpg',
    'price': 1.5,
    'cup': True
  },
  {
    'id': 102,
    'name': 'Fanta',
    'img': 'https://www.bestinfood-shop.de/media/image/ff/23/b3/fanta-orange-dose-24x-330ml-95451-7771534.jpg',
    'price': 1.5,
    'cup': True
  },
  {
    'id': 103,
    'name': 'Wasser',
    'img': 'https://www.hammer.de/media/fitnesswissen/ernaehrung-blog/wasser/wasser-teaser_300.jpg',
    'price': 1,
    'cup': True
  }
]

items = dumps(objList(items,Item))

r.mset({
  "items": items
})
