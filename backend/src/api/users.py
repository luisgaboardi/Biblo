from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from src.schemas.user import UserResponse
from ..db import session, models
from ..core.auth import oauth2_scheme, SECRET_KEY, ALGORITHM
from fastapi import Depends, HTTPException, status
from jose import JWTError, jwt


router = APIRouter()


async def get_current_user(db: Session = Depends(session.get_db), token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Não foi possível validar as credenciais",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str | None = payload.get("sub")
        
        if username is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token inválido: campo 'sub' ausente",
            )
        
        user = db.query(models.User).filter(models.User.username == username).first()

    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="Erro ao decodificar token"
        )

    # Busca no banco
    user = db.query(models.User).filter(models.User.username == username).first()
    if user is None:
        raise credentials_exception
    return user


@router.get("/me", response_model=UserResponse)
def read_users_me(current_user: models.User = Depends(get_current_user)):
    return current_user