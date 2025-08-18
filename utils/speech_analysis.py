"""
Speech-to-text and content analysis for VoiceGuard
"""
import whisper
import numpy as np
import tempfile
import soundfile as sf
import os
import re

class SpeechAnalyzer:
    def __init__(self, model_size="base"):
        """
        Initialize Whisper model
        model_size: tiny, base, small, medium, large
        """
        print(f"🤖 Loading Whisper model ({model_size})...")
        try:
            self.model = whisper.load_model(model_size)
            print(f"✅ Whisper model loaded successfully")
        except Exception as e:
            print(f"❌ Error loading Whisper: {e}")
            self.model = None
        
        # Aggressive/abusive keywords for Indian context
        self.threat_keywords = {
            'high': [
                'kill', 'murder', 'die', 'death', 'hurt', 'pain', 'beat', 'hit', 
                'destroy', 'break', 'smash', 'attack', 'fight', 'violence',
                'stupid', 'idiot', 'useless', 'worthless', 'hate', 'disgust'
            ],
            'medium': [
                'angry', 'mad', 'upset', 'annoyed', 'frustrated', 'irritated',
                'shut up', 'stop', 'enough', 'problem', 'wrong', 'bad'
            ]
        }
        
        # Hindi/Hinglish aggressive words (common in Indian households)
        self.hindi_threats = [
            'maar', 'marunga', 'khatam', 'pagal', 'bewakoof', 'gadha', 
            'chup', 'band kar', 'paagal hai', 'dimag kharab'
        ]
    
    def transcribe_audio(self, audio_data, sample_rate=16000):
        """
        Convert audio to text using Whisper
        """
        if self.model is None:
            return {"text": "", "language": "unknown", "error": "Whisper not loaded"}
        
        try:
            # Create temporary file for Whisper
            with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as temp_file:
                # Convert to float32 if needed
                if audio_data.dtype == np.int16:
                    audio_float = audio_data.astype(np.float32) / 32768.0
                else:
                    audio_float = audio_data.astype(np.float32)
                
                # Save temporary audio file
                sf.write(temp_file.name, audio_float, sample_rate)
                
                # Transcribe with Whisper
                result = self.model.transcribe(temp_file.name, language=None)  # Auto-detect language
                
                # Clean up
                os.unlink(temp_file.name)
                
                return {
                    "text": result["text"].strip(),
                    "language": result["language"],
                    "error": None
                }
                
        except Exception as e:
            return {"text": "", "language": "unknown", "error": str(e)}
    
    def analyze_text_threats(self, text):
        """
        Analyze text for threatening/abusive content
        """
        if not text:
            return {"threat_score": 0.0, "threat_level": "NONE", "keywords_found": []}
        
        text_lower = text.lower()
        keywords_found = []
        threat_score = 0.0
        
        # Check for high-threat keywords
        for keyword in self.threat_keywords['high']:
            if keyword in text_lower:
                keywords_found.append(keyword)
                threat_score += 0.3
        
        # Check for medium-threat keywords  
        for keyword in self.threat_keywords['medium']:
            if keyword in text_lower:
                keywords_found.append(keyword)
                threat_score += 0.15
        
        # Check for Hindi/Hinglish threats
        for keyword in self.hindi_threats:
            if keyword in text_lower:
                keywords_found.append(keyword)
                threat_score += 0.25
        
        # Check for excessive capitalization (shouting)
        if len(text) > 10:
            caps_ratio = sum(1 for c in text if c.isupper()) / len(text)
            if caps_ratio > 0.6:
                threat_score += 0.2
                keywords_found.append("EXCESSIVE_CAPS")
        
        # Check for repeated exclamation marks
        exclamation_count = text.count('!')
        if exclamation_count > 2:
            threat_score += min(exclamation_count * 0.1, 0.3)
            keywords_found.append("MULTIPLE_EXCLAMATIONS")
        
        # Determine threat level
        threat_score = min(threat_score, 1.0)  # Cap at 1.0
        
        if threat_score >= 0.7:
            threat_level = "HIGH"
        elif threat_score >= 0.4:
            threat_level = "MEDIUM"
        elif threat_score >= 0.1:
            threat_level = "LOW"
        else:
            threat_level = "NONE"
        
        return {
            "threat_score": threat_score,
            "threat_level": threat_level,
            "keywords_found": keywords_found
        }
    
    def analyze_audio_with_text(self, audio_data, sample_rate=16000):
        """
        Complete analysis: speech-to-text + threat analysis
        """
        # Transcribe audio
        transcription = self.transcribe_audio(audio_data, sample_rate)
        
        # Analyze text for threats
        text_analysis = self.analyze_text_threats(transcription["text"])
        
        return {
            "transcription": transcription,
            "text_analysis": text_analysis,
            "combined_analysis": {
                "has_speech": len(transcription["text"]) > 0,
                "language": transcription["language"],
                "text_threat_level": text_analysis["threat_level"],
                "text_threat_score": text_analysis["threat_score"],
                "threatening_words": text_analysis["keywords_found"]
            }
        }
