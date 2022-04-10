from dataclasses import dataclass

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
  
