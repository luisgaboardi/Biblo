from pydantic import BaseModel, ConfigDict
from typing import List, Dict, Any

class LessonBase(BaseModel):
    id: int
    title: str
    level: int
    books: List[str]  # Mudança crucial aqui
    content: Dict[str, Any] # Onde reside o {"questions": [...]}

    model_config = ConfigDict(from_attributes=True)

# Schema para criação via Admin (API POST)
class LessonCreate(BaseModel):
    title: str
    level: int
    books: List[str]
    questions: List[Dict[str, Any]] # O Admin envia as questões soltas