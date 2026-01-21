from sqlalchemy import Column, Integer, String, DateTime, Float, Numeric, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base


class User(Base):
    """
    User model for authentication.
    Stores user credentials and basic information.
    """
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True, nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    def __repr__(self):
        return f"<User(username={self.username}, email={self.email})>"


class Range(Base):
    """
    Range model for defining screw size ranges.
    Stores range name and min/max values.
    """
    __tablename__ = "ranges"

    id = Column(Integer, primary_key=True, index=True)
    nazwa = Column(String(100), nullable=False)
    od = Column(Float, nullable=False)
    do = Column(Float, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationship with nuts
    nuts = relationship("Nut", back_populates="range", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<Range(nazwa={self.nazwa}, od={self.od}, do={self.do})>"


class Nut(Base):
    """
    Nut model for storing nut specifications and pricing.
    Each nut is associated with a range.
    """
    __tablename__ = "nuts"

    id = Column(Integer, primary_key=True, index=True)
    id_zakresu = Column(Integer, ForeignKey("ranges.id"), nullable=False)
    nazwa = Column(String(100), nullable=False)
    srednica = Column(Float, nullable=False)
    cena = Column(Numeric(10, 2), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationship with range
    range = relationship("Range", back_populates="nuts")
    
    def __repr__(self):
        return f"<Nut(nazwa={self.nazwa}, srednica={self.srednica}, cena={self.cena})>"


class ScrewLength(Base):
    """
    ScrewLength model for storing available screw lengths and diameters.
    """
    __tablename__ = "screw_lengths"

    id = Column(Integer, primary_key=True, index=True)
    srednica = Column(Float, nullable=False)
    dlugosc = Column(Float, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    def __repr__(self):
        return f"<ScrewLength(srednica={self.srednica}, dlugosc={self.dlugosc})>"

