import os
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from app.config import settings

DATABASE_URL = settings.DATABASE_URL
connect_args = {}

is_prod = settings.ENVIRONMENT.lower() == "production"

if is_prod and (not DATABASE_URL or DATABASE_URL.startswith("sqlite")):
    raise RuntimeError("SQLite is not allowed in production. Please configure a valid PostgreSQL DATABASE_URL.")

if DATABASE_URL.startswith("sqlite"):
    connect_args["check_same_thread"] = False

# create_engine() does not open a connection - it lazily configures a
# connection pool. No I/O happens here, so this is safe to run at import
# time. Actual connectivity is verified during FastAPI's startup/lifespan
# phase (see main.py), with retries, so the app doesn't crash on import
# if the database is still starting up.
engine = create_engine(DATABASE_URL, connect_args=connect_args)

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
