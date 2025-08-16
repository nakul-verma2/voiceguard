"""
Incident recording and management for VoiceGuard
"""
import json
import time
import os
import numpy as np
import soundfile as sf
from datetime import datetime

class IncidentRecorder:
    def __init__(self, incidents_dir="incidents", audio_dir="evidence"):
        self.incidents_dir = incidents_dir
        self.audio_dir = audio_dir
        self.incident_count = 0
        
        # Create directories
        os.makedirs(incidents_dir, exist_ok=True)
        os.makedirs(audio_dir, exist_ok=True)
        
        print(f"📁 Incident recorder initialized")
        print(f"   Incidents: {incidents_dir}/")
        print(f"   Audio evidence: {audio_dir}/")
    
    def record_incident(self, threat_level, volume, speech_confidence, audio_data, sample_rate=16000):
        """Record a new incident with audio evidence"""
        self.incident_count += 1
        timestamp = datetime.now()
        
        # Generate filenames
        incident_id = f"incident_{timestamp.strftime('%Y%m%d_%H%M%S')}_{self.incident_count:03d}"
        json_file = os.path.join(self.incidents_dir, f"{incident_id}.json")
        audio_file = os.path.join(self.audio_dir, f"{incident_id}.wav")
        
        # Save audio evidence
        try:
            # Convert int16 to float32 for soundfile
            if audio_data.dtype == np.int16:
                audio_float = audio_data.astype(np.float32) / 32768.0
            else:
                audio_float = audio_data.astype(np.float32)
                
            sf.write(audio_file, audio_float, sample_rate)
            audio_saved = True
            audio_duration = len(audio_data) / sample_rate
        except Exception as e:
            print(f"❌ Error saving audio: {e}")
            audio_saved = False
            audio_duration = 0
        
        # Create incident record
        incident_data = {
            "incident_id": incident_id,
            "timestamp": timestamp.isoformat(),
            "threat_level": threat_level,
            "volume": float(volume),
            "speech_confidence": float(speech_confidence),
            "audio_file": audio_file if audio_saved else None,
            "audio_duration_seconds": audio_duration,
            "audio_saved": audio_saved,
            "sample_rate": sample_rate,
            "detection_system": "VoiceGuard v1.0"
        }
        
        # Save incident JSON
        try:
            with open(json_file, 'w') as f:
                json.dump(incident_data, f, indent=2)
            
            print(f"🚨 INCIDENT RECORDED: {incident_id}")
            print(f"   Threat: {threat_level}")
            print(f"   Volume: {volume:.0f}")
            print(f"   Confidence: {speech_confidence:.2f}")
            print(f"   Evidence: {audio_file if audio_saved else 'Failed to save'}")
            print(f"   Duration: {audio_duration:.1f}s")
            
            return incident_data
            
        except Exception as e:
            print(f"❌ Error saving incident: {e}")
            return None
    
    def get_incident_summary(self):
        """Get summary of all incidents"""
        incidents = []
        
        if os.path.exists(self.incidents_dir):
            for filename in os.listdir(self.incidents_dir):
                if filename.endswith('.json'):
                    try:
                        with open(os.path.join(self.incidents_dir, filename), 'r') as f:
                            incidents.append(json.load(f))
                    except Exception as e:
                        print(f"Error reading {filename}: {e}")
        
        return {
            "total_incidents": len(incidents),
            "incidents": sorted(incidents, key=lambda x: x['timestamp'], reverse=True)
        }
