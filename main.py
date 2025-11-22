import os
import logging
import multiprocessing
from typing import Optional

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Request
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

# Import the new monitoring loop
from monitoring_service import run_monitoring_loop

# -----------------------------
# ENV + APP SETUP
# -----------------------------
load_dotenv()

app = FastAPI(title="VoiceGuard Safety API", version="2.0.0")

# CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO, format="%(asctime)s | %(levelname)s | %(message)s")

# -----------------------------
# GLOBAL STATE FOR PROCESS MANAGEMENT
# -----------------------------
monitoring_process: Optional[multiprocessing.Process] = None
stop_monitoring_event: Optional[multiprocessing.Event] = None

# -----------------------------
# REQUEST MODELS
# -----------------------------
class MonitoringRequest(BaseModel):
    user_id: str

# -----------------------------
# API ROUTES
# -----------------------------

@app.get("/")
async def root():
    """Root endpoint to check if the API is running."""
    return {"message": "VoiceGuard API is running."}

# -----------------------------
# START MONITORING
# -----------------------------
@app.post("/start_monitoring")
async def start_monitoring_route(data: MonitoringRequest):
    """
    Starts the background monitoring process if it's not already running.
    """
    global monitoring_process, stop_monitoring_event

    if monitoring_process and monitoring_process.is_alive():
        logging.warning("Start monitoring called but process is already active.")
        return {"status": "info", "message": "Monitoring is already active."}

    logging.info(f"Received request to start monitoring for user: {data.user_id}")
    
    # Initialize multiprocessing event and process
    stop_monitoring_event = multiprocessing.Event()
    monitoring_process = multiprocessing.Process(
        target=run_monitoring_loop,
        args=(stop_monitoring_event,)
    )
    monitoring_process.start()

    logging.info(f"Monitoring process started with PID: {monitoring_process.pid}")
    return {"status": "success", "message": "Monitoring started."}

# -----------------------------
# STOP MONITORING
# -----------------------------
@app.post("/stop_monitoring")
async def stop_monitoring_route():
    """
    Stops the background monitoring process if it is running.
    """
    global monitoring_process, stop_monitoring_event

    if not monitoring_process or not monitoring_process.is_alive():
        logging.warning("Stop monitoring called but no process is active.")
        return {"status": "info", "message": "Monitoring is not active."}

    logging.info("Received request to stop monitoring.")
    
    # Signal the process to stop and wait for it to terminate
    stop_monitoring_event.set()
    monitoring_process.join(timeout=10)  # Wait for 10 seconds

    if monitoring_process.is_alive():
        logging.error("Monitoring process failed to stop gracefully. Terminating.")
        monitoring_process.terminate()
        monitoring_process.join()

    monitoring_process = None
    stop_monitoring_event = None
    
    logging.info("Monitoring process has been stopped.")
    return {"status": "success", "message": "Monitoring stopped."}

# -----------------------------
# MAIN ENTRY POINT
# -----------------------------
if __name__ == "__main__":
    import uvicorn
    # Required for multiprocessing to work correctly on some platforms
    multiprocessing.freeze_support()
    uvicorn.run(app, host="0.0.0.0", port=int(os.getenv("PORT", 5000)))