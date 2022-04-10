from dataclasses import dataclass
from typing import List, Dict

@dataclass
class Item:
  id: int
  name: str
  img: str
  price: float
  cup: bool

@dataclass
class Ticket:
  id: int
  checked: bool = False
  time: int = None
  
def objList(objs:List[dict],T:type) -> list:
  return [T(**obj) for obj in objs]