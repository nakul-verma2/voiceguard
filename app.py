import os
import logging
import time
import threading
import numpy as np
from flask import Flask, render_template, request, jsonify
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

# --- Global State ---
monitoring_thread = None
stop_monitoring_event = threading.Event()
emergency_contacts = []   # contacts set dynamically from frontend

# --- Setup Logging ---
logging.basicConfig(level=logging.INFO, format='%(asctime)s | %(levelname)s | %(message)s')


# --- Background Monitoring Function (Full Logic from main.py) ---
def background_monitoring_task():
    logging.info("🛡️ VoiceGuard Background Monitoring Thread Started")

    # Initialize components
    audio_capture = AudioCapture()
    vad_detector = VoiceActivityDetector(aggressiveness=3)
    incident_recorder = IncidentRecorder()
    audio_buffer = AudioBuffer(max_duration_seconds=15)
    speech_analyzer = SpeechAnalyzer(model_size="base")

    # Stats tracking
    total_chunks = 0
    speech_chunks = 0
    high_threat_chunks = 0
    consecutive_high_threats = 0

    HIGH_THREAT_THRESHOLD = 1
    COOLDOWN_TIME = 30
    last_incident_time = 0

    try:
        audio_capture.start_recording()

        print("🎯 VoiceGuard is monitoring")
        print("   • HIGH threat incidents trigger SMS to emergency contacts")
        print("   • Speech analysis with threat detection")
        print("   • Audio evidence collection")
        print("Press stop button in UI to stop")
        print()

        while not stop_monitoring_event.is_set():
            chunk = audio_capture.get_audio_chunk()
            if not chunk:
                time.sleep(0.05)
                continue

            audio_data, timestamp = chunk
            total_chunks += 1

            # Add to audio buffer + VAD
            audio_buffer.add_audio(audio_data)
            vad_detector.add_audio(audio_data)

            # Speech detection
            if vad_detector.is_speech_detected():
                speech_chunks += 1

                # Threat level calc
                volume = np.sqrt(np.mean(audio_data.astype(np.float32) ** 2))
                speech_confidence = vad_detector.get_speech_confidence()

                if volume > 1000 and speech_confidence > 0.7:
                    audio_threat_level = "HIGH"
                    threat_emoji = "🔴"
                    consecutive_high_threats += 1
                    high_threat_chunks += 1
                elif volume > 1000 and speech_confidence > 0.5:
                    audio_threat_level = "MEDIUM"
                    threat_emoji = "🟡"
                    consecutive_high_threats = 0
                else:
                    audio_threat_level = "LOW"
                    threat_emoji = "🟢"
                    consecutive_high_threats = 0

                print(f"🗣️  SPEECH: Vol={volume:>6.0f} | Conf={speech_confidence:.2f} | {threat_emoji} {audio_threat_level}")

                # Incident recording
                current_time = time.time()
                if (audio_threat_level == "HIGH" and
                        consecutive_high_threats >= HIGH_THREAT_THRESHOLD and
                        current_time - last_incident_time > COOLDOWN_TIME):

                    print("🔍 Analyzing speech content...")
                    evidence_audio = audio_buffer.get_recent_audio(duration_seconds=8)

                    speech_analysis = speech_analyzer.analyze_audio_with_text(
                        evidence_audio,
                        sample_rate=audio_capture.sample_rate
                    )

                    incident = incident_recorder.record_incident(
                        threat_level="HIGH",
                        volume=volume,
                        speech_confidence=speech_confidence,
                        audio_data=evidence_audio,
                        speech_analysis=speech_analysis,
                        sample_rate=audio_capture.sample_rate
                    )

                    if incident and emergency_contacts:
                        print("📱 Sending emergency SMS alerts...")
                        for phone in emergency_contacts:
                            sms_sent = sos(phone)
                            if sms_sent:
                                print(f"✅ SOS sent to {phone}")
                            else:
                                print(f"❌ Failed to send SOS to {phone}")

                        last_incident_time = current_time
                        consecutive_high_threats = 0
                        print("=" * 60)

            # Stats log
            if total_chunks % 100 == 0 and total_chunks > 0:
                speech_ratio = speech_chunks / total_chunks
                threat_ratio = high_threat_chunks / speech_chunks if speech_chunks > 0 else 0
                print(f"📊 Stats: Speech {speech_chunks}/{total_chunks} ({speech_ratio:.1%}) | "
                      f"High threats: {high_threat_chunks} ({threat_ratio:.1%})")

    except Exception as e:
        logging.error(f"Error in monitoring thread: {e}")
    finally:
        audio_capture.stop_recording()
        summary = incident_recorder.get_incident_summary()
        print("\n🛑 VoiceGuard Stopped")
        print(f"📊 Final Stats: {summary}")
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
    global emergency_contacts
    data = request.get_json()
    emergency_contacts = data.get("contacts", [])
    logging.info(f"Emergency contacts set: {emergency_contacts}")
    return jsonify({"status": "success", "contacts": emergency_contacts}), 200


@app.route('/start_monitoring', methods=['POST'])
def start_monitoring():
    global monitoring_thread
    if monitoring_thread is None or not monitoring_thread.is_alive():
        stop_monitoring_event.clear()
        monitoring_thread = threading.Thread(target=background_monitoring_task)
        monitoring_thread.start()
        logging.info("Background monitoring started.")
        return jsonify({'status': 'success', 'message': 'Monitoring started.'}), 200
    return jsonify({'status': 'info', 'message': 'Monitoring already active.'}), 200


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
    sms_sent_successfully = sos(phone_number)
    if sms_sent_successfully:
        return jsonify({'status': 'success', 'message': f'SOS sent to {phone_number}.'}), 200
    else:
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
