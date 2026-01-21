from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
from datetime import timedelta
from typing import Optional, List
from decimal import Decimal

from database import engine, get_db, Base
from models import User, Range, Nut, ScrewLength
from auth import (
    verify_password,
    get_password_hash,
    create_access_token,
    get_current_user,
    ACCESS_TOKEN_EXPIRE_MINUTES
)

# Create database tables
Base.metadata.create_all(bind=engine)

# Initialize FastAPI app
app = FastAPI(
    title="Argip Auth API",
    description="Authentication API for Argip POC",
    version="1.0.0"
)

# CORS middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Pydantic models for request/response
class UserRegister(BaseModel):
    username: str
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    
    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str


class LoginRequest(BaseModel):
    username: str
    password: str


@app.get("/")
def read_root():
    """
    Root endpoint - API health check.
    """
    return {
        "message": "Argip Auth API is running",
        "version": "1.0.0",
        "docs": "/docs"
    }


@app.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register(user_data: UserRegister, db: Session = Depends(get_db)):
    """
    Register a new user.
    """
    # Check if username already exists
    existing_user = db.query(User).filter(User.username == user_data.username).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already registered"
        )
    
    # Check if email already exists
    existing_email = db.query(User).filter(User.email == user_data.email).first()
    if existing_email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create new user
    hashed_password = get_password_hash(user_data.password)
    new_user = User(
        username=user_data.username,
        email=user_data.email,
        hashed_password=hashed_password
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    return new_user


@app.post("/login", response_model=Token)
def login(login_data: LoginRequest, db: Session = Depends(get_db)):
    """
    Login endpoint - returns JWT token.
    """
    # Find user by username
    user = db.query(User).filter(User.username == login_data.username).first()
    
    if not user or not verify_password(login_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Create access token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username},
        expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer"}


@app.get("/me", response_model=UserResponse)
def read_users_me(current_user: User = Depends(get_current_user)):
    """
    Get current authenticated user information.
    Protected endpoint - requires valid JWT token.
    """
    return current_user


@app.get("/health")
def health_check():
    """
    Health check endpoint for Docker.
    """
    return {"status": "healthy"}


# Pydantic models for Ranges
class RangeCreate(BaseModel):
    nazwa: str
    od: float
    do: float


class RangeUpdate(BaseModel):
    nazwa: Optional[str] = None
    od: Optional[float] = None
    do: Optional[float] = None


class RangeResponse(BaseModel):
    id: int
    nazwa: str
    od: float
    do: float
    
    class Config:
        from_attributes = True


# Pydantic models for Nuts
class NutCreate(BaseModel):
    id_zakresu: int
    nazwa: str
    srednica: float
    cena: Decimal


class NutUpdate(BaseModel):
    id_zakresu: Optional[int] = None
    nazwa: Optional[str] = None
    srednica: Optional[float] = None
    cena: Optional[Decimal] = None


class NutResponse(BaseModel):
    id: int
    id_zakresu: int
    nazwa: str
    srednica: float
    cena: Decimal
    
    class Config:
        from_attributes = True


# Range endpoints
@app.get("/api/ranges", response_model=List[RangeResponse])
def get_ranges(db: Session = Depends(get_db)):
    """
    Get all ranges.
    """
    ranges = db.query(Range).all()
    return ranges


@app.post("/api/ranges", response_model=RangeResponse, status_code=status.HTTP_201_CREATED)
def create_range(range_data: RangeCreate, db: Session = Depends(get_db)):
    """
    Create a new range.
    """
    # Validate that 'od' is less than 'do'
    if range_data.od >= range_data.do:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Value 'od' must be less than 'do'"
        )
    
    new_range = Range(
        nazwa=range_data.nazwa,
        od=range_data.od,
        do=range_data.do
    )
    
    db.add(new_range)
    db.commit()
    db.refresh(new_range)
    
    return new_range


@app.get("/api/ranges/{range_id}", response_model=RangeResponse)
def get_range(range_id: int, db: Session = Depends(get_db)):
    """
    Get a specific range by ID.
    """
    range_obj = db.query(Range).filter(Range.id == range_id).first()
    if not range_obj:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Range not found"
        )
    return range_obj


@app.put("/api/ranges/{range_id}", response_model=RangeResponse)
def update_range(range_id: int, range_data: RangeUpdate, db: Session = Depends(get_db)):
    """
    Update a range.
    """
    range_obj = db.query(Range).filter(Range.id == range_id).first()
    if not range_obj:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Range not found"
        )
    
    if range_data.nazwa is not None:
        range_obj.nazwa = range_data.nazwa
    if range_data.od is not None:
        range_obj.od = range_data.od
    if range_data.do is not None:
        range_obj.do = range_data.do
    
    # Validate that 'od' is less than 'do'
    if range_obj.od >= range_obj.do:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Value 'od' must be less than 'do'"
        )
    
    db.commit()
    db.refresh(range_obj)
    
    return range_obj


