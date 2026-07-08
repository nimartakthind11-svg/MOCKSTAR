from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app import models, schemas, auth

router = APIRouter(
    prefix="/api/profile",
    tags=["Profile"]
)

@router.get("", response_model=schemas.ProfileOut)
def get_profile(
    db: Session = Depends(get_db), 
    current_user: models.User = Depends(auth.get_current_user)
):
    """Fetches the profile for the currently authenticated user."""
    profile = db.query(models.Profile).filter(models.Profile.user_id == current_user.id).first()
    
    # Defensive fallback in case profile was not created during signup
    if not profile:
        profile = models.Profile(
            user_id=current_user.id,
            username=current_user.email.split("@")[0],
            is_built=False
        )
        db.add(profile)
        db.commit()
        db.refresh(profile)
        
    return profile


@router.put("", response_model=schemas.ProfileOut)
def update_profile(
    profile_data: schemas.ProfileUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    """Updates the user's profile details. Marks the profile as built."""
    profile = db.query(models.Profile).filter(models.Profile.user_id == current_user.id).first()
    
    if not profile:
        # Create if not exists
        profile = models.Profile(user_id=current_user.id)
        db.add(profile)
        
    # Update fields
    profile.username = profile_data.username
    profile.focus_domain = profile_data.focus_domain
    profile.core_skills = profile_data.core_skills
    profile.is_built = True
    
    db.commit()
    db.refresh(profile)
    return profile
