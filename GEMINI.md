# VoiceGuard Project Overview

This document provides an overview of the VoiceGuard project, detailing its purpose, architecture, key features, and instructions for getting started with development.

## Project Purpose

**VoiceGuard** is an AI-powered detection system designed to identify and intervene in instances of domestic violence. By analyzing real-time audio for patterns of distress, aggression, and violence, VoiceGuard aims to provide a lifeline to victims, connecting them with immediate help from emergency services, trusted contacts, and support organizations. The mission is to leverage technology to create a safer environment and break the cycle of abuse.

## Architecture

The VoiceGuard project features a unified FastAPI backend interacting with a modern frontend application.

### Technologies Used

*   **Backend (Python):** FastAPI, OpenAI, NumPy, PyMongo, Cloudinary, Chromadb.
*   **Frontend (Web):** React.js, TypeScript, Vite, Tailwind CSS, shadcn/ui, Clerk (for authentication).
*   **Database:** MongoDB Atlas.
*   **Cloud Storage:** Cloudinary.
*   **AI/ML:** OpenAI models (Mistral-Nemo, sentence-transformers for embeddings), custom speech analysis.

### Component Breakdown

1.  **FastAPI Backend (`main.py`)**
    *   **Purpose:** The single, unified backend for the entire application, built with FastAPI. It is responsible for all user-facing API functionalities, including real-time audio monitoring, AI-powered threat detection, chatbot interaction, evidence uploads, and emergency contact management.
    *   `main.py`: The entry point for the FastAPI server. It handles all API routes and manages the lifecycle of the monitoring service.
    *   `monitoring_service.py`: Contains the core logic for audio capture, Voice Activity Detection (VAD), threat assessment, and incident handling, running in a separate process.
    *   **Interaction:** Exposes all API endpoints for the frontend, such as `/start_monitoring`, `/add_contact`, `/upload_evidence`, and `/chat`.
    *   **Legacy Backup:** The old Flask-based backend (`app.py`) is deprecated but kept in the repository as a backup. All new development should target the FastAPI application.

2.  **Frontend Application (`frontend/`)**
    *   **Purpose:** The user interface for interacting with VoiceGuard, providing access to its features.
    *   **Framework:** Built with React.js and TypeScript, utilizing Vite for a fast development experience.
    *   **UI/Styling:** Employs Tailwind CSS for styling and `shadcn/ui` for a modern and accessible component library.
    *   **Authentication:** Integrates Clerk for user authentication and management.
    *   **Interaction:** Communicates with the unified FastAPI backend via API calls.

3.  **Utility Modules (`utils/`)**
    *   A collection of Python modules supporting the backend application, including:
        *   `audio.py`: Audio capture utilities.
        *   `vad.py`: Voice Activity Detection.
        *   `audio_buffer.py`: Buffering audio chunks.
        *   `incident.py`: Incident recording and saving.
        *   `database.py`: Database (MongoDB) interactions.
        *   `cloud_storage.py`: Cloudinary integration for file uploads.
        *   `chatbot.py`: AI chatbot logic.
        *   `sos.py`: SMS sending functionality.

## Key Features

*   **Real-time Monitoring:** Continuously listens for audio cues in the background with a privacy-first approach.
*   **AI Threat Detection:** Utilizes advanced machine learning to detect distress patterns, threats, and indicators of violence.
*   **Emergency SOS Alerts:** Instantly notifies trusted contacts and local authorities with location details during a crisis.
*   **Secure Evidence Locker:** Allows users to securely upload and store encrypted evidence like photos, screenshots, and documents.
*   **Multilingual Support:** Offers support for multiple Indian languages, ensuring accessibility for a diverse user base.
*   **Legal Guidance:** Provides resources and information on legal rights and procedures for victims of domestic violence.
*   **AI Support Chatbot ("Asha"):** An integrated chatbot offers guidance, support, and answers to user queries in real-time.

## Getting Started

To set up and run the VoiceGuard project locally, follow these steps.

### Prerequisites

*   Python 3.8+
*   `pip` package manager
*   Node.js (LTS recommended) and npm/bun for the frontend.
*   A [Google Cloud](https://cloud.google.com/) account with an active project.
*   A [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) account.
*   A [Cloudinary](https://cloudinary.com/) account.

### Backend Setup

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/nakul-verma2/voiceguard.git
    cd voiceguard
    ```

2.  **Create and activate a Python virtual environment:**
    ```sh
    # For Windows
    python -m venv venv
    .\venv\Scripts\activate

    # For macOS/Linux
    python3 -m venv venv
    source venv/bin/activate
    ```

3.  **Install Python dependencies:**
    ```sh
    pip install -r requirements.txt
    ```

4.  **Cloud Services Setup (MongoDB Atlas & Cloudinary):**
    *   **MongoDB Atlas:**
        *   Create a free cluster, a database user with a secure password, and whitelist your IP address (or `0.0.0.0/0` for development).
        *   Obtain your connection string (URI).
    *   **Cloudinary:**
        *   Sign up for a free account.
        *   Find your API Environment variable (e.g., `cloudinary://<api_key>:<api_secret>@<cloud_name>`).

5.  **Environment Variables:**
    *   Create a `.env` file in the root directory of the project.
    *   Add the following variables, filling in your obtained credentials:
        ```env
        # --- OpenAI/LLM Keys ---
        OPENAI_API_KEY=sk-...
        OPENAI_BASE_URL=https://openrouter.ai/api/v1
        MODEL_ID=mistralai/mistral-nemo:free
        EMBEDDING_MODEL=sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2

        # --- MongoDB Atlas ---
        MONGO_URI="mongodb+srv://<your_username>:<your_password>@your_cluster_url/?retryWrites=true&w=majority"
        MONGO_DB_NAME="voiceguard_db"

        # --- Cloudinary ---
        CLOUDINARY_URL="cloudinary://<your_api_key>:<your_api_secret>@<your_cloud_name>"

        # --- Server Port ---
        PORT=5000
        ```

6.  **Setup ChromaDB (for RAG in chatbot):**
    ```sh
    python setup/setup_chromadb.py
    ```

7.  **Run the Backend Server:**
    *   **Start the FastAPI server:**
        ```sh
        uvicorn main:app --host 0.0.0.0 --port 5000 --reload
        ```
        (This will run on `http://127.0.0.1:5000`. Remove `--reload` for production).

### Frontend Setup

1.  **Navigate to the frontend directory:**
    ```sh
    cd frontend
    ```

2.  **Install JavaScript dependencies:**
    ```sh
    # Using npm
    npm install
    # Or if you prefer bun (as indicated by bun.lockb)
    # bun install
    ```

3.  **Run the frontend development server:**
    ```sh
    npm run dev
    ```
    (This will typically open in your browser, e.g., `http://localhost:5173`).

## Development Conventions

*   **Python Backend:**
    *   Uses `requirements.txt` for dependency management.
    *   Environment variables are managed via `.env` files and `python-dotenv`.
    *   Logging is configured with `logging` module.
    *   `utils` directory for shared helper modules.
*   **Frontend (React/TypeScript):**
    *   React functional components with TypeScript for type safety.
    *   Vite for bundling and development server.
    *   Tailwind CSS for utility-first styling.
    *   `shadcn/ui` components for UI elements.
    *   Clerk for authentication integration.
    *   `eslint` for code linting.
