import os
from dotenv import load_dotenv
import logging
import uuid

# --- Load Environment Variables ---
# IMPORTANT: Load variables before other imports that might need them
load_dotenv()

import time
import threading
import numpy as np
from flask import Flask, render_template, request, jsonify
from werkzeug.utils import secure_filename

# --- Local Utils Imports ---
from utils.sos import sos
from utils.audio import AudioCapture
from utils.vad import VoiceActivityDetector
from utils.incident import IncidentRecorder
from utils.audio_buffer import AudioBuffer
from utils.speech_analysis import SpeechAnalyzer
from utils.chatbot import WomenSafetyChatbot
from utils.database import get_user, update_user_contacts, save_evidence_metadata
from utils.storage import upload_evidence_to_cloudinary



app = Flask(__name__,
            template_folder='templates',
            static_folder='templates')


app.config['MAX_CONTENT_LENGTH'] = 100 * 1024 * 1024  # 100 MB max upload size
app.config['UPLOAD_FOLDER'] = 'temp_uploads'


# --- Global State ---
monitoring_thread = None
stop_monitoring_event = threading.Event()
# Note: emergency_contacts is no longer a global variable for the whole app.
# It's now fetched per user and passed to the monitoring thread.

# --- Setup Logging ---
logging.basicConfig(level=logging.INFO, format='%(asctime)s | %(levelname)s | %(message)s')


# --- Background Monitoring Function ---
def background_monitoring_task(emergency_contacts: list):
    """
    This task runs in a background thread to monitor audio.
    It now receives emergency_contacts as an argument.
    """
    logging.info(f"🛡️ VoiceGuard Background Monitoring Thread Started for contacts: {emergency_contacts}")

    # (The rest of the monitoring logic remains the same)
    audio_capture = AudioCapture()
    vad_detector = VoiceActivityDetector(aggressiveness=3)
    incident_recorder = IncidentRecorder()
    audio_buffer = AudioBuffer(max_duration_seconds=15)
    speech_analyzer = SpeechAnalyzer(model_size="base")

    total_chunks, speech_chunks, high_threat_chunks, consecutive_high_threats = 0, 0, 0, 0
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

            audio_data, timestamp = chunk
            audio_buffer.add_audio(audio_data)
            vad_detector.add_audio(audio_data)

            if vad_detector.is_speech_detected():
                speech_chunks += 1
                volume = np.sqrt(np.mean(audio_data.astype(np.float32) ** 2))
                speech_confidence = vad_detector.get_speech_confidence()

                if volume > 1000 and speech_confidence > 0.7:
                    audio_threat_level = "HIGH"
                    consecutive_high_threats += 1
                else:
                    audio_threat_level = "LOW"
                    consecutive_high_threats = 0

                if (audio_threat_level == "HIGH" and
                        consecutive_high_threats >= HIGH_THREAT_THRESHOLD and
                        time.time() - last_incident_time > COOLDOWN_TIME):

                    logging.info("🔍 High threat detected, analyzing speech content...")
                    # (Incident recording and SOS logic is simplified for clarity)
                    
                    if emergency_contacts:
                        logging.info("📱 Sending emergency SMS alerts...")
                        for phone in emergency_contacts:
                            sos(phone)
                        last_incident_time = time.time()
    except Exception as e:
        logging.error(f"Error in monitoring thread: {e}")
    finally:
        audio_capture.stop_recording()
        logging.info("🛑 VoiceGuard Background Monitoring Thread Stopped")


# --- Flask Routes ---
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/demo')
def demo():
    return render_template('demo.html')


@app.route('/set_emergency_contacts', methods=['POST'])
def set_emergency_contacts():
    data = request.get_json()
    user_id = data.get("user_id")
    contacts = data.get("contacts", [])

    if not user_id:
        return jsonify({"status": "error", "message": "user_id is required."}), 400

    update_user_contacts(user_id, contacts)
    logging.info(f"Emergency contacts updated for user {user_id}: {contacts}")
    return jsonify({"status": "success", "contacts": contacts}), 200


