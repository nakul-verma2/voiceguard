"""
VoiceGuard Main Application - Step 3: Incident Recording
"""
import time
import numpy as np
from utils.audio import AudioCapture
from utils.vad import VoiceActivityDetector
from utils.incident import IncidentRecorder
from utils.audio_buffer import AudioBuffer

def main():
    print("🛡️  VoiceGuard - Step 3: Incident Recording")
    print("=" * 50)
    
    # Create components
    audio_capture = AudioCapture()
    vad_detector = VoiceActivityDetector(aggressiveness=3)
    incident_recorder = IncidentRecorder()
    audio_buffer = AudioBuffer(max_duration_seconds=15)  # Keep 15 seconds of audio
    
    # Stats tracking
    total_chunks = 0
    speech_chunks = 0
    high_threat_chunks = 0
    consecutive_high_threats = 0
    
    # Incident detection parameters
    HIGH_THREAT_THRESHOLD = 3  # Need 3 consecutive HIGH threats to record incident
    COOLDOWN_TIME = 30  # Wait 30 seconds between incidents
    last_incident_time = 0
    
    try:
        # Start recording
        audio_capture.start_recording()
        
        print("🎯 VoiceGuard is now monitoring for domestic violence incidents")
        print("   • Background noise will be ignored")
        print("   • HIGH threats will trigger incident recording")
        print("   • Audio evidence will be saved automatically")
        print("Press Ctrl+C to stop")
        print()
        
        # Main loop
        while True:
            chunk = audio_capture.get_audio_chunk()
            if chunk:
                audio_data, timestamp = chunk
                total_chunks += 1
                
                # Always add to audio buffer for evidence collection
                audio_buffer.add_audio(audio_data)
                
                # Add to VAD
                vad_detector.add_audio(audio_data)
                
                # Check if speech is detected
                if vad_detector.is_speech_detected():
                    speech_chunks += 1
                    
                    # Calculate threat level
                    volume = np.sqrt(np.mean(audio_data.astype(np.float32)**2))
                    speech_confidence = vad_detector.get_speech_confidence()
                    
                    # Threat calculation
                    if volume > 15000 and speech_confidence > 0.7:
                        threat_level = "HIGH"
                        threat_emoji = "🔴"
                        consecutive_high_threats += 1
                        high_threat_chunks += 1
                    elif volume > 8000 and speech_confidence > 0.5:
                        threat_level = "MEDIUM"
                        threat_emoji = "🟡"
                        consecutive_high_threats = 0
                    else:
                        threat_level = "LOW"
                        threat_emoji = "🟢"
                        consecutive_high_threats = 0
                    
                    print(f"🗣️  SPEECH: Vol={volume:>6.0f} | Conf={speech_confidence:.2f} | {threat_emoji} {threat_level}")
                    
                    # Check for incident recording
                    current_time = time.time()
                    if (threat_level == "HIGH" and 
                        consecutive_high_threats >= HIGH_THREAT_THRESHOLD and
                        current_time - last_incident_time > COOLDOWN_TIME):
                        
                        # Record incident!
                        evidence_audio = audio_buffer.get_recent_audio(duration_seconds=8)
                        
                        incident = incident_recorder.record_incident(
                            threat_level="HIGH",
                            volume=volume,
                            speech_confidence=speech_confidence,
                            audio_data=evidence_audio,
                            sample_rate=audio_capture.sample_rate
                        )
                        
                        if incident:
                            last_incident_time = current_time
                            consecutive_high_threats = 0  # Reset counter
                            print("=" * 60)
                
                # Print stats every 100 chunks (~10 seconds)
                if total_chunks % 100 == 0 and total_chunks > 0:
                    speech_ratio = speech_chunks / total_chunks
                    threat_ratio = high_threat_chunks / speech_chunks if speech_chunks > 0 else 0
                    print(f"📊 Stats: Speech {speech_chunks}/{total_chunks} ({speech_ratio:.1%}) | High threats: {high_threat_chunks} ({threat_ratio:.1%})")
            
            time.sleep(0.05)
            
    except KeyboardInterrupt:
        print(f"\n\n🛑 VoiceGuard Stopped")
        
        # Show final summary
        summary = incident_recorder.get_incident_summary()
        print(f"📊 Final Stats:")
        print(f"   Total incidents recorded: {summary['total_incidents']}")
        print(f"   Total audio chunks: {total_chunks}")
        print(f"   Speech chunks: {speech_chunks}")
        print(f"   High threat chunks: {high_threat_chunks}")
        
        if summary['total_incidents'] > 0:
            print(f"\n📁 Incident files saved in:")
            print(f"   incidents/ - JSON incident records")
            print(f"   evidence/ - Audio evidence files")
    finally:
        audio_capture.stop_recording()

if __name__ == "__main__":
    main()
