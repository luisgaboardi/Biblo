from random import shuffle

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session, load_only
from typing import List
from ..api.users import get_current_user
from ..db.models import Lesson, User
from ..schemas.lesson import LessonBase, LessonCreate, LessonShort
from ..db.session import get_db


router = APIRouter()


@router.get("/", response_model=List[LessonShort])
def list_lessons(
    db: Session = Depends(get_db),
    search: str | None = Query(default=None),
    book: str | None = Query(default=None),
    level: int | None = Query(default=None),
    limit: int = Query(default=50, ge=1, le=200),
    offset: int = Query(default=0, ge=0),
):
    query = (
        db.query(Lesson)
        .options(
            load_only(
                Lesson.id, 
                Lesson.title, 
                Lesson.level, 
                Lesson.book
            )
        )
    )

    if search:
        query = query.filter(Lesson.title.ilike(f"%{search}%"))
    if book:
        query = query.filter(Lesson.book == book)
    if level:
        query = query.filter(Lesson.level == level)

    return (
        query.order_by(Lesson.book.asc(), Lesson.title.asc(), Lesson.level.asc())
        .offset(offset)
        .limit(limit)
        .all()
    )


@router.get("/{lesson_id}", response_model=LessonBase)
def get_lesson(
    lesson_id: int, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    lesson = db.query(Lesson).filter(Lesson.id == lesson_id).first()
    
    if not lesson:
        raise HTTPException(status_code=404, detail="Lição não encontrada")

    if str(current_user.type) in ["teacher", "admin"]:
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
def create_lesson(
    lesson_in: LessonCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if str(current_user.type) not in ["teacher", "admin"]:
        raise HTTPException(status_code=403, detail="Apenas professores e administradores podem criar lições")

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
def delete_lesson(
    lesson_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if str(current_user.type) not in ["teacher", "admin"]:
        raise HTTPException(status_code=403, detail="Apenas professores e administradores podem excluir lições")
    lesson = db.query(Lesson).filter(Lesson.id == lesson_id).first()
    if not lesson:
        raise HTTPException(status_code=404, detail="Lição não encontrada")
    db.delete(lesson)
    db.commit()
    return None


@router.put("/{lesson_id}", response_model=LessonBase)
def update_lesson(
    lesson_id: int,
    lesson_data: LessonCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if str(current_user.type) not in ["teacher", "admin"]:
        raise HTTPException(status_code=403, detail="Apenas professores e administradores podem editar lições")
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