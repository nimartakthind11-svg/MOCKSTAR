#pyrefly: ignore [missing-import]
from sqlalchemy import create_engine

# pyrefly: ignore [missing-import]
from sqlalchemy.orm import declarative_base, sessionmaker
from app.config import settings

# Create engine
# Note: For SQLite we might need connect_args={"check_same_thread": False}, but for PostgreSQL we don't
engine = create_engine(settings.DATABASE_URL)

# Create session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Declarative base class for models
Base = declarative_base()

# DB dependency for FastAPI routers
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
