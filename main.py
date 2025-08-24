import time
import numpy as np
import asyncio
from utils.audio import AudioCapture
from utils.vad import VoiceActivityDetector
from utils.incident import IncidentRecorder
from utils.audio_buffer import AudioBuffer
from utils.speech_analysis import SpeechAnalyzer
from utils.sos import sos

async def main():
    print("🛡️  VoiceGuard - Step 5: Emergency SMS ")
    print("=" * 50)
    
    # Create components
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
    
    # Incident detection parameters
    HIGH_THREAT_THRESHOLD = 1
    COOLDOWN_TIME = 30
    last_incident_time = 0
    
    try:
        # Start recording
        audio_capture.start_recording()
        
        print("🎯 VoiceGuard is monitoring")
        print("   • HIGH threat incidents trigger SMS to emergency contacts")
        print("   • Speech analysis with threat detection")
        print("   • Audio evidence collection")
        print("Press Ctrl+C to stop")
        print()
        
        # Main loop
        while True:
            chunk = audio_capture.get_audio_chunk()
            if chunk:
                audio_data, timestamp = chunk
                total_chunks += 1
                
                # Always add to audio buffer
                audio_buffer.add_audio(audio_data)
                
                # Add to VAD
                vad_detector.add_audio(audio_data)
                
                # Check if speech is detected
                if vad_detector.is_speech_detected():
                    speech_chunks += 1
                    
                    # Calculate audio-based threat level
                    volume = np.sqrt(np.mean(audio_data.astype(np.float32)**2))
                    speech_confidence = vad_detector.get_speech_confidence()
                    
                    # Audio threat calculation
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
                    
                    # Check for incident recording
                    current_time = time.time()
                    if (audio_threat_level == "HIGH" and 
                        consecutive_high_threats >= HIGH_THREAT_THRESHOLD and
                        current_time - last_incident_time > COOLDOWN_TIME):
                        
                        print("🔍 Analyzing speech content...")
                        
                        # Get audio evidence for analysis
                        evidence_audio = audio_buffer.get_recent_audio(duration_seconds=8)
                        
                        # Perform speech analysis
                        speech_analysis = speech_analyzer.analyze_audio_with_text(
                            evidence_audio, 
                            sample_rate=audio_capture.sample_rate
                        )
                        
                        # Record incident with speech analysis
                        incident = incident_recorder.record_incident(
                            threat_level="HIGH",
                            volume=volume,
                            speech_confidence=speech_confidence,
                            audio_data=evidence_audio,
                            speech_analysis=speech_analysis,
                            sample_rate=audio_capture.sample_rate
                        )
                        
                        if incident:
                            # Send emergency SMS alert
                            print("📱 Sending emergency SMS alert...")
                            phone = input("Enter destination phone (e.g., +11234567890): ").strip()
                            sms_sent = sos(phone)
                            if sms_sent:
                                print("✅ Emergency contacts notified!")
                            else:
                                print("❌ Failed to send SMS alerts")
                            
                            last_incident_time = current_time
                            consecutive_high_threats = 0
                            print("=" * 60)
                
                # Print stats every 100 chunks
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
            print(f"   incidents/ - JSON records with transcripts and SMS logs")
            print(f"   evidence/ - Audio evidence files")
    finally:
        audio_capture.stop_recording()

if __name__ == "__main__":
    # Run async main function
    asyncio.run(main())
