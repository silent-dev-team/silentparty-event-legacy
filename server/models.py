from dataclasses import dataclass
from typing import List, Dict
from datetime import datetime


@dataclass
class ShopItem:
  id: int
  name: str
  price: float
  cup: bool = None
  img: str = None

@dataclass
class OrderItem:
  id: int
  name: str
  price: float
  number: int
  sum: float

@dataclass
class Order:
  sum: float
  items: list
  timestamp: datetime
  
def objList(objs:List[dict],T:type) -> list:
  return [T(**obj) for obj in objs]