@app.delete("/api/ranges/{range_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_range(range_id: int, db: Session = Depends(get_db)):
    """
    Delete a range.
    """
    range_obj = db.query(Range).filter(Range.id == range_id).first()
    if not range_obj:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Range not found"
        )
    
    db.delete(range_obj)
    db.commit()
    
    return None


# Nut endpoints
@app.get("/api/nuts", response_model=List[NutResponse])
def get_nuts(range_id: Optional[int] = None, db: Session = Depends(get_db)):
    """
    Get all nuts, optionally filtered by range_id.
    """
    query = db.query(Nut)
    if range_id is not None:
        query = query.filter(Nut.id_zakresu == range_id)
    nuts = query.all()
    return nuts


@app.post("/api/nuts", response_model=NutResponse, status_code=status.HTTP_201_CREATED)
def create_nut(nut_data: NutCreate, db: Session = Depends(get_db)):
    """
    Create a new nut.
    """
    # Check if range exists
    range_obj = db.query(Range).filter(Range.id == nut_data.id_zakresu).first()
    if not range_obj:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Range not found"
        )
    
    new_nut = Nut(
        id_zakresu=nut_data.id_zakresu,
        nazwa=nut_data.nazwa,
        srednica=nut_data.srednica,
        cena=nut_data.cena
    )
    
    db.add(new_nut)
    db.commit()
    db.refresh(new_nut)
    
    return new_nut


@app.get("/api/nuts/{nut_id}", response_model=NutResponse)
def get_nut(nut_id: int, db: Session = Depends(get_db)):
    """
    Get a specific nut by ID.
    """
    nut = db.query(Nut).filter(Nut.id == nut_id).first()
    if not nut:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Nut not found"
        )
    return nut


@app.put("/api/nuts/{nut_id}", response_model=NutResponse)
def update_nut(nut_id: int, nut_data: NutUpdate, db: Session = Depends(get_db)):
    """
    Update a nut.
    """
    nut = db.query(Nut).filter(Nut.id == nut_id).first()
    if not nut:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Nut not found"
        )
    
    if nut_data.id_zakresu is not None:
        # Check if new range exists
        range_obj = db.query(Range).filter(Range.id == nut_data.id_zakresu).first()
        if not range_obj:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Range not found"
            )
        nut.id_zakresu = nut_data.id_zakresu
    
    if nut_data.nazwa is not None:
        nut.nazwa = nut_data.nazwa
    if nut_data.srednica is not None:
        nut.srednica = nut_data.srednica
    if nut_data.cena is not None:
        nut.cena = nut_data.cena
    
    db.commit()
    db.refresh(nut)
    
    return nut


@app.delete("/api/nuts/{nut_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_nut(nut_id: int, db: Session = Depends(get_db)):
    """
    Delete a nut.
    """
    nut = db.query(Nut).filter(Nut.id == nut_id).first()
    if not nut:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Nut not found"
        )
    
    db.delete(nut)
    db.commit()
    
    return None


# Pydantic models for ScrewLength
class ScrewLengthCreate(BaseModel):
    srednica: float
    dlugosc: float


class ScrewLengthResponse(BaseModel):
    id: int
    srednica: float
    dlugosc: float
    
    class Config:
        from_attributes = True


# ScrewLength endpoints
@app.get("/api/screw-lengths", response_model=List[ScrewLengthResponse])
def get_screw_lengths(db: Session = Depends(get_db)):
    """
    Get all screw lengths ordered by diameter first, then by length.
    """
    lengths = db.query(ScrewLength).order_by(ScrewLength.srednica, ScrewLength.dlugosc).all()
    return lengths


@app.post("/api/screw-lengths", response_model=ScrewLengthResponse, status_code=status.HTTP_201_CREATED)
def create_screw_length(length_data: ScrewLengthCreate, db: Session = Depends(get_db)):
    """
    Create a new screw with diameter and length.
    """
    # Check if combination already exists
    existing = db.query(ScrewLength).filter(
        ScrewLength.srednica == length_data.srednica,
        ScrewLength.dlugosc == length_data.dlugosc
    ).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This screw (diameter + length combination) already exists"
        )
    
    new_length = ScrewLength(
        srednica=length_data.srednica,
        dlugosc=length_data.dlugosc
    )
    
    db.add(new_length)
    db.commit()
    db.refresh(new_length)
    
    return new_length


@app.delete("/api/screw-lengths/{length_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_screw_length(length_id: int, db: Session = Depends(get_db)):
    """
    Delete a screw length.
    """
    length = db.query(ScrewLength).filter(ScrewLength.id == length_id).first()
    if not length:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Screw length not found"
        )
    
    db.delete(length)
    db.commit()
    
    return None

