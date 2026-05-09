from fastapi import APIRouter, Depends, HTTPException, status
from jose import JWTError
from sqlalchemy import func, text
from sqlalchemy.orm import Session

from ..core.auth import decode_token, oauth2_scheme
from ..db import session
from ..db.models import LessonAttempt, User, XpLedger
from ..schemas.user import AllUsersResponse, UserProgress, UserResponse


async def get_current_user(db: Session = Depends(session.get_db), token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Não foi possível validar as credenciais",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = decode_token(token)
        username: str | None = payload.get("sub")

        if username is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token inválido: campo 'sub' ausente",
            )
        if payload.get("type") != "access":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Tipo de token inválido",
            )

    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="Erro ao decodificar token"
        )

    user = db.query(User).filter(User.username == username).first()
    if user is None:
        raise credentials_exception
    return user


router = APIRouter()


@router.get("/me", response_model=UserResponse)
def read_users_me(current_user: User = Depends(get_current_user)):
    return current_user


@router.get("/all", response_model=list[AllUsersResponse])
def read_all_users(
    db: Session = Depends(session.get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Lista todos os usuários do sistema.
    Requer autenticação de um usuário admin.
    """
    if str(current_user.type) != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Apenas administradores podem listar todos os usuários.",
        )

    users = db.query(User).all()
    return users


@router.delete("/{user_id}")
def delete_user(
    user_id: int,
    db: Session = Depends(session.get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Deleta um usuário do sistema.
    Requer autenticação de um usuário admin.
    """
    if str(current_user.type) != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Apenas administradores podem deletar usuários.",
        )

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuário não encontrado.",
        )

    # Não permitir que admin delete a si mesmo
    if user.id == current_user.id: # type: ignore
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Não é possível deletar sua própria conta.",
        )

    db.delete(user)
    db.commit()

    return {"message": "Usuário deletado com sucesso."}