from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Dict, Any
from uuid import UUID
from app.database import get_db
from app import models, schemas, auth
from app.services.gemini import gemini_service

router = APIRouter(
    prefix="/api/sessions",
    tags=["Interview Sessions"]
)

@router.post("/start", response_model=Dict[str, Any], status_code=status.HTTP_201_CREATED)
def start_session(
    config: schemas.InterviewSessionBase,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    """
    Starts a new interview session. Fetches candidate details, calls Gemini to
    generate customized questions, and saves the session skeleton in the database.
    """
    # Fetch user resume (if any) to contextualize questions
    latest_resume = db.query(models.Resume).filter(models.Resume.user_id == current_user.id).order_by(models.Resume.uploaded_at.desc()).first()
    resume_text = latest_resume.file_content if latest_resume else None

    # Fetch user profile to get focus domain
    profile = db.query(models.Profile).filter(models.Profile.user_id == current_user.id).first()
    focus_domain = profile.focus_domain if profile else "Software Engineering"

    # Generate questions using Gemini Service
    questions = gemini_service.generate_questions(
        interview_type=config.interview_type,
        difficulty=config.difficulty,
        focus_areas=config.focus_areas,
        question_count=config.question_count,
        resume_text=resume_text
    )

    if not questions:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to generate interview questions."
        )

    # Save initial interview session in database
    db_session = models.InterviewSession(
        user_id=current_user.id,
        interview_type=config.interview_type,
        custom_role=config.custom_role,
        difficulty=config.difficulty,
        question_count=config.question_count,
        focus_areas=config.focus_areas,
        score=None,
        transcript=None
    )
    db.add(db_session)
    db.commit()
    db.refresh(db_session)

    return {
        "session_id": db_session.id,
        "questions": questions
    }


@router.post("/{session_id}/submit", response_model=schemas.InterviewSessionOut)
def submit_session(
    session_id: UUID,
    transcript: List[schemas.ChatMessage],
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    """
    Submits a completed interview transcript. Calls Gemini to evaluate performance,
    updates the session score and transcript in the database, and returns the details.
    """
    # Fetch session from database
    session = db.query(models.InterviewSession).filter(
        models.InterviewSession.id == session_id,
        models.InterviewSession.user_id == current_user.id
    ).first()

    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Interview session not found."
        )

    # Convert Pydantic chat objects to dictionaries for evaluation
    transcript_dicts = [msg.model_dump() for msg in transcript]

    # Fetch user profile to feed domain context to evaluation
    profile = db.query(models.Profile).filter(models.Profile.user_id == current_user.id).first()
    focus_domain = profile.focus_domain if profile else "Software Engineering"

    # Run AI evaluation
    evaluation = gemini_service.evaluate_interview(
        transcript=transcript_dicts,
        focus_domain=focus_domain
    )

    # Update database record
    session.score = evaluation["score"]
    # Store detailed evaluation and conversation in the transcript column
    # We combine transcription texts and evaluation metadata into JSON
    session.transcript = {
        "messages": transcript_dicts,
        "evaluation": {
            "feedback": evaluation["feedback"],
            "strengths": evaluation["strengths"],
            "weaknesses": evaluation["weaknesses"]
        }
    }

    db.commit()
    db.refresh(session)
    
    # Return serializable response matching schema
    # Pydantic will extract transcript messages list automatically if matching models.
    # Note: Since models.InterviewSession.transcript contains JSON, we'll format it.
    return {
        "id": session.id,
        "user_id": session.user_id,
        "interview_type": session.interview_type,
        "custom_role": session.custom_role,
        "difficulty": session.difficulty,
        "question_count": session.question_count,
        "focus_areas": session.focus_areas,
        "score": session.score,
        "transcript": transcript_dicts, # return transcript messages back to frontend
        "created_at": session.created_at,
        "updated_at": session.updated_at
    }


@router.get("", response_model=List[schemas.InterviewSessionOut])
def list_sessions(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    """Fetches all past interview sessions for the current authenticated user."""
    sessions = db.query(models.InterviewSession).filter(
        models.InterviewSession.user_id == current_user.id
    ).order_by(models.InterviewSession.created_at.desc()).all()
    
    # Format database JSON back to serializable schema output
    formatted_sessions = []
    for s in sessions:
        msgs = s.transcript.get("messages", []) if s.transcript else []
        formatted_sessions.append({
            "id": s.id,
            "user_id": s.user_id,
            "interview_type": s.interview_type,
            "custom_role": s.custom_role,
            "difficulty": s.difficulty,
            "question_count": s.question_count,
            "focus_areas": s.focus_areas,
            "score": s.score,
            "transcript": msgs,
            "created_at": s.created_at,
            "updated_at": s.updated_at
        })
        
    return formatted_sessions


@router.get("/{session_id}", response_model=schemas.InterviewSessionOut)
def get_session_details(
    session_id: UUID,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    """Retrieves full details of a specific past mock interview session."""
    session = db.query(models.InterviewSession).filter(
        models.InterviewSession.id == session_id,
        models.InterviewSession.user_id == current_user.id
    ).first()

    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Interview session not found."
        )

    msgs = session.transcript.get("messages", []) if session.transcript else []
    return {
        "id": session.id,
        "user_id": session.user_id,
        "interview_type": session.interview_type,
        "custom_role": session.custom_role,
        "difficulty": session.difficulty,
        "question_count": session.question_count,
        "focus_areas": session.focus_areas,
        "score": session.score,
        "transcript": msgs,
        "created_at": session.created_at,
        "updated_at": session.updated_at
    }


@router.get("/{session_id}/report", response_model=Dict[str, Any])
def get_session_report(
    session_id: UUID,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    """Retrieves the performance review and report (strengths, weaknesses, score) for an interview."""
    session = db.query(models.InterviewSession).filter(
        models.InterviewSession.id == session_id,
        models.InterviewSession.user_id == current_user.id
    ).first()

    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Interview session not found."
        )
        
    evaluation = session.transcript.get("evaluation", {}) if session.transcript else {}
    return {
        "score": session.score,
        "role": session.custom_role or session.interview_type,
        "date": session.created_at.strftime("%b %d, %Y"),
        "feedback": evaluation.get("feedback", "No feedback available."),
        "strengths": evaluation.get("strengths", []),
        "weaknesses": evaluation.get("weaknesses", [])
    }
