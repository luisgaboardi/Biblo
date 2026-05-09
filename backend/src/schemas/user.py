from pydantic import BaseModel, EmailStr


class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    type: str  # "student" ou "teacher"
    xp: int
    streak: int
    hearts: int

    class Config:
        from_attributes = True

class AllUsersResponse(BaseModel):
    id: int
    username: str
    email: str
    type: str


class ForgotPasswordRequest(BaseModel):
    email: EmailStr


class ForgotPasswordResponse(BaseModel):
    message: str


class ResetPasswordRequest(BaseModel):
    token: str
    password: str


class CreateTeacherRequest(BaseModel):
    username: str
    email: EmailStr


class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str


class UserProgress(BaseModel):
    xp: int
    streak: int
    hearts: int
    lessons_completed: int
    average_score: int
    xp_last_7_days: int
