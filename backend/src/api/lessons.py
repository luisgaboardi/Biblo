from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..db import models
from src.schemas.lesson import LessonBase, LessonCreate
from ..db.session import get_db
import random
from ..core.auth import oauth2_scheme


router = APIRouter()


@router.get("/", response_model=List[LessonBase])
def list_lessons(db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)):
    db_lessons = db.query(models.Lesson).all()
    processed_lessons = []
    
    for db_lesson in db_lessons:
        lesson_api = LessonBase.model_validate(db_lesson)
        
        if lesson_api.questions:
            random.shuffle(lesson_api.questions)
            
            for q in lesson_api.questions:
                if q.get("type") == "multiple_choice" and "options" in q:
                    random.shuffle(q["options"])
                if q.get("type") == "order_sequence" and "options" in q:
                    random.shuffle(q["options"])

        processed_lessons.append(lesson_api)
        
    return processed_lessons

@router.get("/no-shuffle", response_model=List[LessonBase])
def list_lessons_no_shuffle(db: Session = Depends(get_db)):
    db_lessons = db.query(models.Lesson).all()
    return [LessonBase.model_validate(db_lesson) for db_lesson in db_lessons]


# @router.get("/{lesson_id}", response_model=LessonBase)
# def get_lesson(lesson_id: int, db: Session = Depends(session.get_db)):
#     lesson = db.query(models.Lesson).filter(models.Lesson.id == lesson_id).first()
#     if not lesson:
#         raise HTTPException(status_code=404, detail="Lição não encontrada")
#     return lesson


@router.post("/", response_model=LessonBase)
def create_lesson(lesson_in: LessonCreate, db: Session = Depends(get_db)):

    lesson = models.Lesson(
        title=lesson_in.title,
        book=lesson_in.book,
        level=lesson_in.level,
        questions=lesson_in.questions
    )
    db.add(lesson)
    db.commit()
    db.refresh(lesson)
    return lesson


@router.delete("/{lesson_id}", status_code=204)
def delete_lesson(lesson_id: int, db: Session = Depends(get_db)):
    lesson = db.query(models.Lesson).filter(models.Lesson.id == lesson_id).first()
    if not lesson:
        raise HTTPException(status_code=404, detail="Lição não encontrada")
    db.delete(lesson)
    db.commit()
    return None


@router.put("/{lesson_id}", response_model=LessonBase) # Use LessonBase para o retorno
def update_lesson(lesson_id: int, lesson_data: LessonCreate, db: Session = Depends(get_db)):
    lesson = db.query(models.Lesson).filter(models.Lesson.id == lesson_id).first()
    
    if not lesson:
        raise HTTPException(status_code=404, detail="Lição não encontrada")
    
    # Atualização em massa dos campos enviados pelo Schema
    lesson.title = lesson_data.title
    lesson.book = lesson_data.book
    lesson.level = lesson_data.level
    
    # Como definimos MutableList no model, isso aqui vai disparar o UPDATE corretamente
    lesson.questions = lesson_data.questions
    
    db.commit()
    db.refresh(lesson)
    return lesson