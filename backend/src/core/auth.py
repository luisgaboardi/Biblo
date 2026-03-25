import os

from passlib.context import CryptContext
from datetime import datetime, timedelta
from jose import jwt
from fastapi.security import OAuth2PasswordBearer

# O 'tokenUrl' deve apontar para a rota onde você faz o login (POST)
# Isso permite que a documentação do Swagger (o /docs) saiba onde autenticar
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")


# Configurações (Mantenha isso em variáveis de ambiente em produção)
SECRET_KEY = os.getenv("SECRET_KEY", "your_secret_key_here")  # Substitua por uma chave forte e secreta
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24  # 24 horas

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

import bcrypt

def hash_password(password: str) -> str:
    # Transforma a string em bytes
    pwd_bytes = password.encode('utf-8')
    # Gera o salt e o hash
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(pwd_bytes, salt)
    # Retorna como string para salvar no banco
    return hashed.decode('utf-8')

def verify_password(plain_password: str, hashed_password: str) -> bool:
    try:
        return bcrypt.checkpw(
            plain_password.encode('utf-8'),
            hashed_password.encode('utf-8')
        )
    except Exception:
        return False

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.astimezone(datetime.now()) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)