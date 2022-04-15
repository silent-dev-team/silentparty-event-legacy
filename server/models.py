from dataclasses import dataclass
from typing import List, Dict
from datetime import datetime


@dataclass
class Item:
  id: int
  name: str
  price: float
  number: int = 0
  cup: bool = None
  img: str = None

@dataclass
class Order:
  sum: float
  items: list
  timestamp: datetime
  
def objList(objs:List[dict],T:type) -> list:
  return [T(**obj) for obj in objs]