from pydantic import BaseModel, EmailStr, Field
from uuid import UUID
from datetime import datetime
from typing import List, Optional, Any

# --- Token & Auth Schemas ---
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None
    user_id: Optional[str] = None


# --- User Schemas ---
class UserBase(BaseModel):
    email: EmailStr

class UserCreate(UserBase):
    password: str = Field(..., min_length=6)

class UserLogin(UserBase):
    password: str

class UserOut(UserBase):
    id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# --- Profile Schemas ---
class ProfileBase(BaseModel):
    username: str
    focus_domain: Optional[str] = None
    core_skills: Optional[str] = None
    is_built: bool = False

class ProfileCreate(ProfileBase):
    pass

class ProfileUpdate(ProfileBase):
    pass

class ProfileOut(ProfileBase):
    id: UUID
    user_id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# --- Resume Schemas ---
class ResumeOut(BaseModel):
    id: UUID
    user_id: UUID
    file_name: str
    predicted_domain: Optional[str] = None
    uploaded_at: datetime

    class Config:
        from_attributes = True


# --- Interview Session Schemas ---
class ChatMessage(BaseModel):
    role: str # 'candidate' or 'interviewer'
    text: str
    time: str

class InterviewSessionBase(BaseModel):
    interview_type: str # 'technical', 'behavioral', 'mixed'
    custom_role: Optional[str] = None
    difficulty: str # 'easy', 'medium', 'hard'
    question_count: int = Field(5, ge=1, le=10)
    focus_areas: Optional[List[str]] = None

class InterviewSessionCreate(InterviewSessionBase):
    score: Optional[int] = None
    transcript: Optional[List[ChatMessage]] = None

class InterviewSessionOut(InterviewSessionBase):
    id: UUID
    user_id: UUID
    score: Optional[int] = None
    transcript: Optional[List[ChatMessage]] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
