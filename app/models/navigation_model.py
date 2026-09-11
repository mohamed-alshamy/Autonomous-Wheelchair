from sqlalchemy import Column, Integer, String, Float, DateTime
from sqlalchemy.sql import func
from app.core.database import Base

class CampusLocation(Base):
    __tablename__ = "campus_locations"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    slam_x = Column(Float, default=0.0)
    slam_y = Column(Float, default=0.0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())