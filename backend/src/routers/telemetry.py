from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from typing import List
import asyncio
import json
import redis
import os
import logging

router = APIRouter()

logger = logging.getLogger(__name__)

# Redis for Pub/Sub or polling
redis_client = redis.Redis(
    host=os.getenv("REDIS_HOST", "localhost"),
    port=int(os.getenv("REDIS_PORT", 6379)),
    decode_responses=True
)

class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def broadcast(self, message: str):
        for connection in self.active_connections:
            await connection.send_text(message)

manager = ConnectionManager()

@router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            # Simulate pushing global stats every second
            # In real app, listen to Redis PubSub or aggregate
            stats = redis_client.get("dashboard:stats")
            
            # If no stats yet, generate mock or calculate from keys (expensive)
            if not stats:
                 # Quick hack to show something
                 keys_count = len(redis_client.keys("device:current:*"))
                 stats = json.dumps({
                     "active_devices": keys_count,
                     "msg_rate": 0, # TODO: calculate
                     "timestamp": "now" # TODO
                 })
            
            await websocket.send_text(stats)
            await asyncio.sleep(1)
            
    except WebSocketDisconnect:
        manager.disconnect(websocket)
    except Exception as e:
        logger.error(f"WebSocket error: {e}")
        manager.disconnect(websocket)
