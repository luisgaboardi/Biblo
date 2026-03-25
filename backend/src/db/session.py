import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from typing import Generator

# 1. Recupera a URL do banco das variáveis de ambiente (definidas no .env/docker-compose)
DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    raise ValueError("A variável de ambiente DATABASE_URL não foi definida.")

# 2. O Engine é o componente que realmente "fala" com o driver do Postgres
engine = create_engine(DATABASE_URL)

# 3. O SessionLocal é uma fábrica de sessões. 
# autocommit=False: Garante que nada é salvo sem um db.commit() explícito (segurança).
# autoflush=False: Evita que o SQLAlchemy envie mudanças parciais antes da hora.
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# 4. A Função "Mágica" (Dependency Injection)
# Esta função será usada pelo FastAPI (Depends) para garantir que cada 
# requisição HTTP tenha sua própria conexão e que ela seja FECHADA ao terminar.
def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()