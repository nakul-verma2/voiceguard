
import whisper
import torch
import os
from datetime import datetime

class Transcriber:
    def __init__(self, model_size="base"):
        """
        Initializes the Whisper transcriber.
        Detects GPU availability and loads the model accordingly.
        """
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        self.output_dir = "transcripts"
        os.makedirs(self.output_dir, exist_ok=True)
        
        print(f"TRANSCRIBER: Loading Whisper '{model_size}' model onto '{self.device}'...")
        self.model = whisper.load_model(model_size, device=self.device)
        print("TRANSCRIBER: Model loaded.")

    def transcribe_and_save(self, audio_path):
        """
        Transcribes the given audio file and saves the result to a text file.

        Args:
            audio_path (str): The path to the audio file to transcribe.

        Returns:
            str: The transcribed text, or an error message.
        """
        if not os.path.exists(audio_path):
            error_message = f"TRANSCRIBER-ERROR: Audio file not found at {audio_path}"
            print(error_message)
            return error_message

        print(f"TRANSCRIBER: Starting transcription for {os.path.basename(audio_path)}...")
        
        try:
            # Perform the transcription
            result = self.model.transcribe(audio_path, fp16=torch.cuda.is_available())
            transcribed_text = result["text"].strip()

            # Save the transcription to a file
            base_filename = os.path.splitext(os.path.basename(audio_path))[0]
            output_filename = f"{base_filename}.txt"
            output_filepath = os.path.join(self.output_dir, output_filename)
            
            with open(output_filepath, "w", encoding="utf-8") as f:
                f.write(transcribed_text)
            
            print(f"TRANSCRIBER: Transcription complete. Saved to {output_filepath}")
            return transcribed_text

        except Exception as e:
            error_message = f"TRANSCRIBER-ERROR: An error occurred during transcription: {e}"
            print(error_message)
            return error_message
