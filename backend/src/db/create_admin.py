# Script para criar primeiro admin
import sys
import os

# Adiciona o diretório raiz do projeto ao sys.path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', '..'))

from src.db.session import SessionLocal
from src.db.models import User
from src.core.auth import hash_password

db = SessionLocal()
admin = User(
    username='admin',
    email='admin@biblo.com',
    hashed_password=hash_password('admin123'),
    type='admin'
)
db.add(admin)
db.commit()
print('✓ Admin criado com sucesso!')