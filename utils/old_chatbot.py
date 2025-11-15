import os
import time
import asyncio
import logging
from openai import OpenAI, APIError, RateLimitError
from dotenv import load_dotenv
from collections import defaultdict, deque
import threading
from datetime import datetime, timedelta

# --- Load Environment Variables ---
load_dotenv()

# --- Setup Logging ---
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class Chatbot:
    """
    A comprehensive chatbot class that handles session management,
    language detection, conversation history, and interaction with the OpenAI API.
    """

    def __init__(self):
        # --- Configuration ---
        self.openai_base_url = os.getenv("OPENAI_BASE_URL", "https://openrouter.ai/api/v1")
        self.openai_api_key = os.getenv("OPENAI_API_KEY")
        self.model_id = os.getenv("MODEL_ID", "mistralai/mistral-7b-instruct:free")
        self.session_timeout_hours = int(os.getenv("SESSION_TIMEOUT_HOURS", 2))
        self.max_history_length = int(os.getenv("MAX_HISTORY_LENGTH", 20))

        # --- OpenAI Client ---
        if not self.openai_api_key:
            raise ValueError("OPENAI_API_KEY environment variable not set.")
        self.client = OpenAI(base_url=self.openai_base_url, api_key=self.openai_api_key)

        # --- Session Management ---
        self.user_sessions = defaultdict(self._create_new_session)
        self.session_timeout = timedelta(hours=self.session_timeout_hours)
        self._start_cleanup_thread()

        # --- System Prompts ---
        self.system_prompts = {
            'english': {
                'role': (
                    "You are 'Saheli', an AI-powered Women's Safety and Legal Rights Information Assistant for India. "
                    "Your persona is that of a calm, empathetic, and knowledgeable guide. "
                    "Your primary objective is to empower users by providing clear, accurate information about their legal rights, "
                    "available safety measures, and support systems in India related to domestic violence, harassment, and other related issues."
                ),
                'rules': [
                    # --- Core Directives ---
                    "Your tone must always be supportive, non-judgmental, and professional.",
                    "Prioritize user safety and well-being in every response.",
                    "When the user's query implies immediate danger, your first priority is to provide Indian emergency contact numbers (112, 1091, 181) and urge them to contact these services.",
                    
                    # --- Important Constraints (Guardrails) ---
                    "CRITICAL: You are an information assistant, NOT a lawyer or a medical professional. You MUST NOT give legal or medical advice. Always include a disclaimer like, 'This is for informational purposes only. Please consult a qualified lawyer for legal advice.' when providing legal information.",
                    "Do not make promises or guarantees of safety or legal outcomes.",
                    "Keep responses concise and easy to understand. Avoid overly technical legal jargon.",

                    # --- Language & Formatting ---
                    "Respond exclusively in English unless the user explicitly asks for another language.",
                    "Use formatting like bullet points or numbered lists to make complex information easier to digest."
                ]
            },
            'hindi': {
                'role': (
                    "आप 'सहेली' हैं, भारत के लिए एक AI-संचालित महिला सुरक्षा और कानूनी अधिकार सूचना सहायक। "
                    "आपका व्यक्तित्व एक शांत, सहानुभूतिपूर्ण और जानकार मार्गदर्शक का है। "
                    "आपका मुख्य उद्देश्य उपयोगकर्ताओं को घरेलू हिंसा, उत्पीड़न और अन्य संबंधित मुद्दों पर उनके कानूनी अधिकारों, "
                    "सुरक्षा उपायों और भारत में उपलब्ध सहायता प्रणालियों के बारे में स्पष्ट और सटीक जानकारी प्रदान करके सशक्त बनाना है।"
                ),
                'rules': [
                    # --- मुख्य निर्देश ---
                    "आपका लहजा हमेशा सहायक, गैर-निर्णयात्मक और पेशेवर होना चाहिए।",
                    "हर प्रतिक्रिया में उपयोगकर्ता की सुरक्षा और कल्याण को प्राथमिकता दें।",
                    "जब उपयोगकर्ता का प्रश्न तत्काल खतरे का संकेत देता है, तो आपकी पहली प्राथमिकता भारतीय आपातकालीन संपर्क नंबर (112, 1091, 181) प्रदान करना और उन्हें इन सेवाओं से संपर्क करने का आग्रह करना है।",

                    # --- महत्वपूर्ण सीमाएं (गार्डrails) ---
                    "अति महत्वपूर्ण: आप एक सूचना सहायक हैं, वकील या चिकित्सा पेशेवर नहीं। आपको कानूनी या चिकित्सीय सलाह नहीं देनी चाहिए। कानूनी जानकारी प्रदान करते समय हमेशा एक डिस्क्लेमर शामिल करें, जैसे, 'यह केवल सूचना के उद्देश्यों के लिए है। कृपया कानूनी सलाह के लिए एक योग्य वकील से परामर्श करें।'",
                    "सुरक्षा या कानूनी परिणामों की कोई गारंटी या वादा न करें।",
                    "जवाबों को संक्षिप्त और समझने में आसान रखें। अत्यधिक तकनीकी कानूनी शब्दावली से बचें।",

                    # --- भाषा और स्वरूपण ---
                    "केवल हिंदी में जवाब दें। अंग्रेजी या किसी अन्य भाषा का प्रयोग बिल्कुल न करें।",
                    "जटिल जानकारी को आसान बनाने के लिए बुलेट पॉइंट या नंबर वाली सूचियों जैसे स्वरूपण का उपयोग करें।"
                ]
            }
        }

    def _create_new_session(self):
        """Creates a new user session."""
        return {
            'history': deque(maxlen=self.max_history_length),
            'last_activity': datetime.now(),
            'language_preference': 'auto'
        }

    def _start_cleanup_thread(self):
        """Starts a background thread to clean up inactive sessions."""
        cleanup_thread = threading.Thread(target=self._cleanup_sessions, daemon=True)
        cleanup_thread.start()
        logger.info("Session cleanup thread started.")

    def _cleanup_sessions(self):
        """Periodically removes inactive sessions to save memory."""
        while True:
            current_time = datetime.now()
            inactive_sessions = [
                user_id for user_id, session in self.user_sessions.items()
                if current_time - session['last_activity'] > self.session_timeout
            ]
            for user_id in inactive_sessions:
                del self.user_sessions[user_id]
                logger.info(f"Cleaned up inactive session for user: {user_id}")
            time.sleep(1800)  # Check every 30 minutes

    def _detect_language(self, text: str) -> str:
        """Simple language detection based on character script."""
        if not text or not isinstance(text, str):
            return 'english'
        hindi_chars = sum(1 for char in text if '\u0900' <= char <= '\u097F')
        total_chars = len([char for char in text if char.isalpha()])
        if total_chars == 0:
            return 'english'
        hindi_ratio = hindi_chars / total_chars
        return 'hindi' if hindi_ratio > 0.3 else 'english'

    def _build_conversation_context(self, user_id, current_message, language):
        """Builds the conversation context with history and system prompts."""
        session = self.user_sessions[user_id]
        system_prompt = self.system_prompts[language]
        
        messages = [
            {
                "role": "system", 
                "content": f"{system_prompt['role']}\n\nRules:\n" + "\n".join(f"- {rule}" for rule in system_prompt['rules']) 
            }
        ]
        messages.extend(session['history'])
        messages.append({"role": "user", "content": current_message})
        return messages

    def _update_session_history(self, user_id, user_message, ai_response):
        """Updates the user's session with the new messages."""
        session = self.user_sessions[user_id]
        session['history'].append({"role": "user", "content": user_message})
        session['history'].append({"role": "assistant", "content": ai_response})
        session['last_activity'] = datetime.now()

    async def chat(self, user_id: str, message: str, language: str = "auto") -> dict:
        """
        Asynchronously gets a chatbot response for a message.
        Handles user commands, language detection, and API errors.
        """
        if not message:
            return {"error": "No message provided"}

        # --- Command Handling ---
        if message.strip().lower() == '/clear':
            return self.clear_history(user_id)

        # --- Language Handling ---
        lang_map = {'en': 'english', 'hi': 'hindi'}
        effective_language = lang_map.get(language, 'english')
        if language == 'auto':
            effective_language = self._detect_language(message)

        try:
            messages = self._build_conversation_context(user_id, message, effective_language)
            
            logger.info(f"Requesting chat completion for user {user_id} with model {self.model_id}")
            
            response = await asyncio.to_thread(
                self.client.chat.completions.create,
                model=self.model_id,
                messages=messages,
                temperature=0.7,
                max_tokens=800,
                stream=False
            )
            
            ai_response = response.choices[0].message.content
            self._update_session_history(user_id, message, ai_response)
            
            logger.info(f"Successfully received response for user {user_id}")
            
            return {
                "response": ai_response,
                "language": effective_language,
                "user_id": user_id,
                "session_length": len(self.user_sessions[user_id]['history'])
            }
        except RateLimitError as e:
            logger.info(f"Rate limit exceeded for user {user_id}: {e}")
            return {"error": "The service is currently busy. Please try again later."}
        except APIError as e:
            logger.info(f"OpenAI API error for user {user_id}: {e}")
            return {"error": f"An API error occurred: {e}"}
        except Exception as e:
            logger.info(f"An unexpected error occurred for user {user_id}: {e}")
            return {"error": "An unexpected error occurred. Please try again."}

    # --- Utility Functions ---
    def get_history(self, user_id: str) -> dict:
        """Retrieves the conversation history for a user."""
        if user_id not in self.user_sessions:
            return {"history": [], "message": "No history found"}
        session = self.user_sessions[user_id]
        return {
            "history": list(session['history']),
            "last_activity": session['last_activity'].isoformat(),
            "session_length": len(session['history'])
        }

    def clear_history(self, user_id: str) -> dict:
        """Clears the conversation history for a user."""
        if user_id in self.user_sessions:
            self.user_sessions[user_id]['history'].clear()
            logger.info(f"History cleared for user: {user_id}")
            return {"message": "History cleared successfully"}
        return {"message": "No history found for user"}

    def get_sessions(self) -> dict:
        """Returns information about all active sessions."""
        sessions_info = {
            user_id: {
                "message_count": len(session['history']),
                "last_activity": session['last_activity'].isoformat(),
                "language_preference": session.get('language_preference', 'auto')
            }
            for user_id, session in self.user_sessions.items()
        }
        return {
            "active_sessions": len(self.user_sessions),
            "sessions": sessions_info
        }

    def health_check(self) -> dict:
        """Provides a health check of the chatbot service."""
        return {
            "status": "healthy",
            "active_sessions": len(self.user_sessions),
            "timestamp": datetime.now().isoformat(),
            "model": self.model_id
        }

# --- Singleton Instance ---
# This makes it easy to import and use the same chatbot instance across the application.
chatbot_instance = Chatbot()

# --- Example usage if run standalone ---
async def main():
    print("🚀 Chatbot logic ready (no Flask)")
    
    # --- English Example ---
    print("\n--- English Chat ---")
    response_en = await chatbot_instance.chat("test_user_en", "Hi, I need help regarding domestic violence.")
    print(response_en)

    # --- Hindi Example ---
    print("\n--- Hindi Chat ---")
    response_hi = await chatbot_instance.chat("test_user_hi", "नमस्ते, मुझे घरेलू हिंसा के बारे में मदद चाहिए।")
    print(response_hi)
    
    # --- Get History ---
    print("\n--- Get History ---")
    history = chatbot_instance.get_history("test_user_en")
    print(history)

    # --- Clear History ---
    print("\n--- Clear History ---")
    clear_status = chatbot_instance.clear_history("test_user_en")
    print(clear_status)
    history_after_clear = chatbot_instance.get_history("test_user_en")
    print(history_after_clear)

if __name__ == "__main__":
    asyncio.run(main())
