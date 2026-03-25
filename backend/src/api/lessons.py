import copy

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..db import session, models
from src.schemas.lesson import LessonBase, LessonCreate
from ..db.session import get_db
import random
from ..core.auth import oauth2_scheme



router = APIRouter()

@router.get("/", response_model=List[LessonBase])
def list_lessons(db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)):
    # 1. Busca todas as lições do banco
    lessons = db.query(models.Lesson).all()
    
    # 2. Criamos uma lista nova para processar o shuffle sem afetar o Banco de Dados
    processed_lessons = []
    
    for lesson in lessons:
        # Transformamos o objeto do banco em um dicionário ou cópia profunda
        # Isso garante que o shuffle ocorra apenas nesta resposta da API
        lesson_data = copy.deepcopy(lesson.content) 
        
        if lesson_data and "questions" in lesson_data:
            random.shuffle(lesson_data["questions"])
            
        # Criamos um objeto temporário para o retorno
        lesson.content = lesson_data
        processed_lessons.append(lesson)
        
    return processed_lessons


@router.get("/{lesson_id}", response_model=LessonBase)
def get_lesson(lesson_id: int, db: Session = Depends(session.get_db)):
    lesson = db.query(models.Lesson).filter(models.Lesson.id == lesson_id).first()
    if not lesson:
        raise HTTPException(status_code=404, detail="Lição não encontrada")
    return lesson


@router.post("/", response_model=LessonBase)
def create_lesson(lesson_in: LessonCreate, db: Session = Depends(get_db)):
    new_lesson = models.Lesson(
        title=lesson_in.title,
        level=lesson_in.level,
        books=lesson_in.books,
        content={"questions": lesson_in.questions} # Transforma a lista em objeto content
    )
    db.add(new_lesson)
    db.commit()
    db.refresh(new_lesson)
    return new_lesson


@router.delete("/{lesson_id}", status_code=204)
def delete_lesson(lesson_id: int, db: Session = Depends(session.get_db)):
    lesson = db.query(models.Lesson).filter(models.Lesson.id == lesson_id).first()
    if not lesson:
        raise HTTPException(status_code=404, detail="Lição não encontrada")
    db.delete(lesson)
    db.commit()
    return None


@router.put("/{lesson_id}", response_model=LessonCreate)
def update_lesson(lesson_id: int, lesson_data: LessonCreate, db: Session = Depends(session.get_db)):
    lesson = db.query(models.Lesson).filter(models.Lesson.id == lesson_id).first()
    if not lesson:
        raise HTTPException(status_code=404, detail="Lição não encontrada")
    
    lesson.title = lesson_data.title
    lesson.books = lesson_data.books
    lesson.level = lesson_data.level
    lesson.questions = lesson_data.questions
    
    db.commit()
    db.refresh(lesson)
    return lesson