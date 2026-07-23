from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import JSONResponse
from app.database import engine, Base
from app.routers import auth, profile, resumes, sessions
from app import models
from app.config import settings

# Reject any request whose declared size exceeds this, before it reaches any route.
# This is a fast first-line check; resumes.py still enforces the real limit via
# chunked reading in case Content-Length is missing or spoofed.
MAX_UPLOAD_SIZE = 10 * 1024 * 1024  # 10 MB


class LimitUploadSizeMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        content_length = request.headers.get("content-length")
        if content_length and int(content_length) > MAX_UPLOAD_SIZE:
            return JSONResponse(
                status_code=413,
                content={"detail": f"Request too large. Max allowed size is {MAX_UPLOAD_SIZE // (1024 * 1024)}MB."}
            )
        return await call_next(request)

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
if not settings.ALLOWED_ORIGINS:
    raise RuntimeError("ALLOWED_ORIGINS environment variable is missing or empty. Please specify allowed origins for CORS.")

allowed_origins = [origin.strip() for origin in settings.ALLOWED_ORIGINS.split(",") if origin.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allow_headers=["Content-Type", "Authorization", "Accept", "Origin", "X-Requested-With"],
)

# Global first-line defense: reject oversized requests before they hit any endpoint
app.add_middleware(LimitUploadSizeMiddleware)

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