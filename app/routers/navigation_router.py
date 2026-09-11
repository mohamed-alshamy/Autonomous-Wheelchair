from fastapi import APIRouter, HTTPException, Body
from app.core.config import get_settings
from supabase import create_client

settings = get_settings()
supabase = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)

router = APIRouter(prefix="/navigation", tags=["Navigation & Maps"])

@router.get("/locations")
def get_all_locations():
    """جلب كل الكليات الموجودة في الداتابيز لعرضها في القائمة"""
    try:
        response = supabase.table("campus_locations").select("*").execute()
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

@router.post("/go-to")
def navigate_to_faculty(location_name: str = Body(..., embed=True)):
    """إرسال أمر للكرسي للذهاب لكلية معينة"""
    try:
        # 1. نجيب إحداثيات الكلية
        res = supabase.table("campus_locations").select("*").eq("name", location_name).execute()
        
        if not res.data:
            raise HTTPException(status_code=404, detail=f"Location '{location_name}' not found")
        
        dest = res.data

        # 2. نحدث جدول التحكم (Chair Control)
        # الـ ROS هيراقب الحقول دي ويتحرك فوراً
        update_res = supabase.table("chair_control").update({
            "target_mode": "Autonomous",
            "target_x": dest["slam_x"],
            "target_y": dest["slam_y"]
        }).eq("id", 1).execute()

        if not update_res.data:
            raise HTTPException(status_code=500, detail="Failed to update chair control")

        return {
            "status": "Success", 
            "navigating_to": location_name, 
            "coords": {"x": dest["slam_x"], "y": dest["slam_y"]}
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))