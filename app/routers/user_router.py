from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from starlette.concurrency import run_in_threadpool
from app.services.user_service import (
    capture_and_register,
    live_face_scan,
    process_logout,
    web_face_login,          # ← جديد: login من صورة المتصفح
    web_capture_and_register # ← جديد: signup من صورة المتصفح
)

router = APIRouter()

# ─────────────────────────────────────────────
# 1. SIGNUP من المتصفح (الكاميرا في الـ Frontend)
# ─────────────────────────────────────────────
@router.post("/users/signup-web", tags=["Users"])
async def signup_web(
    name: str = Form(...),
    age: int = Form(...),
    phone: str = Form(...),
    image: UploadFile = File(...),   # ← صورة من Webcam
):
    """تسجيل مستخدم جديد باستخدام صورة مرسلة من المتصفح"""
    user_info = {"name": name, "age": age, "phone": phone}
    image_bytes = await image.read()

    try:
        result = await run_in_threadpool(web_capture_and_register, user_info, image_bytes)
        if result:
            return {"message": f"User {name} registered successfully"}
        raise HTTPException(status_code=400, detail="No face detected in the image")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ─────────────────────────────────────────────
# 2. LOGIN من المتصفح (الكاميرا في الـ Frontend)
# ─────────────────────────────────────────────
@router.post("/users/login-web", tags=["Users"])
async def login_web(image: UploadFile = File(...)):
    """
    تسجيل دخول بالوجه:
    - الـ Frontend بيبعت صورة JPEG من الـ Webcam
    - الـ Backend بيقارنها بالـ embeddings المخزنة في Supabase
    """
    image_bytes = await image.read()
    try:
        user = await run_in_threadpool(web_face_login, image_bytes)
        if user:
            return user   # { id, name, age, phone, emergency_contact }
        raise HTTPException(status_code=401, detail="Face not recognized. Please register first.")
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ─────────────────────────────────────────────
# 3. LOGOUT
# ─────────────────────────────────────────────
@router.post("/users/logout", tags=["Users"])
def logout(user_id: int):
    success = process_logout(user_id)
    if success:
        return {"message": "Logged out successfully"}
    raise HTTPException(status_code=500, detail="Logout failed")


# ─────────────────────────────────────────────
# 4. القديم (للكاميرا المحلية على السيرفر) — محفوظ للتجربة
# ─────────────────────────────────────────────
@router.post("/users/signup-scan", tags=["Users - Legacy"])
async def signup_via_scan(name: str, age: int, phone: str, ):
    """يفتح كاميرا السيرفر للتسجيل — للاستخدام المحلي فقط"""
    user_info = {"name": name, "age": age, "phone": phone, }
    try:
        success = await run_in_threadpool(capture_and_register, user_info)
        if success:
            return {"message": f"User {name} registered successfully"}
        raise HTTPException(status_code=500, detail="Registration failed or cancelled")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/users/login", tags=["Users - Legacy"])
def login_user_face():
    """يفتح كاميرا السيرفر للدخول — للاستخدام المحلي فقط"""
    try:
        user_name = live_face_scan()
        if user_name:
            return {"status": "success", "message": f"Welcome {user_name}"}
        return {"status": "failed", "message": "Login failed: User not recognized"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))