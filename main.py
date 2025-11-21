import os
import time
import threading
import logging
import uuid
import shutil
from typing import List

# Third-party imports
from dotenv import load_dotenv
import numpy as np
from fastapi import FastAPI, APIRouter, HTTPException, BackgroundTasks, status, UploadFile, File, Form
from pydantic import BaseModel
from werkzeug.utils import secure_filename
from starlette.responses import JSONResponse

# --- Load Environment Variables ---
# IMPORTANT: Load variables before other imports that might need them
load_dotenv()

# --- Local Utils Imports ---
# Assuming these utility modules (sos, audio, vad, etc.) are available and don't rely on Flask.
# NOTE: AudioCapture will need to be configured/mocked if run on a server without a microphone.
from utils.sos import sos
from utils.audio import AudioCapture
from utils.vad import VoiceActivityDetector
from utils.incident import IncidentRecorder
from utils.audio_buffer import AudioBuffer
from utils.speech_analysis import SpeechAnalyzer
from utils.chatbot import WomenSafetyChatbot
from utils.database import get_user, update_user_contacts, save_evidence_metadata
from utils.storage import upload_evidence_to_cloudinary


# --- Setup and Configuration ---
app = FastAPI(
    title="VoiceGuard Safety API",
    description="Backend API for the Women Safety application, featuring voice monitoring, emergency contacts, and a safety chatbot.",
    version="1.0.0"
)

# Configuration
TEMP_UPLOAD_FOLDER = 'temp_uploads'
MAX_UPLOAD_SIZE = 100 * 1024 * 1024  # 100 MB

# --- Global State ---
monitoring_thread: threading.Thread = None
stop_monitoring_event = threading.Event()
# Note: emergency_contacts is no longer a global variable for the whole app.

# --- Setup Logging ---
logging.basicConfig(level=logging.INFO, format='%(asctime)s | %(levelname)s | %(message)s')
os.makedirs(TEMP_UPLOAD_FOLDER, exist_ok=True)


# --- Pydantic Request Models ---
class SetContactsRequest(BaseModel):
    user_id: str
    contacts: List[str]

class MonitoringRequest(BaseModel):
    user_id: str

class SendSMSRequest(BaseModel):
    phone: str

class ChatRequest(BaseModel):
    user_id: str
    message: str


# --- Background Monitoring Function ---
# This function is the core logic and is retained largely as-is, running in a separate thread.
def background_monitoring_task(emergency_contacts: list):
    """
    This task runs in a background thread to monitor audio.
    It now receives emergency_contacts as an argument.
    """
    logging.info(f"🛡️ VoiceGuard Background Monitoring Thread Started for contacts: {emergency_contacts}")

    # (The rest of the monitoring logic remains the same)
    audio_capture = AudioCapture()
    vad_detector = VoiceActivityDetector(aggressiveness=3)
    # incident_recorder = IncidentRecorder() # Not strictly used in this logic snippet
    # audio_buffer = AudioBuffer(max_duration_seconds=15) # Not strictly used in this logic snippet
    # speech_analyzer = SpeechAnalyzer(model_size="base") # Not strictly used in this logic snippet

    speech_chunks, consecutive_high_threats = 0, 0
    HIGH_THREAT_THRESHOLD = 1
    COOLDOWN_TIME = 30
    last_incident_time = 0

    try:
        audio_capture.start_recording()
        logging.info("🎯 VoiceGuard is monitoring...")

        while not stop_monitoring_event.is_set():
            chunk = audio_capture.get_audio_chunk()
            if not chunk:
                time.sleep(0.05)
                continue

            audio_data, _ = chunk # timestamp is not used here
            # audio_buffer.add_audio(audio_data) # Omitted for brevity
            vad_detector.add_audio(audio_data)

            if vad_detector.is_speech_detected():
                speech_chunks += 1
                volume = np.sqrt(np.mean(audio_data.astype(np.float32) ** 2))
                speech_confidence = vad_detector.get_speech_confidence()

                # Simplified threat detection logic
                if volume > 1000 and speech_confidence > 0.7:
                    consecutive_high_threats += 1
                else:
                    consecutive_high_threats = 0

                if (consecutive_high_threats >= HIGH_THREAT_THRESHOLD and
                        time.time() - last_incident_time > COOLDOWN_TIME):

                    logging.info("🔍 High threat detected, initiating SOS protocol...")
                    
                    if emergency_contacts:
                        logging.info("📱 Sending emergency SMS alerts...")
                        for phone in emergency_contacts:
                            sos(phone)
                        last_incident_time = time.time()
                    else:
                        logging.warning("No emergency contacts configured to send SOS.")
    except Exception as e:
        logging.error(f"Error in monitoring thread: {e}")
    finally:
        audio_capture.stop_recording()
        logging.info("🛑 VoiceGuard Background Monitoring Thread Stopped")


