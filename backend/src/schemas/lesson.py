from pydantic import BaseModel, ConfigDict
from typing import List, Dict, Any

class LessonBase(BaseModel):
    id: int
    title: str
    level: int
    book: str
    questions: List[Dict[str, Any]]

    model_config = ConfigDict(from_attributes=True)

class LessonShort(BaseModel):
    id: int
    title: str
    level: int
    book: str

    class Config:
        from_attributes = True

class LessonCreate(BaseModel):
    title: str
    level: int
    book: str
    questions: List[Dict[str, Any]]