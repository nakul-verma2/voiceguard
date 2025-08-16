"""
Voice Activity Detection utilities for VoiceGuard
"""
import webrtcvad
import numpy as np
from collections import deque

class VoiceActivityDetector:
    def __init__(self, sample_rate=16000, aggressiveness=3):
        """
        aggressiveness: 0-3, where 3 is most aggressive (less likely to detect silence as speech)
        """
        self.sample_rate = sample_rate
        self.frame_duration = 30  # 30ms frames
        self.frame_size = int(sample_rate * self.frame_duration / 1000)
        
        self.vad = webrtcvad.Vad(aggressiveness)
        self.audio_buffer = deque()
        self.speech_frames = deque(maxlen=20)  # Track last 20 frames
        
    def add_audio(self, audio_data):
        """Add audio data to buffer"""
        # Convert to 16-bit PCM
        if audio_data.dtype != np.int16:
            audio_data = (audio_data * 32767).astype(np.int16)
        self.audio_buffer.extend(audio_data)
    
    def is_speech_detected(self):
        """Process buffered audio and return if speech is detected"""
        speech_detected = False
        
        # Process all complete frames in buffer
        while len(self.audio_buffer) >= self.frame_size:
            # Extract 30ms frame
            frame = np.array([self.audio_buffer.popleft() for _ in range(self.frame_size)])
            frame_bytes = frame.tobytes()
            
            # Check if frame contains speech
            try:
                is_speech = self.vad.is_speech(frame_bytes, self.sample_rate)
                self.speech_frames.append(is_speech)
                
                if is_speech:
                    speech_detected = True
                    
            except Exception as e:
                print(f"VAD error: {e}")
                self.speech_frames.append(False)
        
        return speech_detected
    
    def get_speech_confidence(self):
        """Get confidence that recent audio contains speech (0-1)"""
        if len(self.speech_frames) == 0:
            return 0.0
        return sum(self.speech_frames) / len(self.speech_frames)
