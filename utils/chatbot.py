import os
import time
import asyncio
from openai import OpenAI
from dotenv import load_dotenv
from collections import defaultdict, deque
import threading
from datetime import datetime, timedelta

load_dotenv()

# Initialize OpenAI client for OpenRouter
client = OpenAI(
    base_url=os.getenv("OPENAI_BASE_URL", "https://openrouter.ai/api/v1"),
    api_key=os.getenv("OPENAI_API_KEY"),
)
model_id = os.getenv("MODEL_ID")

# Session management
user_sessions = defaultdict(lambda: {
    'history': deque(maxlen=20),  # Keep last 20 messages
    'last_activity': datetime.now(),
    'language_preference': 'auto'
})

SESSION_TIMEOUT = timedelta(hours=2)

def cleanup_sessions():
    """Remove inactive sessions to save memory"""
    while True:
        current_time = datetime.now()
        inactive_sessions = [
            user_id for user_id, session in user_sessions.items()
            if current_time - session['last_activity'] > SESSION_TIMEOUT
        ]
        for user_id in inactive_sessions:
            del user_sessions[user_id]
        time.sleep(1800)  # Check every 30 minutes

# Start cleanup thread
cleanup_thread = threading.Thread(target=cleanup_sessions, daemon=True)
cleanup_thread.start()

# Language-specific system prompts
SYSTEM_PROMPTS = {
    'english': {
        'role': (
            "You are a Women Safety and Indian Laws Consultant. "
            "You specialize in guiding women on their legal rights, safety measures, "
            "and available support systems in India..."
        ),
        'rules': [
            "Always respond in English unless asked otherwise.",
            "Short replies for casual or general chats.",
            "Detailed replies only when explicitly asked.",
            "Provide emergency contacts in India: 112, 1091, 181.",
        ]
    },
    'hindi': {
        'role': (
            "आप एक महिला सुरक्षा और भारतीय कानूनों की सलाहकार हैं..."
        ),
        'rules': [
            "हमेशा हिंदी में जवाब दें जब तक अंग्रेज़ी न मांगे।",
            "सामान्य चैट के लिए छोटे उत्तर दें।",
            "आवश्यक होने पर आपातकालीन नंबर दें: 112, 1091, 181।",
        ]
    }
}

def detect_language(text: str) -> str:
    """Simple language detection based on script"""
    hindi_chars = sum(1 for char in text if '\u0900' <= char <= '\u097F')
    total_chars = len([char for char in text if char.isalpha()])
    if total_chars == 0:
        return 'english'
    hindi_ratio = hindi_chars / total_chars
    return 'hindi' if hindi_ratio > 0.3 else 'english'

def build_conversation_context(user_id, current_message, language):
    """Build conversation context with history"""
    session = user_sessions[user_id]
    system_prompt = SYSTEM_PROMPTS[language]
    
    messages = [
        {
            "role": "system", 
            "content": f"{system_prompt['role']}\n\nRules:\n" + "\n".join(f"- {rule}" for rule in system_prompt['rules'])
        }
    ]
    messages.extend(session['history'])
    messages.append({"role": "user", "content": current_message})
    return messages

def update_session_history(user_id, user_message, ai_response):
    """Update user session with new messages"""
    session = user_sessions[user_id]
    session['history'].append({"role": "user", "content": user_message})
    session['history'].append({"role": "assistant", "content": ai_response})
    session['last_activity'] = datetime.now()

# --- Main Chat Function ---
def chat(user_id: str, message: str, language: str = "auto") -> dict:
    """Get chatbot response for a message"""
    if not message:
        return {"error": "No message provided"}
    
    # --- Language Handling ---
    lang_map = {
        'en': 'english',
        'hi': 'hindi',
    }
    
    effective_language = lang_map.get(language, 'english')
    if language == 'auto':
        effective_language = detect_language(message)

    try:
        messages = build_conversation_context(user_id, message, effective_language)
        response = client.chat.completions.create(
            model=model_id,
            messages=messages,
            temperature=0.7,
            max_tokens=800,
            stream=False
        )
        ai_response = response.choices[0].message.content
        update_session_history(user_id, message, ai_response)
        return {
            "response": ai_response,
            "language": effective_language,
            "user_id": user_id,
            "session_length": len(user_sessions[user_id]['history'])
        }
    except Exception as e:
        return {"error": str(e)}

# --- Utility Functions ---
def get_history(user_id: str):
    if user_id not in user_sessions:
        return {"history": [], "message": "No history found"}
    session = user_sessions[user_id]
    return {
        "history": list(session['history']),
        "last_activity": session['last_activity'].isoformat(),
        "session_length": len(session['history'])
    }

def clear_history(user_id: str):
    if user_id in user_sessions:
        user_sessions[user_id]['history'].clear()
        return {"message": "History cleared successfully"}
    return {"message": "No history found for user"}

def get_sessions():
    sessions_info = {
        user_id: {
            "message_count": len(session['history']),
            "last_activity": session['last_activity'].isoformat(),
            "language_preference": session.get('language_preference', 'auto')
        }
        for user_id, session in user_sessions.items()
    }
    return {
        "active_sessions": len(user_sessions),
        "sessions": sessions_info
    }

def health_check():
    return {
        "status": "healthy",
        "active_sessions": len(user_sessions),
        "timestamp": datetime.now().isoformat(),
        "model": model_id
    }

# --- Example usage if run standalone ---
if __name__ == "__main__":
    print("🚀 Chatbot logic ready (no Flask)")
    res = chat("test_user", "Hi, I need help regarding domestic violence.")
    print(res)
