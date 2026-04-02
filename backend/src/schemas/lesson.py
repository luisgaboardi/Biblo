from pydantic import BaseModel, ConfigDict
from typing import List, Dict, Any

class LessonBase(BaseModel):
    id: int
    title: str
    level: int
    book: str
    questions: List[Dict[str, Any]] # Retornamos as questões soltas para o frontend

    model_config = ConfigDict(from_attributes=True)

class LessonShort(BaseModel):
    id: int
    title: str
    level: int
    book: str

    class Config:
        from_attributes = True

# Schema para criação via Admin (API POST)
class LessonCreate(BaseModel):
    title: str
    level: int
    book: str
    questions: List[Dict[str, Any]] # O Admin envia as questões soltas