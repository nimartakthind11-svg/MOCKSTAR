from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import timedelta
from app.database import get_db
from app import models, schemas, auth

router = APIRouter(
    prefix="/api/auth",
    tags=["Authentication"]
)

@router.post("/signup", response_model=schemas.Token, status_code=status.HTTP_201_CREATED)
def signup(user_data: schemas.UserCreate, db: Session = Depends(get_db)):
    """Registers a new user, hashes their password, sets up an empty profile, and returns a JWT."""
    # Check if user already exists
    existing_user = db.query(models.User).filter(models.User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email is already registered"
        )
    
    # Hash password and create user
    hashed_pwd = auth.get_password_hash(user_data.password)
    new_user = models.User(
        email=user_data.email,
        password_hash=hashed_pwd
    )
    db.add(new_user)
    db.flush()  # Generate user ID before profile association
    
    # Initialize a default profile for the user
    default_name = user_data.email.split("@")[0]
    default_profile = models.Profile(
        user_id=new_user.id,
        username=default_name,
        is_built=False
    )
    db.add(default_profile)
    
    # Commit database transaction
    db.commit()
    db.refresh(new_user)
    
    # Generate access token
    access_token = auth.create_access_token(data={"sub": str(new_user.id)})
    return {"access_token": access_token, "token_type": "bearer"}


@router.post("/login", response_model=schemas.Token)
def login(login_data: schemas.UserLogin, db: Session = Depends(get_db)):
    """Authenticates a user by email and password, returning a JWT token on success."""
    # Find user
    user = db.query(models.User).filter(models.User.email == login_data.email).first()
    if not user or not auth.verify_password(login_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Generate token
    access_token = auth.create_access_token(data={"sub": str(user.id)})
    return {"access_token": access_token, "token_type": "bearer"}


@router.get("/me", response_model=schemas.UserOut)
def get_current_user_profile(current_user: models.User = Depends(auth.get_current_user)):
    """Returns details of the currently authenticated user based on JWT verification."""
    return current_user
