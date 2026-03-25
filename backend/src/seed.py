import json
import os
from sqlalchemy.orm import Session
from .db.session import SessionLocal
from .db import models

def seed_db():
    db: Session = SessionLocal()
    
    # Caminho para o JSON (Considerando que rodamos o container com a pasta /app/content mapeada)
    json_path = os.path.join("/app", "content", "lessons_seed.json")
    
    if not os.path.exists(json_path):
        print(f"❌ Erro: Arquivo {json_path} não encontrado!")
        return

    try:
        with open(json_path, "r", encoding="utf-8") as f:
            data = json.load(f)

            for item in data:
                existing = db.query(models.Lesson).filter(models.Lesson.title == item["title"]).first()
                if not existing:
                    new_lesson = models.Lesson(
                        title=item["title"],
                        level=item["level"],
                        books=item["books"], # Salva a lista ["Gênesis", "Salmos"]
                        content={"questions": item["questions"]} # Empacota no formato esperado
                    )
                    db.add(new_lesson)
    
            db.commit()
            db.close()
        
        print("🚀 Seed finalizado com sucesso!")
        
    except Exception as e:
        print(f"💥 Erro ao rodar seed: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_db()