
import time
import numpy as np
import asyncio
from utils.audio import AudioCapture
from utils.vad import VoiceActivityDetector
from utils.audio_buffer import AudioBuffer
from utils.incident import IncidentRecorder

async def main():
    print("🛡️  VoiceGuard - Dynamic Evidence Recording")
    print("=" * 50)

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
        print("🎯 VoiceGuard is monitoring...")
        print(f"   • Threat triggers a {RECORDING_EXTENSION_SECONDS}s recording.")
        print(f"   • Subsequent threats extend the recording.")
        print("   • Press Ctrl+C to stop.")
        print()

        # --- Main Monitoring Loop ---
        while True:
            chunk = audio_capture.get_audio_chunk()
            if not chunk:
                time.sleep(0.05)
                continue

            audio_data, timestamp = chunk
            current_time = time.time()
            
            # Always feed audio to VAD
            vad_detector.add_audio(audio_data)
            
            print(f"🎤 Audio Chunk Received: {timestamp}", end='\r')

            # --- Threat Detection and Recording Logic ---
            if vad_detector.is_speech_detected():
                volume = np.sqrt(np.mean(audio_data.astype(np.float32)**2))
                speech_confidence = vad_detector.get_speech_confidence()

                is_high_threat = (volume > HIGH_THREAT_VOLUME and 
                                  speech_confidence > HIGH_THREAT_CONFIDENCE)

                if is_high_threat:
                    print(f"\n🔴 HIGH THREAT DETECTED! Vol: {volume:.0f}, Conf: {speech_confidence:.2f}")
                    
                    if not is_recording_incident:
                        # --- Start a new incident recording ---
                        print(f"   • Starting new {RECORDING_EXTENSION_SECONDS}s recording...")
                        is_recording_incident = True
                        incident_buffer.clear() # Clear buffer for new incident
                    
                    # --- Extend the current recording ---
                    new_end_time = current_time + RECORDING_EXTENSION_SECONDS
                    if new_end_time > incident_end_time:
                        print(f"   • Extending recording by {RECORDING_EXTENSION_SECONDS}s...")
                        incident_end_time = new_end_time
                
                # If currently recording, add all speech chunks to the buffer
                if is_recording_incident:
                    incident_buffer.add_audio(audio_data)

            # --- Incident Finalization ---
            if is_recording_incident and current_time > incident_end_time:
                print("\n✅ Incident recording finished. Saving evidence...")
                
                # Retrieve the full incident audio
                evidence_audio = incident_buffer.get_all_audio()
                
                if evidence_audio.size > 0:
                    # Save the incident using the IncidentRecorder
                    incident_filename = incident_recorder.save_audio_evidence(
                        audio_data=evidence_audio,
                        sample_rate=audio_capture.sample_rate
                    )
                    print(f"   • Evidence saved to: evidence/{incident_filename}")
                else:
                    print("   • No audio data to save.")
                
                # Reset state for the next incident
                is_recording_incident = False
                incident_buffer.clear()
                print("\n" + "="*50)
                print("🎯 VoiceGuard is monitoring...")


            time.sleep(0.05)

    except KeyboardInterrupt:
        print("\n\n🛑 VoiceGuard Stopped")
        # If an incident was being recorded when stopped, save it
        if is_recording_incident and not incident_buffer.is_empty():
            print("   • Saving final in-progress incident...")
            evidence_audio = incident_buffer.get_all_audio()
            if evidence_audio.size > 0:
                incident_filename = incident_recorder.save_audio_evidence(
                    audio_data=evidence_audio,
                    sample_rate=audio_capture.sample_rate
                )
                print(f"   • Evidence saved to: evidence/{incident_filename}")
        
        summary = incident_recorder.get_incident_summary()
        if summary['total_incidents'] > 0:
             print(f"\n📁 Incident files saved in 'evidence/' directory.")

    finally:
        audio_capture.stop_recording()
        print("   • Audio capture stopped.")


if __name__ == "__main__":
    asyncio.run(main())
