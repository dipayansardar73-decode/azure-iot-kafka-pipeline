from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import devices, telemetry
import logging
import sys

# Configure logging
logging.basicConfig(level=logging.INFO, stream=sys.stdout)

app = FastAPI(title="IoT Telemetry API", version="1.0.0")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In prod, be specific
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(devices.router, prefix="/api/devices", tags=["devices"])
app.include_router(telemetry.router, prefix="/api/telemetry", tags=["telemetry"])

@app.get("/health")
async def health_check():
    return {"status": "ok"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
