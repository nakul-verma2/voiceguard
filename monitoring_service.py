import time
import numpy as np
import os
import multiprocessing
import logging
from utils.audio import AudioCapture
from utils.vad import VoiceActivityDetector
from utils.audio_buffer import AudioBuffer
from utils.incident import IncidentRecorder
from utils.database import save_evidence_metadata
from utils.cloud_storage import CloudUploader

# Configure logging for this module
logging.basicConfig(level=logging.INFO, format='%(asctime)s | %(levelname)s | %(module)s | %(message)s')

# --- Worker Function for Cloud Upload & DB Logging ---
def run_upload_worker(audio_path, incident_id):
    """
    Worker function to upload evidence and log to DB in a separate process.
    """
    logging.info(f"UPLOADER (PID: {os.getpid()}): Starting cloud upload for {incident_id}")
    try:
        user_id = "user@123" # Placeholder User ID
        
        # 1. Upload to Cloudinary
        uploader = CloudUploader()
        secure_url = uploader.upload_evidence(file_path=audio_path, public_id=incident_id)
        
        # 2. If upload is successful, log to MongoDB
        if secure_url:
            logging.info(f"UPLOADER (PID: {os.getpid()}): Upload complete. Logging to database...")
            save_evidence_metadata(
                user_id=user_id,
                filename=incident_id,
                file_url=secure_url,
                content_type='audio/wav'
            )
            logging.info(f"UPLOADER (PID: {os.getpid()}): Database log successful.")
        else:
            logging.error(f"UPLOADER (PID: {os.getpid()}): Cloud upload failed, skipping database log.")

    except Exception as e:
        logging.error(f"UPLOADER (PID: {os.getpid()}): An exception occurred: {e}")

def run_monitoring_loop(stop_event):
    """
    The main monitoring loop, adapted from main2.py.
    This function is intended to be run in a separate process.
    """
    logging.info("🛡️  VoiceGuard Monitoring Service Started")

    # --- Configuration ---
    HIGH_THREAT_VOLUME = 1000
    HIGH_THREAT_CONFIDENCE = 0.7
    RECORDING_EXTENSION_SECONDS = 10
    
    # --- Component Initialization ---
    audio_capture = AudioCapture()
    vad_detector = VoiceActivityDetector(aggressiveness=3)
    incident_recorder = IncidentRecorder()
    
    # --- State Management ---
    is_recording_incident = False
    incident_end_time = 0
    incident_buffer = AudioBuffer(max_duration_seconds=300) # Buffer for a single incident

    try:
        audio_capture.start_recording()
        logging.info("🎯 Monitoring process is active and listening...")

        while not stop_event.is_set():
            chunk = audio_capture.get_audio_chunk()
            if not chunk:
                time.sleep(0.05)
                continue

            audio_data, timestamp = chunk
            current_time = time.time()
            
            vad_detector.add_audio(audio_data)

            if vad_detector.is_speech_detected():
                volume = np.sqrt(np.mean(audio_data.astype(np.float32)**2))
                speech_confidence = vad_detector.get_speech_confidence()

                is_high_threat = (volume > HIGH_THREAT_VOLUME and 
                                  speech_confidence > HIGH_THREAT_CONFIDENCE)

                if is_high_threat:
                    logging.info(f"🔴 HIGH THREAT DETECTED! Vol: {volume:.0f}, Conf: {speech_confidence:.2f}")
                    
                    if not is_recording_incident:
                        logging.info(f"   • Starting new {RECORDING_EXTENSION_SECONDS}s recording...")
                        is_recording_incident = True
                        incident_buffer.clear()
                    
                    new_end_time = current_time + RECORDING_EXTENSION_SECONDS
                    if new_end_time > incident_end_time:
                        logging.info(f"   • Extending recording by {RECORDING_EXTENSION_SECONDS}s...")
                        incident_end_time = new_end_time
                
                if is_recording_incident:
                    incident_buffer.add_audio(audio_data)

            if is_recording_incident and current_time > incident_end_time:
                logging.info("✅ Incident recording finished. Saving and queueing for cloud upload...")
                
                evidence_audio = incident_buffer.get_all_audio()
                
                if evidence_audio.size > 0:
                    incident_filename = incident_recorder.save_audio_evidence(
                        audio_data=evidence_audio,
                        sample_rate=audio_capture.sample_rate
                    )
                    
                    if incident_filename:
                        logging.info(f"   • Evidence saved locally: evidence/{incident_filename}")
                        audio_filepath = os.path.join("evidence", incident_filename)
                        incident_id = os.path.splitext(incident_filename)[0]
                        process = multiprocessing.Process(target=run_upload_worker, args=(audio_filepath, incident_id)) 
                        process.start()
                    else:
                        logging.error("• Failed to save audio evidence.")
                else:
                    logging.warning("• No audio data to save for the incident.")
                
                is_recording_incident = False
                incident_buffer.clear()
                logging.info("="*50)
                logging.info("🎯 Resuming monitoring...")

            time.sleep(0.05)

    except Exception as e:
        logging.error(f"An unexpected error occurred in monitoring loop: {e}", exc_info=True)
    finally:
        logging.info("🛑 VoiceGuard Monitoring Service Shutting Down...")
        audio_capture.stop_recording()
        # Final check to save any in-progress incident when stopped
        if is_recording_incident and not incident_buffer.is_empty():
            logging.info("   • Saving final in-progress incident before exit...")
            evidence_audio = incident_buffer.get_all_audio()
            if evidence_audio.size > 0:
                incident_filename = incident_recorder.save_audio_evidence(
                    audio_data=evidence_audio,
                    sample_rate=audio_capture.sample_rate
                )
                if incident_filename:
                    logging.info(f"   • Final evidence saved to: evidence/{incident_filename}")
                    audio_filepath = os.path.join("evidence", incident_filename)
                    incident_id = os.path.splitext(incident_filename)[0]
                    # Note: Using a process here might not complete if the main app is force-killed.
                    # For a clean shutdown, this might need to be a blocking call.
                    # For now, we'll still spawn it.
                    process = multiprocessing.Process(target=run_upload_worker, args=(audio_filepath, incident_id)) 
                    process.start()
        logging.info("   • Audio capture stopped.")