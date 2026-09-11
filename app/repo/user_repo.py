from sqlalchemy.orm import Session
from app.models.user_model import User, Attendance
from app.models.navigation_model import CampusLocation
from app.models.control_model import ChairControl  # تم التأكد من الإستيراد

# --- 1. User & Attendance Logic (بيانات المستخدم والحضور) ---

def get_user_by_name(db: Session, name: str):
    return db.query(User).filter(User.name == name).first()

def get_all_attendance(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Attendance).offset(skip).limit(limit).all()

def delete_user(db: Session, user_id: int):
    user = db.query(User).filter(User.id == user_id).first()
    if user:
        db.delete(user)
        db.commit()
        return True
    return False

# --- 2. Navigation Logic (بيانات الكليات والمواقع) ---

def get_all_locations(db: Session):
    """لجلب كل الكليات وعرضها في قائمة الـ Select بالداشبورد"""
    return db.query(CampusLocation).all()

def get_location_by_name(db: Session, name: str):
    """للبحث عن إحداثيات كلية معينة لما المستخدم يختارها"""
    return db.query(CampusLocation).filter(CampusLocation.name == name).first()

def update_location_slam(db: Session, location_id: int, x: float, y: float):
    """لتعديل إحداثيات الـ SLAM الخاصة بكلية معينة"""
    location = db.query(CampusLocation).filter(CampusLocation.id == location_id).first()
    if location:
        location.slam_x = x
        location.slam_y = y
        db.commit()
        db.refresh(location)
        return location
    return None

# --- الجزء الجديد: الربط الفعلي للملاحة بالكرسي ---

def set_chair_destination(db: Session, location_name: str):
    """
    هذه الوظيفة تأخذ اسم الكلية، تجلب إحداثياتها من جدول الملاحة،
    وتحدث جدول التحكم (chair_control) ليبدأ الكرسي في التحرك آلياً.
    """
    # 1. البحث عن إحداثيات الكلية
    location = db.query(CampusLocation).filter(CampusLocation.name == location_name).first()
    if not location:
        return None  # في حالة كتابة اسم كلية غير موجودة
    
    # 2. تحديث جدول الـ chair_control (بافتراض أن الكرسي له ID ثابت وليكن 1)
    chair = db.query(ChairControl).filter(ChairControl.id == 1).first()
    if chair:
        chair.target_x = location.slam_x
        chair.target_y = location.slam_y
        chair.target_mode = "Autonomous"  # تغيير الوضع للتحرك آلياً
        
        db.commit()
        db.refresh(chair)
        return chair
    return None
# --- 3. Mode Control Logic (التحكم في أوضاع التشغيل) ---

def update_chair_mode(db: Session, mode: str):
    """
    لتبديل وضع الكرسي يدوياً (Manual أو Autonomous)
    """
    chair = db.query(ChairControl).filter(ChairControl.id == 1).first()
    if chair:
        chair.target_mode = mode # هنا هتبعتي الكلمة اللي إنتي عايزاها
        db.commit()
        db.refresh(chair)
        return chair
    return None
# Requesting code review from  for Navigation & Control Logic.