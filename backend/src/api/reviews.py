from datetime import UTC, datetime

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from ..api.users import get_current_user
from ..core.gamification import compute_next_review
from ..db.models import ReviewItem, User
from ..db.session import get_db
from ..schemas.review import ReviewItemResponse, ReviewSubmitRequest

router = APIRouter()


@router.get("/due", response_model=list[ReviewItemResponse])
def list_due_reviews(
    limit: int = Query(default=20, ge=1, le=200),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    now = datetime.now(UTC)
    return (
        db.query(ReviewItem)
        .filter(
            ReviewItem.user_id == current_user.id,
            ReviewItem.suspended.is_(False),
            ReviewItem.next_review_at <= now,
        )
        .order_by(ReviewItem.next_review_at.asc())
        .limit(limit)
        .all()
    )


@router.post("/{review_item_id}/submit", response_model=ReviewItemResponse)
def submit_review(
    review_item_id: int,
    payload: ReviewSubmitRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    item = (
        db.query(ReviewItem)
        .filter(ReviewItem.id == review_item_id, ReviewItem.user_id == current_user.id)
        .first()
    )
    if not item:
        raise HTTPException(status_code=404, detail="Item de revisão não encontrado")

    repetitions, interval_days, easiness, next_review_at = compute_next_review(
        was_correct=payload.was_correct,
        repetitions=item.repetitions,
        interval_days=item.interval_days,
        easiness=item.easiness,
    )

    item.repetitions = repetitions
    item.interval_days = interval_days
    item.easiness = easiness
    item.last_review_at = datetime.now(UTC)
    item.next_review_at = next_review_at
    db.commit()
    db.refresh(item)
    return item
