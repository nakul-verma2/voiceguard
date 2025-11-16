# Project Overview

This project, **VoiceGuard**, is a Python-based AI-powered domestic violence detection system. It is designed to identify and intervene in instances of domestic violence by analyzing real-time audio for patterns of distress, aggression, and violence. The system provides a lifeline to victims by connecting them with immediate help from emergency services, trusted contacts, and support organizations.

The project consists of a Flask backend that handles audio processing, threat detection, and chatbot functionality. The frontend is built with HTML, CSS, and JavaScript, providing a user interface for interacting with the system.

## Key Technologies

*   **Backend**: Python, Flask, OpenAI, PyAudio, WebRTCVAD, SoundFile, Whisper
*   **Frontend**: HTML, CSS, JavaScript
*   **Database**: ChromaDB
*   **AI Models**: `meta-llama/llama-3.3-70b-instruct:free` (for chatbot), `whisper` (for speech-to-text)

## Architecture

The application follows a client-server architecture. The Flask server exposes a set of REST APIs that the frontend client consumes. The core functionality is divided into two main parts:

1.  **Real-time Audio Monitoring**: A background thread continuously captures audio from the microphone. It uses a Voice Activity Detector (VAD) to identify speech and then analyzes the audio for signs of distress or aggression. If a high-threat situation is detected, the system automatically sends SOS alerts to pre-defined emergency contacts.
2.  **AI-Powered Chatbot**: The application includes a chatbot named "Asha" that provides guidance, support, and answers to user queries in real-time. The chatbot uses a Retrieval-Augmented Generation (RAG) approach, where it retrieves relevant legal information from a ChromaDB database before generating a response. The database is populated with information from various Indian legal documents related to women's safety.

# Building and Running

To get a local copy up and running, follow these steps:

## Prerequisites

*   Python 3.8+
*   `pip` package manager

## Installation

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

## Running the Application

1.  **Set up the ChromaDB database:**
    ```sh
    python setup_chromadb.py
    ```

2.  **Start the Flask server:**
    ```sh
    python app.py
    ```

3.  Open your web browser and navigate to `http://127.0.0.1:5000`.

# Development Conventions

*   **Code Style**: The Python code generally follows the PEP 8 style guide.
*   **Testing**: There is a `test.py` file, which suggests that the project has some tests. To run the tests, you can likely run `python test.py`.
*   **Contributions**: The `README.md` file includes a section on how to contribute to the project. It encourages forking the repository, creating a feature branch, and opening a pull request.
