"""
Audio buffer for evidence collection
"""
import numpy as np
from collections import deque

class AudioBuffer:
    def __init__(self, max_duration_seconds=10, sample_rate=16000):
        """
        Keep a rolling buffer of audio for evidence collection
        """
        self.max_samples = max_duration_seconds * sample_rate
        self.sample_rate = sample_rate
        self.buffer = deque(maxlen=self.max_samples)
    
    def add_audio(self, audio_data):
        """Add audio data to buffer"""
        self.buffer.extend(audio_data)
    
    def get_recent_audio(self, duration_seconds=5):
        """Get recent audio as numpy array"""
        num_samples = min(int(duration_seconds * self.sample_rate), len(self.buffer))
        if num_samples == 0:
            return np.array([], dtype=np.int16)
        
        # Get last N samples
        recent_samples = list(self.buffer)[-num_samples:]
        return np.array(recent_samples, dtype=np.int16)
    
    def clear(self):
        """Clear the buffer"""
        self.buffer.clear()
