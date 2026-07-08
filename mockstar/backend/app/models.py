import uuid
from sqlalchemy import Column, String, Boolean, Integer, Text, DateTime, ForeignKey, UUID, JSON, func
from sqlalchemy.orm import relationship
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relationships
    profile = relationship("Profile", back_populates="user", uselist=False, cascade="all, delete-orphan")
    resumes = relationship("Resume", back_populates="user", cascade="all, delete-orphan")
    sessions = relationship("InterviewSession", back_populates="user", cascade="all, delete-orphan")


class Profile(Base):
    __tablename__ = "profiles"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    username = Column(String(255), nullable=False)
    focus_domain = Column(String(255), nullable=True)
    core_skills = Column(Text, nullable=True)
    is_built = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relationships
    user = relationship("User", back_populates="profile")


class Resume(Base):
    __tablename__ = "resumes"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    file_name = Column(String(255), nullable=False)
    file_content = Column(Text, nullable=True)
    predicted_domain = Column(String(255), nullable=True)
    uploaded_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    user = relationship("User", back_populates="resumes")


class InterviewSession(Base):
    __tablename__ = "interview_sessions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    interview_type = Column(String(50), nullable=False) # 'technical', 'behavioral', 'mixed'
    custom_role = Column(String(255), nullable=True)
    difficulty = Column(String(50), nullable=False) # 'easy', 'medium', 'hard'
    question_count = Column(Integer, default=5, nullable=False)
    focus_areas = Column(JSON, nullable=True) # JSON list e.g. ["React", "CSS"]
    score = Column(Integer, nullable=True)
    transcript = Column(JSON, nullable=True) # JSON array of chat message dicts
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relationships
    user = relationship("User", back_populates="sessions")
