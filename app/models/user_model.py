from sqlalchemy import Column, Integer, String, DateTime, Boolean
from sqlalchemy.orm import relationship
from app.core.database import Base
from sqlalchemy.sql import func

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    age = Column(Integer, nullable=False)           # السن
    phone = Column(String, nullable=False)         # التليفون
    face_embedding = Column(String, nullable=False) 
    
    
    is_active = Column(Boolean, default=True) 
    attendances = relationship("Attendance", back_populates="user")