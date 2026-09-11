from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func
from app.core.database import Base

class ChairControl(Base):
    __tablename__ = "chair_control"

    id = Column(Integer, primary_key=True, index=True)
    
    # الوضع اللي إنتي عايزاه (بيتبعت من الداشبورد)
    target_mode = Column(String, default="Manual") 
    target_x = Column(Float) # ضيفي ده
    target_y = Column(Float) # ضيفي ده
    # الوضع الحالي اللي الكرسي شغال بيه فعلياً (بيتبعت من الكرسي)
    current_mode = Column(String, default="Manual") 
    
    # آخر إشارة من الكرسي (عشان نتأكد إنه متصل بالإنترنت)
    # server_default بيحط الوقت أول ما السطر يتكريت، و onupdate بيحدثه كل ما الكرسي يبعت ping
    last_ping = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())