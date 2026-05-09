from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from typing import Generator
from src.core.settings import settings

engine = create_engine(settings.database_url, pool_pre_ping=True)

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