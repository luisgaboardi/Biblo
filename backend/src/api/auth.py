from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from jose import JWTError
from sqlalchemy.orm import Session
from datetime import datetime, timedelta, UTC
from secrets import token_urlsafe
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

from ..db.session import get_db
from ..core.auth import (
    create_access_token,
    create_refresh_token,
    decode_token,
    get_user_by_username,
    get_user_by_username_or_email,
    hash_password,
    verify_password,
    oauth2_scheme,
)
from ..core.settings import settings
from ..schemas.user import (
    UserCreate,
    UserResponse,
    Token,
    ForgotPasswordRequest,
    ForgotPasswordResponse,
    ResetPasswordRequest,
    CreateTeacherRequest,
)
from ..db.models import User, PasswordResetToken

router = APIRouter()


def send_reset_email(email: str, token: str) -> bool:
    """Envia email de reset de senha. Retorna True se bem-sucedido."""
    # Debug: mostra valores de configuração
    print(f"📧 SMTP_USER: {settings.smtp_user if settings.smtp_user else '(vazio)'}")
    print(f"📧 SMTP_PASSWORD: {'***' if settings.smtp_password else '(vazio)'}")
    print(
        f"📧 SMTP_FROM_EMAIL: {settings.smtp_from_email if settings.smtp_from_email else '(vazio)'}"
    )

    if not settings.smtp_user or not settings.smtp_password:
        print(f"⚠️  SMTP não configurado. Reset token para {email}: {token}")
        return True  # Simula sucesso em desenvolvimento

    try:
        reset_link = f"{settings.frontend_url}/reset-password?token={token}"

        from_email = settings.smtp_from_email or settings.smtp_user

        msg = MIMEMultipart("alternative")
        msg["Subject"] = "Recuperar Senha - BIBLO"
        msg["From"] = from_email
        msg["To"] = email

        # Versão texto
        text = f"""
Olá!

Você solicitou uma recuperação de senha no BIBLO.

Clique no link abaixo para resetar sua senha (válido por 1 hora):

{reset_link}

Se você não solicitou esta recuperação, ignore este email.

Atenciosamente,
BIBLO
"""

        # Versão HTML
        html = f"""
<html>
  <body>
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center; color: white; border-radius: 8px 8px 0 0;">
        <h1 style="margin: 0;">BIBLO</h1>
      </div>
      <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; border: 1px solid #ddd;">
        <p>Olá!</p>
        <p>Você solicitou uma recuperação de senha no BIBLO.</p>
        <p>Clique no botão abaixo para resetar sua senha (válido por 1 hora):</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="{reset_link}" style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">
            Recuperar Senha
          </a>
        </div>
        
        <p style="color: #666; font-size: 12px;">
          Se você não solicitou esta recuperação, ignore este email.
        </p>
      </div>
    </div>
  </body>
</html>
"""

        part1 = MIMEText(text, "plain")
        part2 = MIMEText(html, "html")
        msg.attach(part1)
        msg.attach(part2)

        with smtplib.SMTP(settings.smtp_server, settings.smtp_port) as server:
            server.starttls()
            server.login(settings.smtp_user, settings.smtp_password)
            server.send_message(msg)

        return True
    except Exception as e:
        print(f"❌ Erro ao enviar email: {e}")
        return False


def authenticate_user(db: Session, identifier: str, password: str) -> User | None:
    """Autentica usuário por username ou email."""
    user = get_user_by_username_or_email(db, identifier)
    if not user:
        return None
    if not verify_password(password, str(user.hashed_password)):
        return None
    return user


def create_tokens_for_user(user: User) -> dict:
    return {
        "access_token": create_access_token(data={"sub": user.username}),
        "refresh_token": create_refresh_token(data={"sub": user.username}),
        "token_type": "bearer",
    }


@router.post("/signup", response_model=UserResponse)
def signup(user_data: UserCreate, db: Session = Depends(get_db)):
    username = user_data.username.strip().lower()
    email = user_data.email.strip().lower()

    # Verifica se usuário ou email já existem
    db_user = (
        db.query(User)
        .filter((User.username == username) | (User.email == email))
        .first()
    )
    if db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Usuário ou Email já cadastrados.",
        )

    new_user = User(
        username=username,
        email=email,
        hashed_password=hash_password(user_data.password),
        type="student",
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user


@router.post("/login", response_model=Token)
def login(data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = authenticate_user(db, data.username, data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Usuário ou senha incorretos.",
        )

    return create_tokens_for_user(user)


@router.post("/refresh", response_model=Token)
def refresh_token(refresh_token: str, db: Session = Depends(get_db)):
    try:
        payload = decode_token(refresh_token)
    except JWTError as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Refresh token inválido.",
        ) from exc

    if payload.get("type") != "refresh":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Tipo de token inválido.",
        )

    username = payload.get("sub")
    if not username:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Refresh token inválido.",
        )

    user = db.query(User).filter(User.username == username).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Usuário não encontrado.",
        )

    return create_tokens_for_user(user)