# --- API Endpoints ---

@app.get("/", status_code=status.HTTP_200_OK)
async def root():
    """Simple health check endpoint."""
    return {"message": "VoiceGuard API is running"}


@app.post("/set_emergency_contacts")
async def set_emergency_contacts_route(data: SetContactsRequest):
    """Updates the emergency contact list for a specific user."""
    update_user_contacts(data.user_id, data.contacts)
    logging.info(f"Emergency contacts updated for user {data.user_id}: {data.contacts}")
    return {"status": "success", "contacts": data.contacts}


@app.post("/start_monitoring")
async def start_monitoring_route(data: MonitoringRequest):
    """Starts the background voice monitoring thread for the user."""
    global monitoring_thread
    
    if monitoring_thread and monitoring_thread.is_alive():
        return JSONResponse(status_code=status.HTTP_200_OK, content={'status': 'info', 'message': 'Monitoring already active.'})

    # Fetch user-specific contacts from the database
    user_data = get_user(data.user_id)
    user_contacts = user_data.get("emergency_contacts", []) if user_data else []
    
    if not user_contacts:
        logging.warning(f"User {data.user_id} started monitoring with no emergency contacts.")

    stop_monitoring_event.clear()
    
    # Pass the user-specific contacts to the background task
    monitoring_thread = threading.Thread(target=background_monitoring_task, args=(user_contacts,))
    monitoring_thread.start()
    
    logging.info(f"Background monitoring started for user {data.user_id}.")
    return {"status": "success", "message": "Monitoring started."}


@app.post("/stop_monitoring")
async def stop_monitoring_route():
    """Stops the background voice monitoring thread."""
    global monitoring_thread
    if monitoring_thread and monitoring_thread.is_alive():
        stop_monitoring_event.set()
        monitoring_thread.join(timeout=5) # Wait up to 5 seconds for the thread to stop gracefully
        if monitoring_thread.is_alive():
            logging.error("Monitoring thread failed to stop gracefully.")
        monitoring_thread = None
        logging.info("Background monitoring stopped.")
        return {"status": "success", "message": "Monitoring stopped."}
        
    return JSONResponse(status_code=status.HTTP_200_OK, content={'status': 'info', 'message': 'Monitoring is not active.'})


@app.post("/send_sms")
async def send_sms_route(data: SendSMSRequest):
    """Manually triggers an SOS SMS to a specific phone number."""
    phone_number = data.phone
    if not phone_number:
        raise HTTPException(status_code=400, detail="Phone number is required.")

    logging.info(f"Received request to send SOS to: {phone_number}")
    if sos(phone_number):
        return {"status": "success", "message": f"SOS sent to {phone_number}."}
    else:
        raise HTTPException(status_code=500, detail="Failed to send SOS message.")


