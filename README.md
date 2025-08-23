<div align="center">
  <img src="https://user-images.githubusercontent.com/74038190/212284100-561aa493-3a90-436e-b215-362f3a1d6a27.gif" alt="VoiceGuard Banner" width="800"/>

  # 🛡️ VoiceGuard: AI-Powered Domestic Violence Detection

  **Hear the Silence. Break the Cycle.**

  [![Build Status](https://img.shields.io/badge/build-passing-brightgreen?style=for-the-badge&logo=githubactions)](https://github.com/nakul-verma2/voiceguard)
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
  [![GitHub stars](https://img.shields.io/github/stars/nakul-verma2/voiceguard?style=for-the-badge&logo=github)](https://github.com/nakul-verma2/voiceguard/stargazers)
  [![GitHub forks](https://img.shields.io/github/forks/nakul-verma2/voiceguard?style=for-the-badge&logo=github)](https://github.com/nakul-verma2/voiceguard/network)

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

To get a local copy up and running, follow these simple steps.

#### Prerequisites

* Python 3.8+
* `pip` package manager

#### Installation

1.  **Clone the repository:**
    ```sh
    git clone [https://github.com/nakul-verma2/voiceguard.git](https://github.com/nakul-verma2/voiceguard.git)
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
    OPENAI_BASE_URL="[https://openrouter.ai/api/v1](https://openrouter.ai/api/v1)"
    OPENAI_API_KEY="YOUR_OPENROUTER_API_KEY"
    MODEL_ID="anthropic/claude-3-haiku"
    ```

#### Running the Application

1.  **Start the Flask server:**
    ```sh
    python app.py
    ```

2.  Open your web browser and navigate to `http://127.0.0.1:5000`.

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
