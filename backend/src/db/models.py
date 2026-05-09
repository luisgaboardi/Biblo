from datetime import UTC, datetime
from typing import Any, Dict, List

from sqlalchemy import JSON, Boolean, Column, DateTime, ForeignKey, Index, Integer, String
from sqlalchemy.ext.mutable import MutableList
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.db.base import Base


class Lesson(Base):
    __tablename__ = "lessons"
    
    id: Mapped[int] = mapped_column(Integer, primary_key=True) 
    title: Mapped[str] = mapped_column(String, nullable=False)
    level: Mapped[int] = mapped_column(Integer, default=1)
    book: Mapped[str] = mapped_column(String, nullable=False)
    
    questions: Mapped[List[Dict[str, Any]]] = mapped_column(
        MutableList.as_mutable(JSON), 
        nullable=False
    )

    __table_args__ = (
        Index('ix_lessons_book_title_level', 'book', 'title', 'level'),
    )


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    type = Column(String, nullable=False, default="student")  # "student" ou "teacher"
    
    # Atributos de Gamificação (Iniciam com valores padrão)
    xp = Column(Integer, default=0)
    streak = Column(Integer, default=0)
    hearts = Column(Integer, default=5)
    last_lesson_date = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(UTC))
    attempts = relationship("LessonAttempt", back_populates="user", cascade="all, delete-orphan")
    xp_events = relationship("XpLedger", back_populates="user", cascade="all, delete-orphan")
    review_items = relationship("ReviewItem", back_populates="user", cascade="all, delete-orphan")
    password_reset_tokens = relationship("PasswordResetToken", back_populates="user", cascade="all, delete-orphan")


class LessonAttempt(Base):
    __tablename__ = "lesson_attempts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    lesson_id = Column(Integer, ForeignKey("lessons.id"), nullable=False, index=True)
    correct_count = Column(Integer, default=0, nullable=False)
    total_count = Column(Integer, default=0, nullable=False)
    score = Column(Integer, default=0, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(UTC))

    user = relationship("User", back_populates="attempts")
    lesson = relationship("Lesson")


class XpLedger(Base):
    __tablename__ = "xp_ledger"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    source = Column(String, nullable=False)
    amount = Column(Integer, nullable=False)
    metadata_json = Column(JSON, nullable=False, default=dict)
    created_at = Column(DateTime, default=lambda: datetime.now(UTC))

    user = relationship("User", back_populates="xp_events")


class ReviewItem(Base):
    __tablename__ = "review_items"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    lesson_id = Column(Integer, ForeignKey("lessons.id"), nullable=False, index=True)
    question_key = Column(String, nullable=False)
    easiness = Column(Integer, default=250, nullable=False)  # 2.5 scaled by 100
    interval_days = Column(Integer, default=1, nullable=False)
    repetitions = Column(Integer, default=0, nullable=False)
    next_review_at = Column(DateTime, nullable=False, default=lambda: datetime.now(UTC))
    last_review_at = Column(DateTime, nullable=True)
    suspended = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(UTC))

    user = relationship("User", back_populates="review_items")

    user = relationship("User")
    lesson = relationship("Lesson")


class PasswordResetToken(Base):
    __tablename__ = "password_reset_tokens"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    token = Column(String, unique=True, nullable=False, index=True)
    expires_at = Column(DateTime, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(UTC))
    used = Column(Boolean, default=False, nullable=False)

    user = relationship("User", back_populates="password_reset_tokens")
