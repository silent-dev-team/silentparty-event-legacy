from dataclasses import dataclass
from typing import List, Dict
from datetime import datetime


@dataclass
class ShopItem:
  id: int
  name: str
  price: float
  reference: int = None
  deposit: bool = False
  img: str = None
  tags: tuple = ()

@dataclass
class OrderPos:
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