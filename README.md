<div align="center">
<img src="https://user-images.githubusercontent.com/74038190/212284100-561aa493-3a90-436e-b215-362f3a1d6a27.gif" alt="VoiceGuard Banner" width="800"/>

# 🛡️ VoiceGuard: AI-Powered Domestic Violence Detection

### *Hear the Silence. Break the Cycle.*

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python](https://img.shields.io/badge/Python-3.8+-blue.svg)](https://www.python.org/)
[![React](https://img.shields.io/badge/React-18+-61DAFB.svg)](https://reactjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.68+-009688.svg)](https://fastapi.tiangolo.com/)

</div>

---

## 📖 Introduction

**VoiceGuard** is an AI-powered detection system designed to identify and intervene in instances of domestic violence. By analyzing real-time audio for patterns of distress, aggression, and violence, VoiceGuard provides a lifeline to victims, connecting them with immediate help from emergency services, trusted contacts, and support organizations. 

> **Our mission:** Leverage technology to create a safer environment and break the cycle of abuse.

---

## 🏗️ System Architecture

VoiceGuard operates on a **three-pillar system**: 

- **Prevention** (Passive Audio Monitoring)
- **Protection** (Active SOS & Evidence Recording)
- **Empowerment** (Legal Intelligence)

<p align="center">
<img src="screenshots/Architecture.jpeg" alt="VoiceGuard System Architecture Diagram" width="90%"/>
</p>

---

## ✨ Key Features

| Icon | Feature | Description |
|:----:|:--------|:------------|
| 🎙️ | **Real-time Monitoring** | Continuously listens for audio cues in the background with a privacy-first approach |
| 🧠 | **AI Threat Detection** | Utilizes advanced machine learning to detect distress patterns, threats, and indicators of violence |
| 🤖 | **RAG-Powered Legal AI** | **NEW:** "Asha" chatbot uses Vector Search (ChromaDB) to retrieve accurate Indian legal context (IPC 498A, DV Act) before answering |
| 🆘 | **Emergency SOS Alerts** | Instantly notifies trusted contacts and local authorities with location details during a crisis |
| 🗄️ | **Secure Evidence Locker** | Automatically records and uploads encrypted audio evidence to Cloudinary for legal admissibility |
| 📝 | **Auto-Drafting** | **NEW:** Instantly generates legally valid drafts for FIRs and Protection Orders based on user input |
| 🌐 | **Multilingual Support** | Offers support for multiple Indian languages (English, Hindi, Bengali, Tamil, Telugu, Marathi) |
| 🕶️ | **Stealth Mode** | Features a "Quick Exit" button and can disguise itself as a calculator or weather app |

---

## 🎥 Watch the Demo

<p align="center">
<strong>Click the thumbnail below to see a full walkthrough of VoiceGuard's features</strong>
</p>

<p align="center">
<a href="https://youtu.be/fml2F7navW4" title="Watch the Demo Video">
<img src="https://github.com/nakul-verma2/voiceguard/blob/edc3e3a3e87be0db4f1669598d7a43611ac05bd9/screenshots/Thumbnail.png" alt="VoiceGuard Demo" width="70%">
</a>
</p>

---

## 📸 Screenshots

<details>
<summary><strong>Click to view screenshots</strong></summary>

### Main Dashboard
<p align="center">
<img src="https://github.com/nakul-verma2/voiceguard/blob/edc3e3a3e87be0db4f1669598d7a43611ac05bd9/screenshots/Screenshot%202025-08-27%20184642.png" width="80%"/>
</p>

### Disguised Interface
<p align="center">
<img src="https://github.com/nakul-verma2/voiceguard/blob/edc3e3a3e87be0db4f1669598d7a43611ac05bd9/screenshots/Screenshot%202025-08-27%20184731.png" alt="Disguised Interface" width="80%"/>
</p>

### Multilingual Support
<p align="center">
<img src="https://github.com/nakul-verma2/voiceguard/blob/edc3e3a3e87be0db4f1669598d7a43611ac05bd9/screenshots/Screenshot%202025-08-27%20190609.png" alt="MultiLingual Support" width="80%"/>
</p>

</details>

---

## ⚙️ How It Works

### 1. 🛡️ Silent Guardian (Audio Pipeline)

```mermaid
graph LR
    A[Capture Audio] --> B[Filter Silence]
    B --> C[Transcribe Speech]
    C --> D[Analyze Threat]
    D --> E{Score > 0.7?}
    E -->|Yes| F[Trigger SOS]
    E -->|No| A
```

- **Capture:** Python backend captures audio via PyAudio
- **Filter:** WebRTC VAD filters out silence to save resources
- **Transcribe:** OpenAI Whisper converts speech to text
- **Analyze:** NLP algorithms scan for distress keywords and calculate a Threat Score

### 2. 🚨 Emergency Response

- **Trigger:** If Score > 0.7, the SOS protocol initiates
- **Notify:** Backend fetches trusted contacts from MongoDB and sends SMS alerts
- **Preserve:** Audio buffer is saved and uploaded to Cloudinary

### 3. ⚖️ Legal Empowerment (RAG Engine)

- **Query:** User asks a legal question (e.g., "How do I file a case?")
- **Search:** System vectorizes the query and searches ChromaDB for relevant legal acts
- **Generate:** Llama 3.3 (via OpenRouter) synthesizes the legal context into an empathetic, accurate answer

---

## 🛠️ Technology Stack

<table>
<tr>
<td valign="top" width="33%">

### Backend & AI
- ![Python](https://img.shields.io/badge/-Python-3776AB?logo=python&logoColor=white) Python
- ![FastAPI](https://img.shields.io/badge/-FastAPI-009688?logo=fastapi&logoColor=white) FastAPI
- ![OpenAI](https://img.shields.io/badge/-OpenAI-412991?logo=openai&logoColor=white) Whisper
- ![LLaMA](https://img.shields.io/badge/-LLaMA-0467DF?logo=meta&logoColor=white) Llama 3.3
- ChromaDB (Vector DB)
- WebRTC VAD

</td>
<td valign="top" width="33%">

### Data & Storage
- ![MongoDB](https://img.shields.io/badge/-MongoDB-47A248?logo=mongodb&logoColor=white) MongoDB
- ![Cloudinary](https://img.shields.io/badge/-Cloudinary-3448C5?logo=cloudinary&logoColor=white) Cloudinary
- Clerk Auth

</td>
<td valign="top" width="33%">

### Frontend
- ![React](https://img.shields.io/badge/-React-61DAFB?logo=react&logoColor=black) React
- ![Vite](https://img.shields.io/badge/-Vite-646CFF?logo=vite&logoColor=white) Vite
- ![TailwindCSS](https://img.shields.io/badge/-Tailwind-38B2AC?logo=tailwind-css&logoColor=white) Tailwind CSS
- Recharts

</td>
</tr>
</table>

---

## 🚀 Getting Started

### 📋 Prerequisites

- Python 3.8+
- Node.js and npm
- MongoDB Atlas, Cloudinary, and Clerk accounts
- OpenRouter API Key (for Llama 3.3)

### 🔧 Backend Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/nakul-verma2/voiceguard.git
   cd voiceguard/backend
   ```

2. **Create and activate virtual environment**
   ```bash
   python -m venv venv
   
   # Windows
   .\venv\Scripts\activate
   
   # Mac/Linux
   source venv/bin/activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Environment Variables**
   
   Create a `.env` file in the backend directory:
   ```env
   OPENAI_API_KEY=your_key_here
   MONGO_URI=your_mongodb_uri
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   CLERK_SECRET_KEY=your_clerk_key
   ```

5. **Run the Server**
   ```bash
   uvicorn main:app --host 0.0.0.0 --port 5000 --reload
   ```

### 💻 Frontend Setup

1. **Navigate to frontend**
   ```bash
   cd ../frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run development server**
   ```bash
   npm run dev
   ```

4. Open `http://localhost:5173` in your browser

---

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📜 License

Distributed under the **MIT License**. See `LICENSE` for more information.

---

## 👥 Team

<div align="center">

### Made with ❤️ by **BlackOps**

[⭐ Star this repo](https://github.com/nakul-verma2/voiceguard) | [🐛 Report Bug](https://github.com/nakul-verma2/voiceguard/issues) | [💡 Request Feature](https://github.com/nakul-verma2/voiceguard/issues)

</div>

---

<div align="center">
<sub>VoiceGuard - Empowering victims, preventing violence, saving lives.</sub>
</div>
