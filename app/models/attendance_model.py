from sqlalchemy import Column, ForeignKey, Integer, String, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base # ده أهم سطر لربط الجداول

class Attendance(Base):
    __tablename__ = "attendance"

    id = Column(Integer, primary_key=True, index=True)
    status = Column(String) 
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    
    user_id = Column(Integer, ForeignKey("users.id"))
    user = relationship("User", back_populates="attendances")