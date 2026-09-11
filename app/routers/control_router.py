from fastapi import APIRouter, HTTPException

router = APIRouter(prefix="/control", tags=["Chair Control"])

@router.post("/set-mode")
def set_mode(mode: str):
    """
    الـ mode لازم يكون 'Manual' أو 'Autonomous'
    """
    if mode not in ["Manual", "Autonomous"]:
        raise HTTPException(status_code=400, detail="Invalid mode name")
    
    success = update_chair_target_mode(mode)
    if success:
        return {"status": "success", "message": f"Chair will switch to {mode}"}
    raise HTTPException(status_code=500, detail="Could not update database")

@router.get("/status")
def check_status():
    """معرفة الوضع الحالي وهل الكرسي باعت Ping ولا لا"""
    status = get_chair_status()
    if status:
        return {
            "target": status["target_mode"],
            "current": status["current_mode"],
            "last_active": status["last_ping"]
        }
    raise HTTPException(status_code=404, detail="Chair data not found")