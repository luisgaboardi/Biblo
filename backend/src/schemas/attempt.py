from pydantic import BaseModel, ConfigDict


class StartAttemptRequest(BaseModel):
    lesson_id: int


class FinishAttemptRequest(BaseModel):
    correct_count: int
    total_count: int
    missed_question_keys: list[str] = []


class AttemptResponse(BaseModel):
    id: int
    lesson_id: int
    correct_count: int
    total_count: int
    score: int

    model_config = ConfigDict(from_attributes=True)
