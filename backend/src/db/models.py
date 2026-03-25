from sqlalchemy import JSON, Column, Integer, String, DateTime
from sqlalchemy.orm import Mapped, mapped_column
from datetime import datetime
from typing import Any, Dict, List
from src.db.base import Base
from sqlalchemy import Column, Integer, String, DateTime


class Lesson(Base):
    __tablename__ = "lessons"
    
    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    title: Mapped[str] = mapped_column(String, nullable=False)
    level: Mapped[int] = mapped_column(Integer, default=1)
    
    # Armazena a lista de livros: ["Gênesis", "Salmos"]
    books: Mapped[List[str]] = mapped_column(JSON, nullable=False)
    
    # Armazena o objeto de questões: {"questions": [...]}
    content: Mapped[Dict[str, Any]] = mapped_column(JSON, nullable=False)



class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    
    # Atributos de Gamificação (Iniciam com valores padrão)
    xp = Column(Integer, default=0)
    streak = Column(Integer, default=0)
    hearts = Column(Integer, default=5)
    last_lesson_date = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.astimezone(datetime.now()))
