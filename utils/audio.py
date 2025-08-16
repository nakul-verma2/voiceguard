"""
Audio capture utilities for VoiceGuard
"""
import pyaudio
import numpy as np
import threading
import queue
import time

class AudioCapture:
    def __init__(self, sample_rate=16000, chunk_size=1024):
        self.sample_rate = sample_rate
        self.chunk_size = chunk_size
        self.audio_queue = queue.Queue()
        self.is_recording = False
        
    def start_recording(self):
        """Start capturing audio"""
        if self.is_recording:
            print("Already recording!")
            return
            
        self.is_recording = True
        
        # Initialize PyAudio
        p = pyaudio.PyAudio()
        
        # Open stream
        stream = p.open(
            format=pyaudio.paInt16,
            channels=1,
            rate=self.sample_rate,
            input=True,
            frames_per_buffer=self.chunk_size
        )
        
        print("🎤 Audio recording started...")
        
        def record_loop():
            while self.is_recording:
                data = stream.read(self.chunk_size)
                audio_data = np.frombuffer(data, dtype=np.int16)
                self.audio_queue.put((audio_data, time.time()))
                
        # Start recording thread
        self.record_thread = threading.Thread(target=record_loop)
        self.record_thread.daemon = True
        self.record_thread.start()
        
    def get_audio_chunk(self):
        """Get next audio chunk"""
        try:
            return self.audio_queue.get(timeout=0.1)
        except queue.Empty:
            return None
            
    def stop_recording(self):
        """Stop recording"""
        self.is_recording = False
        print("🛑 Audio recording stopped")
