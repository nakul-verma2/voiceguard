import os
import logging
import sys
import time
import threading
from flask import Flask, render_template, request, jsonify, url_for
from werkzeug.utils import secure_filename
from utils.sos import sos
from utils.audio import AudioCapture
from utils.vad import VoiceActivityDetector
from utils.incident import IncidentRecorder
from utils.audio_buffer import AudioBuffer
from utils.speech_analysis import SpeechAnalyzer


app = Flask(__name__,
            template_folder='templates',
            static_folder='templates')

app.config['UPLOAD_FOLDER'] = 'evidence/images'
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16 MB max upload size

# --- Global State for Background Monitoring ---
monitoring_thread = None
stop_monitoring_event = threading.Event()

# --- Setup Logging ---
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

# --- Background Monitoring Function (Adapted from your main.py) ---
def background_monitoring_task():
    """This function runs in a separate thread and handles audio analysis."""
    logging.info("🛡️ VoiceGuard Background Monitoring Thread Started")
    
    try:
        # Initialize your components from the utils module
        audio_capture = AudioCapture()
        vad_detector = VoiceActivityDetector(aggressiveness=3)
        incident_recorder = IncidentRecorder()
        audio_buffer = AudioBuffer(max_duration_seconds=15)
        speech_analyzer = SpeechAnalyzer(model_size="base")

        audio_capture.start_recording()
        
        logging.info("🎯 VoiceGuard is monitoring in the background...")
        
        while not stop_monitoring_event.is_set():
            chunk = audio_capture.get_audio_chunk()
            if chunk:
.
                audio_data, timestamp = chunk
                audio_buffer.add_audio(audio_data)
                vad_detector.add_audio(audio_data)
                
                if vad_detector.is_speech_detected():
                    logging.info("🗣️ Speech detected, analyzing...")
                    # Add your full analysis, threat detection, and incident
                    # recording logic here, just like in your original main.py.
            else:
                # This prevents the loop from consuming 100% CPU if get_audio_chunk is non-blocking
                time.sleep(0.05)

    except Exception as e:
        logging.error(f"Error in background monitoring thread: {e}")
    finally:
        if 'audio_capture' in locals():
            audio_capture.stop_recording()
        logging.info("🛑 VoiceGuard Background Monitoring Thread Stopped")


# --- Flask Routes ---

@app.route('/')
def index():
    """Serves the main landing page."""
    return render_template('index.html')

@app.route('/demo')
def demo():
    """Serves the interactive demo page."""
    return render_template('demo.html')

@app.route('/start_monitoring', methods=['POST'])
def start_monitoring():
    global monitoring_thread
    if monitoring_thread is None or not monitoring_thread.is_alive():
        stop_monitoring_event.clear()
        monitoring_thread = threading.Thread(target=background_monitoring_task)
        monitoring_thread.start()
        logging.info("Background monitoring started.")
        return jsonify({'status': 'success', 'message': 'Monitoring started.'}), 200
    return jsonify({'status': 'info', 'message': 'Monitoring is already active.'}), 200

@app.route('/stop_monitoring', methods=['POST'])
def stop_monitoring():
    global monitoring_thread
    if monitoring_thread and monitoring_thread.is_alive():
        stop_monitoring_event.set()
        monitoring_thread.join() # Wait for the thread to finish
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
    sms_sent_successfully = sos(phone_number)
    if sms_sent_successfully:
        logging.info(f"Successfully sent SMS to {phone_number}")
        return jsonify({'status': 'success', 'message': f'SOS sent to {phone_number}.'}), 200
    else:
        logging.error(f"Failed to send SMS to {phone_number}")
        return jsonify({'status': 'error', 'message': 'Failed to send SOS message.'}), 500

@app.route('/upload_evidence', methods=['POST'])
def upload_evidence():
    if 'files[]' not in request.files:
        return jsonify({'status': 'error', 'message': 'No file part in the request.'}), 400
    
    files = request.files.getlist('files[]')
    successful_uploads = []
    upload_folder = app.config['UPLOAD_FOLDER']
    
    if not os.path.exists(upload_folder):
        os.makedirs(upload_folder)

    for file in files:
        if file and file.filename:
            filename = secure_filename(file.filename)
            save_path = os.path.join(upload_folder, filename)
            try:
                file.save(save_path)
                successful_uploads.append(filename)
                logging.info(f"Successfully saved evidence file: {filename}")
            except Exception as e:
                logging.error(f"Error saving file {filename}: {e}")
                return jsonify({'status': 'error', 'message': 'Error saving file.'}), 500

    if not successful_uploads:
        return jsonify({'status': 'error', 'message': 'No files were uploaded.'}), 400

    return jsonify({
        'status': 'success',
        'message': f'Successfully uploaded {len(successful_uploads)} file(s).',
        'filenames': successful_uploads
    }), 200

# --- Main Execution ---
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)