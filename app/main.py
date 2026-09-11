from fastapi import FastAPI, Path, WebSocket, WebSocketDisconnect
from fastapi.staticfiles import StaticFiles
from app.routers import user_router, control_router, navigation_router
from app.core.websocket_manager import manager
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="Smart Wheelchair API",
    description="نظام التحكم والملاحة الذكي المرتبط بـ Supabase و ROS",
    version="1.0.0"
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # في مرحلة التطوير بنسمح للكل، بعدين بنحدد بورت الرياكت بس
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# 1. ربط الـ Routers (HTTP)
app.include_router(user_router.router)
app.include_router(control_router.router)
app.include_router(navigation_router.router)

@app.get("/", tags=["Root"])
def read_root():
    return {
        "message": "Welcome to the Smart Wheelchair Graduation Project API",
        "status": "Running",
        "documentation": "/docs"
    }

# 2. الـ WebSocket Endpoint للبيانات اللحظية (تأكدي من المحاذاة هنا)
@app.websocket("/ws/stream")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            # استقبال البيانات من الكرسي (مثلاً من ROS Bridge)
            data = await websocket.receive_json()
            
            # توزيع البيانات فوراً على الداشبورد (Frontend)
            # البيانات تشمل: (x, y, velocity, battery_level, accuracy)
            await manager.broadcast(data)
    except WebSocketDisconnect:
        manager.disconnect(websocket)

if __name__ == "__main__":
    import uvicorn
    # تأكدي أن المسار "app.main:app" صحيح بناءً على هيكلة ملفاتك
    uvicorn.run("app.main:app", host="127.0.0.1", port=8000, reload=True)