from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.routers import auth, profile, resumes, sessions
from app import models

# Automatically create database tables from SQLAlchemy models
try:
    print("Database: Auto-creating tables if they do not exist...")
    Base.metadata.create_all(bind=engine)
    print("Database: Tables initialized successfully.")
except Exception as e:
    print(f"Database: Warning - Tables auto-creation skipped or failed ({e}).")

# Initialize FastAPI App
app = FastAPI(
    title="Mockstar AI Backend",
    description="Python FastAPI REST API server for Mockstar Resume Parser and AI Mock Interviewer",
    version="1.0.0"
)

# Configure CORS (Cross-Origin Resource Sharing)
# Allows frontend clients (e.g. React running on port 5173) to communicate with this server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict this to specific origins (e.g. ["http://localhost:5173"])
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API routers
app.include_router(auth.router)
app.include_router(profile.router)
app.include_router(resumes.router)
app.include_router(sessions.router)

@app.get("/")
def read_root():
    """Welcome endpoint for the API service."""
    return {
        "message": "Welcome to Mockstar AI Backend Service!",
        "status": "online",
        "documentation": "/docs"
    }
