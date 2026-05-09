import bcrypt
from datetime import UTC, datetime, timedelta
from fastapi.security import OAuth2PasswordBearer
from jose import jwt
from sqlalchemy.orm import Session

from src.db.models import User
from src.core.settings import settings

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")


def hash_password(password: str) -> str:
    # Transforma a string em bytes
    pwd_bytes = password.encode("utf-8")
    # Gera o salt e o hash
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(pwd_bytes, salt)
    # Retorna como string para salvar no banco
    return hashed.decode("utf-8")


def get_user_by_username(db: Session, username: str) -> User | None:
    normalized_username = username.strip().lower()
    return db.query(User).filter(User.username == normalized_username).first()


def get_user_by_username_or_email(db: Session, identifier: str) -> User | None:
    """Busca usuário por username ou email (case insensitive)."""
    normalized_identifier = identifier.strip().lower()
    return db.query(User).filter(
        (User.username == normalized_identifier) | (User.email == normalized_identifier)
    ).first()


def verify_password(plain_password: str, hashed_password: str) -> bool:
    try:
        return bcrypt.checkpw(
            plain_password.encode("utf-8"), hashed_password.encode("utf-8")
        )
    except Exception:
        return False


def _create_token(data: dict, expires_delta: timedelta, token_type: str) -> str:
    payload = data.copy()
    payload.update(
        {
            "exp": datetime.now(UTC) + expires_delta,
            "type": token_type,
        }
    )
    return jwt.encode(payload, settings.secret_key, algorithm=settings.algorithm)


def create_access_token(data: dict) -> str:
    return _create_token(
        data=data,
        expires_delta=timedelta(minutes=settings.access_token_expire_minutes),
        token_type="access",
    )


def create_refresh_token(data: dict) -> str:
    return _create_token(
        data=data,
        expires_delta=timedelta(days=settings.refresh_token_expire_days),
        token_type="refresh",
    )


def decode_token(token: str) -> dict:
    return jwt.decode(token, settings.secret_key, algorithms=[settings.algorithm])
