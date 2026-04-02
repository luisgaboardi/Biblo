from random import shuffle

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, load_only
from typing import List
from ..api.users import get_current_user
from ..db.models import Lesson, User, User
from ..schemas.lesson import LessonBase, LessonCreate, LessonShort
from ..db.session import get_db


router = APIRouter()


@router.get("/", response_model=List[LessonShort])
def list_lessons(db: Session = Depends(get_db)):
    lessons = db.query(Lesson).options(
        load_only(
            Lesson.id, 
            Lesson.title, 
            Lesson.level, 
            Lesson.book
        )
    ).all()
    
    return lessons


@router.get("/{lesson_id}", response_model=LessonBase)
def get_lesson(
    lesson_id: int, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    lesson = db.query(Lesson).filter(Lesson.id == lesson_id).first()
    
    if not lesson:
        raise HTTPException(status_code=404, detail="Lição não encontrada")

    if str(current_user.type) == "teacher":
        return lesson

    lesson_data = LessonBase.model_validate(lesson).model_dump()

    if lesson_data.get("questions"):
        # 1. Embaralha a ordem das questões
        shuffle(lesson_data["questions"])
        
        # 2. Embaralha as opções dentro de cada questão
        for q in lesson_data["questions"]:
            if "options" in q and isinstance(q["options"], list):
                shuffle(q["options"])

    return lesson_data


@router.post("/", response_model=LessonBase)
def create_lesson(lesson_in: LessonCreate, db: Session = Depends(get_db)):

    lesson = Lesson(
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
    lesson = db.query(Lesson).filter(Lesson.id == lesson_id).first()
    if not lesson:
        raise HTTPException(status_code=404, detail="Lição não encontrada")
    db.delete(lesson)
    db.commit()
    return None


@router.put("/{lesson_id}", response_model=LessonBase) # Use LessonBase para o retorno
def update_lesson(lesson_id: int, lesson_data: LessonCreate, db: Session = Depends(get_db)):
    lesson = db.query(Lesson).filter(Lesson.id == lesson_id).first()
    
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