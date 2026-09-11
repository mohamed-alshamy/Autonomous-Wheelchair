from app.core.websocket_manager import manager
from fastapi import APIRouter, WebSocket, WebSocketDisconnect

@router.websocket("/ws/chair-stats")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            # هنا السيرفر بيفضل مستني داتا من الكرسي أو بيبعت للداشبورد
            data = await websocket.receive_text() 
            # مثال: لو الكرسي بعت إحداثياته، نلف نبعتها للداشبورد فوراً
            await manager.broadcast({"event": "position_update", "data": data})
    except WebSocketDisconnect:
        manager.disconnect(websocket)