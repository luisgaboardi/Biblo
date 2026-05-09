from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..api.users import get_current_user
from ..core.gamification import calculate_earned_xp, compute_score
from ..db.models import Lesson, LessonAttempt, ReviewItem, User, XpLedger
from ..db.session import get_db
from ..schemas.attempt import AttemptResponse, FinishAttemptRequest, StartAttemptRequest

router = APIRouter()


@router.post("/start", response_model=AttemptResponse)
def start_attempt(
    payload: StartAttemptRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    lesson = db.query(Lesson).filter(Lesson.id == payload.lesson_id).first()
    if not lesson:
        raise HTTPException(status_code=404, detail="Lição não encontrada")

    attempt = LessonAttempt(user_id=current_user.id, lesson_id=lesson.id)
    db.add(attempt)
    db.commit()
    db.refresh(attempt)
    return attempt


@router.post("/{attempt_id}/finish", response_model=AttemptResponse)
def finish_attempt(
    attempt_id: int,
    payload: FinishAttemptRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    attempt = (
        db.query(LessonAttempt)
        .filter(LessonAttempt.id == attempt_id, LessonAttempt.user_id == current_user.id)
        .first()
    )
    if not attempt:
        raise HTTPException(status_code=404, detail="Tentativa não encontrada")

    attempt.correct_count = payload.correct_count
    attempt.total_count = payload.total_count
    attempt.score = compute_score(payload.correct_count, payload.total_count)

    earned_xp = calculate_earned_xp(payload.correct_count, payload.total_count, current_user.streak)
    current_user.xp += earned_xp

    db.add(
        XpLedger(
            user_id=current_user.id,
            source="lesson_finish",
            amount=earned_xp,
            metadata_json={
                "attempt_id": attempt.id,
                "lesson_id": attempt.lesson_id,
                "score": attempt.score,
            },
        )
    )

    for question_key in payload.missed_question_keys:
        review_item = (
            db.query(ReviewItem)
            .filter(
                ReviewItem.user_id == current_user.id,
                ReviewItem.lesson_id == attempt.lesson_id,
                ReviewItem.question_key == question_key,
            )
            .first()
        )
        if review_item:
            review_item.suspended = False
            review_item.next_review_at = attempt.created_at
        else:
            db.add(
                ReviewItem(
                    user_id=current_user.id,
                    lesson_id=attempt.lesson_id,
                    question_key=question_key,
                    next_review_at=attempt.created_at,
                )
            )

    db.commit()
    db.refresh(attempt)
    return attempt