@app.post("/upload_evidence")
async def upload_evidence_route(
    user_id: str = Form(...),
    files: List[UploadFile] = File(...),
):
    """Handles the upload of multiple evidence files to Cloudinary and saves metadata."""
    if not user_id:
        raise HTTPException(status_code=400, detail="user_id form field is required.")

    successful_uploads = []
    failed_uploads = []

    # Ensure the temporary upload folder exists
    os.makedirs(TEMP_UPLOAD_FOLDER, exist_ok=True)

    for file in files:
        original_filename = secure_filename(file.filename)
        temp_file_path = os.path.join(TEMP_UPLOAD_FOLDER, f"{uuid.uuid4()}-{original_filename}")
        
        # Check file size (FastAPI doesn't enforce MAX_CONTENT_LENGTH by default)
        # We handle this check implicitly by reading the file content. 
        # For large files, stream processing is better, but for simplicity we'll handle saving.
        
        try:
            # 1. Save file temporarily to the server using shutil for efficiency
            with open(temp_file_path, "wb") as buffer:
                # Read the file chunk-by-chunk to save it
                shutil.copyfileobj(file.file, buffer)
            logging.info(f"Temporarily saved file: {temp_file_path}")

            # 2. Upload the temporary file to Cloudinary
            upload_result = upload_evidence_to_cloudinary(
                file_path=temp_file_path,
                user_id=user_id,
                file_name=original_filename
            )
            
            if upload_result and 'secure_url' in upload_result:
                # 3. Save metadata to MongoDB
                save_evidence_metadata(
                    user_id=user_id,
                    filename=original_filename,
                    file_url=upload_result['secure_url'],
                    content_type=file.content_type
                )
                successful_uploads.append(original_filename)
                logging.info(f"Successfully uploaded and logged evidence: {original_filename} for user {user_id}")
            else:
                failed_uploads.append(original_filename)
                logging.error(f"Cloudinary upload failed for {original_filename}.")

        except Exception as e:
            logging.error(f"Error processing file {original_filename}: {e}")
            failed_uploads.append(original_filename)
        finally:
            # 4. Delete the temporary file
            if os.path.exists(temp_file_path):
                os.remove(temp_file_path)
                logging.info(f"Deleted temporary file: {temp_file_path}")

    if not successful_uploads:
        raise HTTPException(status_code=500, detail='File upload failed. Please try again or check logs.')

    return {
        'status': 'success',
        'message': f'Successfully uploaded {len(successful_uploads)} file(s).',
        'successful_files': successful_uploads,
        'failed_files': failed_uploads
    }


# --- Chatbot API Router ---
chatbot_router = APIRouter(
    prefix="/chatbot",
    tags=["Chatbot"],
)

API_KEY = os.getenv("OPENAI_API_KEY")
if not API_KEY:
    logging.error("OPENAI_API_KEY is not set. Chatbot will not function.")
chatbot_instance = WomenSafetyChatbot(api_key=API_KEY)


@chatbot_router.post("/chat")
async def chat_route(data: ChatRequest):
    """Sends a message to the safety chatbot and gets a response."""
    try:
        response = chatbot_instance.chat(data.user_id, data.message)
        if not response.get('success'):
             # Use a 400 status if the chatbot logic explicitly returns a failure
            return JSONResponse(status_code=400, content=response) 
        return response
            
    except Exception as e:
        logging.error(f"Error in /chat route: {e}")
        raise HTTPException(status_code=500, detail=f"Internal chat error: {str(e)}")


@chatbot_router.get("/stats")
async def stats_route():
    """Gets usage statistics for the chatbot."""
    stats = chatbot_instance.get_stats()
    return stats


@chatbot_router.post("/clear-history")
async def clear_history_route(data: MonitoringRequest):
    """Clears the chat history for a specific user."""
    chatbot_instance.clear_user_history(data.user_id)
    return {"success": True, "message": "History cleared"}


# Include the router in the main application
app.include_router(chatbot_router)


# --- Main Execution ---
# You will need to run this file using uvicorn (an ASGI server)
#
# Terminal command to run:
# uvicorn main:app --host 0.0.0.0 --port 5000 --reload
#
# (Assuming the file is named main.py)

if __name__ == '__main__':
    logging.info("Starting FastAPI application with uvicorn...")
    try:
        import uvicorn
    except ImportError:
        logging.error("Uvicorn is not installed. Please install with: pip install uvicorn")
        exit(1)
        
    port = int(os.environ.get("PORT", 5000))
    # Note: debug=False from the Flask app is equivalent to not using --reload 
    # in production uvicorn settings. We'll use a basic call here.
    uvicorn.run(app, host="0.0.0.0", port=port)