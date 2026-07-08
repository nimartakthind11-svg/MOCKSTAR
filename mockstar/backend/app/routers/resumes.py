from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app import models, schemas, auth
from app.services.parser import resume_parser
from app.ml.classifier import classifier

router = APIRouter(
    prefix="/api/resumes",
    tags=["Resume Parsing"]
)

@router.post("/upload", response_model=schemas.ResumeOut, status_code=status.HTTP_201_CREATED)
async def upload_resume(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    """
    Handles PDF resume uploads. Extracts plain text and skills via pdfplumber,
    runs scikit-learn domain prediction, and saves the resume record in the database.
    """
    # Verify file format
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only PDF resume files are supported."
        )

    try:
        # Read file bytes in-memory
        pdf_bytes = await file.read()
        
        # Parse text, email, and skills
        parsed_data = resume_parser.parse(pdf_bytes)
        
        # Predict domain using ML classifier
        predicted_domain = classifier.predict(parsed_data["text"])
        
        # Create and save Resume record
        db_resume = models.Resume(
            user_id=current_user.id,
            file_name=file.filename,
            file_content=parsed_data["text"],
            predicted_domain=predicted_domain
        )
        db.add(db_resume)
        
        # Smart integration: Auto-update the user's profile with parsed info if profile is not fully built
        profile = db.query(models.Profile).filter(models.Profile.user_id == current_user.id).first()
        if profile:
            # Prepopulate focus domain if empty
            if not profile.focus_domain:
                profile.focus_domain = predicted_domain
            # Append parsed skills to profile if empty or add to it
            skills_str = ", ".join(parsed_data["skills"])
            if skills_str:
                if not profile.core_skills:
                    profile.core_skills = skills_str
                else:
                    # Merge unique skills
                    existing_skills = [s.strip().lower() for s in profile.core_skills.split(",") if s.strip()]
                    for skill in parsed_data["skills"]:
                        if skill.lower() not in existing_skills:
                            profile.core_skills += f", {skill}"
            profile.is_built = True
            
        db.commit()
        db.refresh(db_resume)
        return db_resume
        
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred while parsing the resume: {str(e)}"
        )


@router.get("", response_model=List[schemas.ResumeOut])
def list_resumes(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    """Fetches all resumes uploaded by the authenticated user."""
    resumes = db.query(models.Resume).filter(models.Resume.user_id == current_user.id).all()
    return resumes
