from pydantic import BaseModel, ConfigDict
from datetime import datetime
from typing import Optional

# --- 1. User Schemas ---
class UserBase(BaseModel):
    name: str
    age: int
    phone: str

class UserCreate(UserBase):
    face_embedding: str # Required only during registration

class UserOut(UserBase):
    id: int
    is_active: bool
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)


# --- 2. Chair Control Schemas (Feedback System) ---
class ChairControlBase(BaseModel):
    # الوضع المطلوب من واجهة التحكم (Dashboard)
    target_mode: str 
    # الوضع الفعلي المنفذ على الكرسي (Hardware)
    current_mode: str 
    target_x: float  # ضيفي السطر ده
    target_y: float  # ضيفي السطر ده 
class ChairControlUpdate(BaseModel):
    # تستخدم لتحديث الطلب فقط أو التأكيد فقط
    target_mode: Optional[str] = None
    current_mode: Optional[str] = None

class ChairControlOut(ChairControlBase):
    id: int
    last_ping: datetime # Used for "System Check: OK" verification
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


# --- 3. Attendance Schemas ---
class AttendanceOut(BaseModel):
    id: int
    user_name: str # تعديل ليتناسب مع الموديل اللي بعتيه
    status: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
    
    # --- 4. Navigation & Campus Schemas ---
# دي عشان لما نبعت بيانات كلية جديدة (لو حبيتي تضيفي من الـ Dashboard)
class CampusLocationBase(BaseModel):
    name: str
    latitude: float
    longitude: float
    slam_x: float = 0.0
    slam_y: float = 0.0

# دي اللي الـ API هيرجعها للـ Frontend عشان يرسم الـ Markers على الخريطة
class CampusLocationOut(CampusLocationBase):
    id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

# دي الـ Schema اللي بنستخدمها لما نطلب من الكرسي يروح لمكان معين (Navigation Task)
class NavigationRequest(BaseModel):
    location_name: str # المستخدم بيختار الاسم من القائمة اللي في الصورة