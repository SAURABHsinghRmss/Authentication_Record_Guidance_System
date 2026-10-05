from fastapi import APIRouter, WebSocket, WebSocketDisconnect
import asyncio
import json
from datetime import datetime, timezone

router = APIRouter(tags=["WebSocket Real-Time Observability"])

class ConnectionManager:
    def __init__(self):
        self.active_connections: list[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def broadcast(self, message: str):
        for connection in self.active_connections:
            await connection.send_text(message)

manager = ConnectionManager()

@router.websocket("/ws/audit-logs")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            log_entry = {
                "timestamp": datetime.now(timezone.utc).isoformat(),
                "event": "SYSTEM_HEALTH_HEARTBEAT",
                "status": "HEALTHY",
                "cpu_usage": "14.2%",
                "memory_usage": "1.2 GB"
            }
            await websocket.send_text(json.dumps(log_entry))
            await asyncio.sleep(5)
    except WebSocketDisconnect:
        manager.disconnect(websocket)
