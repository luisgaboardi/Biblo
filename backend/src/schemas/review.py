from datetime import datetime

from pydantic import BaseModel, ConfigDict


class ReviewItemResponse(BaseModel):
    id: int
    lesson_id: int
    question_key: str
    repetitions: int
    interval_days: int
    next_review_at: datetime

    model_config = ConfigDict(from_attributes=True)


class ReviewSubmitRequest(BaseModel):
    was_correct: bool