@router.post("/forgot-password", response_model=ForgotPasswordResponse)
def forgot_password(request: ForgotPasswordRequest, db: Session = Depends(get_db)):
    email = request.email.strip().lower()

    user = db.query(User).filter(User.email == email).first()

    # Sempre retorna mensagem genérica por segurança
    if user:
        # Gera token de reset
        token = token_urlsafe(32)
        expires_at = datetime.now(UTC) + timedelta(hours=1)

        # Salva token no banco
        reset_token = PasswordResetToken(
            user_id=user.id, token=token, expires_at=expires_at
        )
        db.add(reset_token)
        db.commit()

        # Envia email
        send_reset_email(str(user.email), token)
        print(f"✓ Email de reset enviado para {user.email}")
    else:
        print(f"ℹ️  Tentativa de reset para email não cadastrado: {email}")

    # Por segurança, não revela se o email existe ou não
    return ForgotPasswordResponse(
        message="Se o e-mail estiver cadastrado, você receberá instruções para redefinir sua senha."
    )


@router.post("/reset-password", response_model=ForgotPasswordResponse)
def reset_password(request: ResetPasswordRequest, db: Session = Depends(get_db)):
    # Busca o token de reset
    reset_token = (
        db.query(PasswordResetToken)
        .filter(
            PasswordResetToken.token == request.token, PasswordResetToken.used == False
        )
        .first()
    )

    if not reset_token:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Token de reset inválido ou expirado.",
        )

    # Verifica se o token expirou
    expires_at = reset_token.expires_at  # type: ignore
    if expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=UTC)
    if expires_at < datetime.now(UTC):  # type: ignore
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Token de reset expirou. Solicite um novo.",
        )

    # Busca o usuário
    user = db.query(User).filter(User.id == reset_token.user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Usuário não encontrado."
        )

    # Atualiza a senha
    user.hashed_password = hash_password(request.password)  # type: ignore
    reset_token.used = True  # type: ignore

    db.add(user)
    db.add(reset_token)
    db.commit()

    print(f"✓ Senha resetada para usuário: {user.username}")

    return ForgotPasswordResponse(
        message="Senha alterada com sucesso. Você pode fazer login com sua nova senha."
    )


@router.post("/create-teacher", response_model=UserResponse)
def create_teacher(
    request: CreateTeacherRequest,
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
):
    """
    Cria um novo usuário do tipo teacher.
    Requer autenticação de um usuário admin.

    **Segurança**: Apenas users autenticados com role 'admin' podem criar novos teachers.
    """
    # Valida e decodifica o token
    try:
        payload = decode_token(token)
        username = payload.get("sub")
        if not username:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token inválido.",
            )
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token inválido ou expirado.",
        )

    # Busca o usuário autenticado
    current_user = get_user_by_username(db, username)
    if not current_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Usuário não encontrado.",
        )

    # Verifica permissão de admin
    if str(current_user.type) != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Apenas administradores podem criar novos professores.",
        )

    # Valida dados do novo teacher
    teacher_username = request.username.strip().lower()
    teacher_email = request.email.strip().lower()

    # Verifica se usuário ou email já existem
    existing_user = (
        db.query(User)
        .filter((User.username == teacher_username) | (User.email == teacher_email))
        .first()
    )
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Usuário ou Email já cadastrados.",
        )

    # Cria novo teacher
    # Gera senha aleatória de 12 caracteres
    random_password = token_urlsafe(12)

    new_teacher = User(
        username=teacher_username,
        email=teacher_email,
        hashed_password=hash_password(random_password),
        type="teacher",
    )
    db.add(new_teacher)
    db.commit()
    db.refresh(new_teacher)

    print(f"✓ Novo teacher criado: {new_teacher.username} por {current_user.username}")
    print(f"✓ Senha temporária gerada: {random_password}")

    return new_teacher
