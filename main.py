import os
import time
import threading
import logging
import uuid
import shutil
from typing import List, Optional

from dotenv import load_dotenv
import numpy as np
from fastapi import (
    FastAPI, APIRouter, HTTPException, 
    BackgroundTasks, UploadFile, File, Form, Request
)
from pydantic import BaseModel
from starlette.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware

from utils.sos import sos
from utils.audio import AudioCapture
from utils.vad import VoiceActivityDetector
from utils.chatbot import WomenSafetyChatbot
from utils.database import get_user, update_user_contacts, save_evidence_metadata
from utils.storage import upload_evidence_to_cloudinary


# -----------------------------
# ENV + APP SETUP
# -----------------------------
load_dotenv()

app = FastAPI(title="VoiceGuard Safety API", version="1.0.0")

# CORS — FRONTEND USES localhost:3000
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],       # frontend uses localhost:3000
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

TEMP_UPLOAD_FOLDER = "temp_uploads"
os.makedirs(TEMP_UPLOAD_FOLDER, exist_ok=True)

logging.basicConfig(level=logging.INFO, format="%(asctime)s | %(levelname)s | %(message)s")


# -----------------------------
# GLOBAL STATE
# -----------------------------
monitoring_thread: threading.Thread = None
stop_monitoring_event = threading.Event()


# -----------------------------
# REQUEST MODELS
# -----------------------------
class SetContactsRequest(BaseModel):
    user_id: str
    contacts: List[str]


class MonitoringRequest(BaseModel):
    user_id: str


class TriggerSOSRequest(BaseModel):
    user_id: str


class ChatRequest(BaseModel):
    user_id: str
    message: str


class SendSMSRequest(BaseModel):
    phone: str


# -----------------------------
# BACKGROUND MONITORING LOGIC
# -----------------------------
def background_monitoring_task(emergency_contacts: List[str]):
    logging.info(f"🛡️ Monitoring started for contacts: {emergency_contacts}")
    # NOTE: Replace with your actual logic
    while not stop_monitoring_event.is_set():
        time.sleep(0.3)
    logging.info("🛑 Monitoring stopped.")


# -----------------------------
# HELPERS — handles OPTIONS for all routes
# -----------------------------
def handle_options(request: Request):
    if request.method == "OPTIONS":
        return JSONResponse(
            status_code=200,
            content={"status": "ok"},
            headers={
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
                "Access-Control-Allow-Headers": "*",
            }
        )
    return None


# -----------------------------
# ROUTES
# -----------------------------

@app.get("/")
async def root():
    return {"message": "VoiceGuard API is running"}


# -----------------------------
# START MONITORING
# -----------------------------
@app.api_route("/start_monitoring", methods=["POST", "OPTIONS"])
async def start_monitoring_route(request: Request, data: Optional[MonitoringRequest] = None):

    response = handle_options(request)
    if response:
        return response

    if not data or not data.user_id:
        raise HTTPException(400, "user_id is required")

    global monitoring_thread

    if monitoring_thread and monitoring_thread.is_alive():
        return {"status": "info", "message": "Monitoring already active."}

    user_data = get_user(data.user_id)
    contacts = user_data.get("emergency_contacts", []) if user_data else []

    stop_monitoring_event.clear()
    monitoring_thread = threading.Thread(target=background_monitoring_task, args=(contacts,))
    monitoring_thread.start()

    logging.info(f"Monitoring started for {data.user_id}")
    return {"status": "success", "message": "Monitoring started."}


# -----------------------------
# STOP MONITORING
# -----------------------------
@app.post("/stop_monitoring")
async def stop_monitoring_route():
    global monitoring_thread

    if monitoring_thread and monitoring_thread.is_alive():
        stop_monitoring_event.set()
        monitoring_thread.join(timeout=5)
        monitoring_thread = None
        return {"status": "success", "message": "Monitoring stopped."}

    return {"status": "info", "message": "Monitoring is not active."}


# -----------------------------
# TRIGGER SOS
# -----------------------------
@app.api_route("/trigger_sos_for_user", methods=["POST", "OPTIONS"])
async def trigger_sos_for_user_route(request: Request, data: Optional[TriggerSOSRequest] = None):
    
    response = handle_options(request)
    if response:
        return response

    if not data or not data.user_id:
        raise HTTPException(400, "user_id is required")

    user_data = get_user(data.user_id)
    contacts = user_data.get("emergency_contacts", []) if user_data else []

    if not contacts:
        raise HTTPException(400, "No emergency contacts found.")

    success_count = 0
    for number in contacts:
        if sos(number):
            success_count += 1

    if success_count == 0:
        raise HTTPException(500, "Failed to send SOS")

    return {
        "status": "success",
        "message": f"SOS sent to {success_count} contact(s)."
    }


# -----------------------------
# UPLOAD EVIDENCE (FormData)
# -----------------------------
@app.api_route("/upload_evidence", methods=["POST", "OPTIONS"])
async def upload_evidence_route(
    request: Request,
    user_id: Optional[str] = Form(None),
    files: List[UploadFile] = File(default=[])
):
    response = handle_options(request)
    if response:
        return response

    if not user_id:
        raise HTTPException(400, "user_id form field is required")

    successful = []
    failed = []

    for file in files:
        original = file.filename
        temp_path = os.path.join(TEMP_UPLOAD_FOLDER, f"{uuid.uuid4()}-{original}")

        try:
            # Save temp
            with open(temp_path, "wb") as f:
                f.write(file.file.read())

            # Upload
            upload_result = upload_evidence_to_cloudinary(
                file_path=temp_path,
                user_id=user_id,
                file_name=original
            )

            if upload_result and "secure_url" in upload_result:
                save_evidence_metadata(
                    user_id=user_id,
                    filename=original,
                    file_url=upload_result['secure_url'],
                    content_type=file.content_type
                )
                successful.append(original)
            else:
                failed.append(original)

        except Exception as e:
            logging.error(f"Upload error: {e}")
            failed.append(original)
        finally:
            if os.path.exists(temp_path):
                os.remove(temp_path)

    if not successful:
        raise HTTPException(500, "Upload failed")

    return {
        "status": "success",
        "successful_files": successful,
        "failed_files": failed
    }


# -----------------------------
# CHATBOT ENDPOINTS
# -----------------------------
chatbot_router = APIRouter(prefix="/chatbot", tags=["chatbot"])

API_KEY = os.getenv("OPENAI_API_KEY")
chatbot_instance = WomenSafetyChatbot(api_key=API_KEY)


@chatbot_router.api_route("/chat", methods=["POST", "OPTIONS"])
async def chatbot_chat_route(request: Request, data: Optional[ChatRequest] = None):

    response = handle_options(request)
    if response:
        return response

    if not data or not data.user_id or not data.message:
        raise HTTPException(400, "user_id and message are required")

    try:
        result = chatbot_instance.chat(data.user_id, data.message)
        return result
    except Exception as e:
        logging.error(f"Chatbot error: {e}")
        raise HTTPException(500, f"Internal error: {e}")


app.include_router(chatbot_router)


# -----------------------------
# MAIN ENTRY POINT
# -----------------------------
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=int(os.getenv("PORT", 5000)))
