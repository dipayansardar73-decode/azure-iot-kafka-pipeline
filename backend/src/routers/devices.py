from fastapi import APIRouter, HTTPException
from typing import List, Optional
import redis
import os
import json

router = APIRouter()

redis_client = redis.Redis(
    host=os.getenv("REDIS_HOST", "localhost"),
    port=int(os.getenv("REDIS_PORT", 6379)),
    decode_responses=True
)

@router.get("/")
async def get_devices(skip: int = 0, limit: int = 100):
    # In a real app, query PostgreSQL for metadata
    # For now, we scan Redis for active devices (inefficient for 50k, but works for demo)
    
    # Ideally: SELECT * FROM devices LIMIT 100 OFFSET 0
    # Here just return a mock list or scan keys
    keys = redis_client.keys("device:current:*")
    devices = []
    
    # Simple pagination on keys
    sliced_keys = keys[skip:skip+limit]
    
    for key in sliced_keys:
        data = redis_client.get(key)
        if data:
            devices.append(json.loads(data))
            
    return devices

@router.get("/{device_id}")
async def get_device_details(device_id: str):
    data = redis_client.get(f"device:current:{device_id}")
    if not data:
        raise HTTPException(status_code=404, detail="Device not found")
    return json.loads(data)
