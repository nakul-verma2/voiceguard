<div align="center">
  <img src="https://user-images.githubusercontent.com/74038190/212284100-561aa493-3a90-436e-b215-362f3a1d6a27.gif" alt="VoiceGuard Banner" width="800"/>

  # 🛡️ VoiceGuard: AI-Powered Domestic Violence Detection

  **Hear the Silence. Break the Cycle.**

  [![Build Status](https://img.shields.io/badge/build-passing-brightgreen?style=for-the-badge&logo=githubactions)](https://github.com/nakul-verma2/voiceguard)
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

</div>

---

### 📖 Introduction

**VoiceGuard** is an AI-powered detection system designed to identify and intervene in instances of domestic violence. By analyzing real-time audio for patterns of distress, aggression, and violence, VoiceGuard provides a lifeline to victims, connecting them with immediate help from emergency services, trusted contacts, and support organizations. Our mission is to leverage technology to create a safer environment and break the cycle of abuse.

---

### ✨ Key Features

| Icon | Feature                  | Description                                                                                             |
| :--: | ------------------------ | ------------------------------------------------------------------------------------------------------- |
| 🎙️   | **Real-time Monitoring** | Continuously listens for audio cues in the background with a privacy-first approach.                    |
| 🧠   | **AI Threat Detection** | Utilizes advanced machine learning to detect distress patterns, threats, and indicators of violence.    |
| 🆘   | **Emergency SOS Alerts** | Instantly notifies trusted contacts and local authorities with location details during a crisis.        |
| 🗄️   | **Secure Evidence Locker**| Allows users to securely upload and store encrypted evidence like photos, screenshots, and documents.    |
| 🌐   | **Multilingual Support** | Offers support for multiple Indian languages, ensuring accessibility for a diverse user base.             |
| ⚖️   | **Legal Guidance** | Provides resources and information on legal rights and procedures for victims of domestic violence.     |
| 🤖   | **AI Support Chatbot** | An integrated chatbot, "Asha," offers guidance, support, and answers to user queries in real-time.      |

---

### 🎥 Watch the Demo

<p align="center">
  Click the thumbnail below to see a full walkthrough of VoiceGuard's features.
</p>

<p align="center">
  <a href="[https://youtu.be/dGfcnviHOPQ](https://youtu.be/fml2F7navW4)" title="Watch the Demo Video">
    <img src="https://github.com/nakul-verma2/voiceguard/blob/edc3e3a3e87be0db4f1669598d7a43611ac05bd9/screenshots/Thumbnail.png" alt="VoiceGuard Demo" width="70%">
  </a>
</p>

---

### 📸 Screenshots & Demo

Here's a look at the VoiceGuard application in action.

<p align="center">
  <img src="https://github.com/nakul-verma2/voiceguard/blob/edc3e3a3e87be0db4f1669598d7a43611ac05bd9/screenshots/Screenshot%202025-08-27%20184642.png" width="80%"/>
</p>
<br>

<p align="center">
  <img src="https://github.com/nakul-verma2/voiceguard/blob/edc3e3a3e87be0db4f1669598d7a43611ac05bd9/screenshots/Screenshot%202025-08-27%20184731.png" alt="Disguised Interface" width="80%"/>
</p>
<br>

<p align="center">
  <img src="https://github.com/nakul-verma2/voiceguard/blob/edc3e3a3e87be0db4f1669598d7a43611ac05bd9/screenshots/Screenshot%202025-08-27%20190609.png" alt="MultiLingual Support" width="80%"/>
</p>
<br>

---

### ⚙️ How It Works

1.  **Audio Capture**: The system monitors background audio in real-time, using Voice Activity Detection (VAD) to identify human speech.
2.  **AI Analysis**: Machine learning models analyze the captured audio for emotional distress, aggressive tones, and specific keywords related to violence.
3.  **Threat Assessment**: Based on the analysis, the system assesses the threat level (Low, Medium, High).
4.  **Smart Response**:
    * **High Threat**: Automatically sends SOS alerts to pre-defined emergency contacts.
    * **Medium/Low Threat**: Provides resources and guidance through the UI.
5.  **Evidence Collection**: Incidents are recorded and can be securely stored in the user's evidence locker.

---

### 🛠️ Technology Stack

#### Backend
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![OpenAI](https://img.shields.io/badge/OpenAI-412991?style=for-the-badge&logo=openai&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white)

#### Frontend
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Clerk](https://img.shields.io/badge/Clerk-6C47FF?style=for-the-badge&logo=clerk&logoColor=white)

---

### 🚀 Getting Started

To get a local copy up and running, follow these steps.

#### 1. Prerequisites

*   Python 3.8+
*   `pip` package manager
*   Node.js and `npm`
*   A [Google Cloud](https://cloud.google.com/) account with an active project.
*   A [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) account.
*   A [Cloudinary](https://cloudinary.com/) account.
*   A [Clerk](https://clerk.com/) account.

#### 2. Backend Setup

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

4.  **Environment Variables:**
    *   Create a `.env` file in the root directory.
    *   Add the necessary environment variables for MongoDB, Cloudinary, OpenAI, and Clerk.

5.  **Run the Backend Server:**
    ```sh
    uvicorn main:app --host 0.0.0.0 --port 5000 --reload
    ```

#### 3. Frontend Setup

1.  **Navigate to the frontend directory:**
    ```sh
    cd frontend
    ```

2.  **Install JavaScript dependencies:**
    ```sh
    npm install
    ```

3.  **Run the frontend development server:**
    ```sh
    npm run dev
    ```

4.  Open your web browser and navigate to the URL provided by the development server (usually `http://localhost:5173`).

---

### 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

---

### 📜 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<div align="center">
  Made with ❤️ by BlackOps
</div>
