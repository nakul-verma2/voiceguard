# VoiceGuard: AI-Powered Domestic Violence Detection

## Project Overview

VoiceGuard is a Python-based web application designed to detect and intervene in instances of domestic violence. It uses real-time audio analysis to identify patterns of distress, aggression, and violence, and can automatically send SOS alerts to emergency contacts.

The application is built with a Flask backend and a simple HTML/CSS/JavaScript frontend. The core functionality involves:

*   **Real-time Audio Monitoring:** A background thread continuously captures audio from the microphone.
*   **Voice Activity Detection (VAD):** The `webrtcvad` library is used to detect human speech in the audio stream.
*   **Speech-to-Text:** The `whisper` library transcribes the detected speech into text.
*   **Threat Analysis:** The transcribed text is analyzed for keywords associated with threats and aggression.
*   **Emergency Alerts:** If a high threat level is detected, the application can send SMS alerts via Twilio (the `sos` utility is not fully shown, but this is inferred).
*   **Web Interface:** The Flask application provides a web interface to start and stop monitoring, configure emergency contacts, and upload evidence files.

## Building and Running

### 1. Prerequisites

*   Python 3.8+
*   `pip` package manager

### 2. Installation

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/nakul-verma2/voiceguard.git
    cd voiceguard
    ```

2.  **Create and activate a virtual environment:**
    ```sh
    # For Windows
    python -m venv venv
    .\venv\Scripts\activate

    # For macOS/Linux
    python3 -m venv venv
    source venv/bin/activate
    ```

3.  **Install the required packages:**
    ```sh
    pip install -r requirements.txt
    ```

4.  **Set up environment variables:**
    Create a `.env` file in the root directory and add your API keys:
    ```env
    OPENAI_API_KEY=sk-...    # your secret key
    OPENAI_BASE_URL=https://openrouter.ai/api/v1
    MODEL_ID=mistralai/mistral-nemo:free   # free multilingual model(We can use GPT[OpenAI] also)
    PORT=5000                              # Flask port
    EMBEDDING_MODEL=sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2
    ```

### 3. Running the Application

1.  **Start the Flask server:**
    ```sh
    python app.py
    ```

2.  Open your web browser and navigate to `http://127.0.0.1:5000`.

## Development Conventions

*   **Modular Structure:** The application is organized into several modules within the `utils` directory, each responsible for a specific task (e.g., `audio.py`, `vad.py`, `speech_analysis.py`).
*   **Configuration:** The application uses a `config.json` file for basic configuration and a `.env` file for sensitive data like API keys.
*   **Logging:** The application uses the `logging` module to log events and errors.
*   **Frontend:** The frontend is composed of simple HTML, CSS, and JavaScript files located in the `templates` directory.
*   **Dependencies:** Python dependencies are managed with a `requirements.txt` file.
