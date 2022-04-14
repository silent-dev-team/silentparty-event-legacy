from dataclasses import dataclass
from typing import List, Dict


@dataclass
class Item:
  id: int
  name: str
  price: float
  cup: bool
  img: str = None

@dataclass
class Order:
  sum: float
  items: list
  timestamp: int
  ret: float  
  
def objList(objs:List[dict],T:type) -> list:
  return [T(**obj) for obj in objs]