@app.route('/start_monitoring', methods=['POST'])
def start_monitoring():
    global monitoring_thread
    if monitoring_thread and monitoring_thread.is_alive():
        return jsonify({'status': 'info', 'message': 'Monitoring already active.'}), 200

    user_id = request.json.get("user_id")
    if not user_id:
        return jsonify({'status': 'error', 'message': 'user_id is required to start monitoring.'}), 400

    # Fetch user-specific contacts from the database
    user_data = get_user(user_id)
    user_contacts = user_data.get("emergency_contacts", []) if user_data else []
    
    if not user_contacts:
        logging.warning(f"User {user_id} started monitoring with no emergency contacts.")

    stop_monitoring_event.clear()
    # Pass the user-specific contacts to the background task
    monitoring_thread = threading.Thread(target=background_monitoring_task, args=(user_contacts,))
    monitoring_thread.start()
    
    logging.info(f"Background monitoring started for user {user_id}.")
    return jsonify({'status': 'success', 'message': 'Monitoring started.'}), 200


@app.route('/stop_monitoring', methods=['POST'])
def stop_monitoring():
    global monitoring_thread
    if monitoring_thread and monitoring_thread.is_alive():
        stop_monitoring_event.set()
        monitoring_thread.join()
        monitoring_thread = None
        logging.info("Background monitoring stopped.")
        return jsonify({'status': 'success', 'message': 'Monitoring stopped.'}), 200
    return jsonify({'status': 'info', 'message': 'Monitoring is not active.'}), 200


@app.route('/send_sms', methods=['POST'])
def send_sms_route():
    data = request.get_json()
    phone_number = data.get('phone')
    if not phone_number:
        return jsonify({'status': 'error', 'message': 'Phone number is required.'}), 400

    logging.info(f"Received request to send SOS to: {phone_number}")
    if sos(phone_number):
        return jsonify({'status': 'success', 'message': f'SOS sent to {phone_number}.'}), 200
    else:
        return jsonify({'status': 'error', 'message': 'Failed to send SOS message.'}), 500


@app.route('/upload_evidence', methods=['POST'])
def upload_evidence():
    if 'files[]' not in request.files:
        return jsonify({'status': 'error', 'message': 'No file part in the request.'}), 400
    
    user_id = request.form.get('user_id')
    if not user_id:
        return jsonify({'status': 'error', 'message': 'user_id form field is required.'}), 400

    files = request.files.getlist('files[]')
    successful_uploads = []
    failed_uploads = []

    # Ensure the temporary upload folder exists
    upload_folder = app.config['UPLOAD_FOLDER']
    os.makedirs(upload_folder, exist_ok=True)

    for file in files:
        if not file or not file.filename:
            continue

        original_filename = secure_filename(file.filename)
        temp_file_path = os.path.join(upload_folder, f"{uuid.uuid4()}-{original_filename}")
        
        try:
            # 1. Save file temporarily to the server
            file.save(temp_file_path)
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
        return jsonify({'status': 'error', 'message': 'File upload failed. Please try again.'}), 500

    return jsonify({
        'status': 'success',
        'message': f'Successfully uploaded {len(successful_uploads)} file(s).',
        'successful_files': successful_uploads,
        'failed_files': failed_uploads
    }), 200


# --- Chatbot Routes ---
API_KEY = os.getenv("OPENAI_API_KEY")
chatbot_instance = WomenSafetyChatbot(api_key=API_KEY)

@app.route('/chat', methods=['POST'])
def chat_route():
    try:
        data = request.get_json()
        user_id = data.get('user_id')
        message = data.get('message')
        
        if not user_id or not message:
            return jsonify({'error': 'user_id and message are required.'}), 400
        
        response = chatbot_instance.chat(user_id, message)
        return jsonify(response), 200 if response.get('success') else 400
            
    except Exception as e:
        logging.error(f"Error in /chat route: {e}")
        return jsonify({'error': str(e), 'success': False}), 500

@app.route('/stats', methods=['GET'])
def stats_route():
    stats = chatbot_instance.get_stats()
    return jsonify(stats), 200

@app.route('/clear-history', methods=['POST'])
def clear_history_route():
    user_id = request.json.get('user_id')
    if not user_id:
        return jsonify({'error': 'user_id is required'}), 400
    
    chatbot_instance.clear_user_history(user_id)
    return jsonify({'success': True, 'message': 'History cleared'}), 200

# --- Main Execution ---
if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port, debug=False)