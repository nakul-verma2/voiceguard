# Project: VoiceGuard

## Project Overview

**VoiceGuard** is a full-stack application designed as an AI-powered domestic violence detection system. The project's mission is to provide a lifeline to victims by analyzing real-time audio for patterns of distress and connecting them with help.

The application consists of a Python backend and a React frontend.

*   **Backend:** The backend is built with **Python** and **Flask**. It uses **OpenAI** for AI-powered features, **ChromaDB** for Retrieval-Augmented Generation (RAG), and **MongoDB** as its primary database. It also utilizes libraries like **NumPy** for numerical operations and **webrtcvad** for voice activity detection.

*   **Frontend:** The frontend is a modern web application built with **React**, **TypeScript**, and **Vite**. It uses **Tailwind CSS** for styling and various libraries for UI components, including **Shadcn UI**.

## Building and Running

### Backend

1.  **Prerequisites:**
    *   Python 3.8+
    *   `pip` package manager
    *   MongoDB Atlas account
    *   Cloudinary account

2.  **Setup:**
    *   Create and activate a virtual environment:
        ```bash
        # For Windows
        python -m venv venv
        .\venv\Scripts\activate

        # For macOS/Linux
        python3 -m venv venv
        source venv/bin/activate
        ```
    *   Install dependencies:
        ```bash
        pip install -r requirements.txt
        ```
    *   Create a `.env` file in the root directory and add the necessary environment variables (see `README.md` for details).

3.  **Running:**
    *   Set up the ChromaDB database:
        ```bash
        python setup/setup_chromadb.py
        ```
    *   Start the Flask server:
        ```bash
        python app.py
        ```

### Frontend

1.  **Prerequisites:**
    *   Node.js and npm (or Bun)

2.  **Setup:**
    *   Navigate to the `frontend` directory:
        ```bash
        cd frontend
        ```
    *   Install dependencies:
        ```bash
        npm install
        ```

3.  **Running:**
    *   Start the development server:
        ```bash
        npm run dev
        ```

## Development Conventions

*   **Backend:**
    *   The backend follows a standard Flask project structure.
    *   Dependencies are managed with `pip` and `requirements.txt`.
    *   Environment variables are used for configuration.

*   **Frontend:**
    *   The frontend uses **Vite** for its build tooling.
    *   The code is written in **TypeScript** and uses **React**.
    *   Styling is done with **Tailwind CSS**.
    *   The project uses **ESLint** for linting.
    *   Components are organized in the `src/components` directory.
