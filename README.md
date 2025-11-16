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
  <a href="https://youtu.be/dGfcnviHOPQ" title="Watch the Demo Video">
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
![Flask](https://img.shields.io/badge/Flask-000000?style=for-the-badge&logo=flask&logoColor=white)
![OpenAI](https://img.shields.io/badge/OpenAI-412991?style=for-the-badge&logo=openai&logoColor=white)
![NumPy](https://img.shields.io/badge/NumPy-013243?style=for-the-badge&logo=numpy&logoColor=white)

#### Frontend
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Bootstrap](https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white)

---

### 🚀 Getting Started

To get a local copy up and running, follow these steps.

#### 1. Prerequisites

*   Python 3.8+
*   `pip` package manager
*   A [Google Cloud](https://cloud.google.com/) account with an active project.
*   A [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) account.

#### 2. Initial Setup

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

#### 3. Cloud Services Setup

**A. MongoDB Atlas (Database)**

1.  **Create a Free Cluster:**
    *   Log in to your MongoDB Atlas account.
    *   Create a new project and then build a new database.
    *   Choose the **M0 (Free)** shared cluster. Select a region and give your cluster a name.

2.  **Create a Database User:**
    *   Under "Database Access," create a new database user. Use a secure password and save it.

3.  **Whitelist IP Address:**
    *   Under "Network Access," add your current IP address to the IP access list. For development, the "Allow Access from Anywhere" (`0.0.0.0/0`) option is easiest.

4.  **Get Connection String:**
    *   Go to your database dashboard and click "Connect."
    *   Choose "Drivers" and select "Python."
    *   Copy the **connection string (URI)**.

**B. Cloudinary (File Storage)**

1.  **Create a Free Account:**
    *   Go to the Cloudinary website and sign up for a free account. You should not need to enter any payment information.

2.  **Find Your Credentials:**
    *   After signing up, you will be taken to your account's Dashboard.
    *   At the top, you will see your **Cloud Name**, **API Key**, and **API Secret**.
    *   Even easier, Cloudinary provides a single string that contains all of this. Look for the **"API Environment variable"** field. It will look like `cloudinary://<api_key>:<api_secret>@<cloud_name>`.
    *   **Copy this entire string.**

#### 4. Environment Variables

1.  Create a `.env` file in the root directory of the project.
2.  Add the following variables to your `.env` file, pasting in the values you copied from MongoDB Atlas and Cloudinary:

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

    # --- Server ---
    PORT=5000
    ```

#### 5. Running the Application

1.  **Set up the ChromaDB database (for RAG):**
    ```sh
    python setup/setup_chromadb.py
    ```

2.  **Start the Flask server:**
    ```sh
    python app.py
    ```

3.  Open your web browser and navigate to `http://127.0.0.1:5000`.

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
