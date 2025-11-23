# utils/chatbot.py

import chromadb
import requests
import os
import logging
import time
from typing import Dict, List, Optional
from datetime import datetime

# --- Local Imports ---
from utils.database import get_chat_history, save_chat_message, clear_user_history as db_clear_history

# --- Configure Logging ---
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class WomenSafetyChatbot:
    """Women Safety Legal Chatbot with RAG, persistent backend, and search optimization."""

    def __init__(self, api_key: str, chroma_path: str = "./chroma_db"):
        """
        Initialize the chatbot with multi-model fallback and comprehensive keywords.
        """
        try:
            self.api_key = api_key
            self.chroma_path = chroma_path
            
            # Primary and Fallback Models (To prevent 429 Errors)
            self.primary_model = os.getenv("MODEL_ID", "meta-llama/llama-3.3-70b-instruct:free")
            self.fallback_models = [
                self.primary_model,
                "google/gemini-2.0-flash-lite-preview-02-05:free",
                "meta-llama/llama-3-8b-instruct:free",
                "mistralai/mistral-7b-instruct:free"
            ]

            # Initialize ChromaDB for RAG
            self.client = chromadb.PersistentClient(path=chroma_path)
            self.collection = self.client.get_collection("women_safety_laws")

            # 🌟 COMPREHENSIVE KEYWORD LIST (English + Hindi + Hinglish)
            # These triggers determine if we should search the legal database.
            self.safety_keywords = set([
                # --- English: Legal & Official ---
                "law", "legal", "police", "attack", "fir", "complaint", "court", "judge", "magistrate",
                "lawyer", "advocate", "rights", "ipc", "crpc", "section", "act", "warrant",
                "bail", "arrest", "custody", "divorce", "alimony", "maintenance", "dowry",
                "protection", "order", "dir", "shelter", "ngo", "commission", "ncw",
                
                # --- English: Abuse & Violence ---
                "abuse", "violence", "domestic", "hit", "beat", "slap", "kick", "punch",
                "push", "shove", "choke", "strangle", "burn", "acid", "weapon", "knife",
                "injury", "blood", "bruise", "hurt", "pain", "kill", "murder", "death",
                "torture", "cruelty", "harass", "harassment", "threat", "threatening",
                
                # --- English: Sexual & Cyber ---
                "rape", "assault", "molest", "molestation", "touch", "grope", "force",
                "sexual", "stalk", "stalking", "follow", "watch", "cyber", "online",
                "photo", "video", "leak", "blackmail", "nude", "porn", "sextortion",
                "trafficking", "bulling", "troll",
                
                # --- Hindi/Hinglish: Physical/Action ---
                "maar", "maarta", "peet", "pitai", "thappad", "danda", "laat", "ghusa",
                "chot", "khoon", "jalaya", "jala", "acid", "chaaku", "jaan", "marunga",
                "dabao", "zabardasti", "pakda", "khencha", "dhakka",
                
                # --- Hindi/Hinglish: Legal/Official ---
                "thana", "police", "daroga", "inspector", "report", "shikayat", "case",
                "kachehri", "kachahri", "adalat", "kanoon", "vakeel", "vakil", "insaaf",
                "nyay", "jail", "qaidi", "zamanat", "kagaz", "dahej",
                
                # --- Hindi/Hinglish: Abuse/Harassment ---
                "gali", "gaali", "galoch", "badtameezi", "pareshan", "tana", "taana",
                "dhamki", "dara", "dar", "khauf", "bhay", "sharam", "izzat",
                "chhed", "chhedkhani", "ashleel", "ganda", "message", "call",
                "balatkar", "rapist", "jism", "jismani", "atyaachaar", "atyachar",
                
                # --- Relationship Context ---
                "husband", "pati", "wife", "patni", "in-laws", "sasural", "saas", "sasur",
                "devar", "nanad", "family", "gharwale", "boyfriend", "lover", "partner",
                "live-in", "ex", "breakup", "marriage", "shaadi", "relationship",

                # --- 🌟 Proper Hindi (Devanagari) Keywords 🌟 ---
                
                # Abuse/Violence (Expanded)
                "मारपीट", "हिंसा", "दहेज", "प्रताड़ना", "गाली", "धमकी", "बलात्कार", "रेप",
                "छेड़छाड़", "तेजाब", "हमला", "चोट", "हत्या", "खून", "जबरदस्ती", "शारीरिक",
                "मानसिक", "यौन", "शोषण", "तलाक", "गुस्सा", "डर", "पीछा", "परेशान",
                "गला घोंटना", "जलाना", "पीटना", "नोचना", "धक्का", "जख्म", "वार", "अभद्र",
                "अश्लील", "ब्लैकमेल", "तस्करी", "बंधक", "किडनैप", "अपहरण",

                # Legal/Police/Rights (Expanded)
                "पुलिस", "थाना", "कोर्ट", "कचहरी", "वकील", "जज", "कानून", "अधिकार", "शिकायत",
                "एफआईआर", "रिपोर्ट", "गिरफ्तार", "जमानत", "सजा", "इंसाफ", "न्याय", "केस",
                "महिला आयोग", "धारा", "अधिनियम", "हक", "बयान", "जांच", "गवाह", "सबूत",
                "हिरासत", "वारंट", "भरण-पोषण", "गुजारा भत्ता", "संरक्षण", "आश्रय", "मदद",
                "सहायता", "मुकदमा", "तारीख", "फैसला",

                # Relationship/Family/Context (Expanded)
                "पति", "पत्नी", "ससुराल", "सास", "ससुर", "दहेज़", "शादी", "विवाह", "रिश्ता",
                "तलाक", "अकेली", "बेटी", "बहन", "जेठ", "देवर", "ननद", "मायके", "दूसरी औरत",
                "चक्कर", "शक", "नशा", "शराब", "जबरन", "बाल विवाह", "गर्भवती", "सौतन",

                # Emergency/Emotional State
                "बचाओ", "आत्महत्या", "मरना", "फंसी", "मजबूर", "रो रही", "घबराहट"
            ])

            logger.info("✅ Chatbot initialized successfully with comprehensive keywords (English, Hindi, Hinglish).")
        except Exception as e:
            logger.error(f"❌ Failed to initialize chatbot: {str(e)}")
            # Do not raise, allow running without RAG if DB fails
            # raise

    def search_laws(self, query: str, n_results: int = 3) -> List[str]:
        """Search ChromaDB for relevant law sections."""
        try:
            results = self.collection.query(query_texts=[query], n_results=n_results)
            documents = results.get('documents', [[]])[0]
            return documents if documents else ["No specific legal context found."]
        except Exception as e:
            logger.error(f"❌ Error searching laws: {str(e)}")
            return ["Unable to retrieve legal context."]

    def build_system_prompt(self) -> str:
        """Build the system prompt for the LLM."""
        return """You are a women's safety assistant for India. Your specialty is women's safety, rights, and Indian law.
        
        LANGUAGE: Always respond in the same language as the user (English/Hindi/Hinglish).
        
        RESPONSE STYLE:
        1. LEGAL & DETAILED: Use if the user asks about laws, IPC sections, legal procedures, FIRs, courts, or rights. Be formal, step-by-step, and mention specific laws (IPC/CrPC/DV Act).
        2. SHORT & EMPATHETIC: Use if the user mentions abuse, fear, or distress. Be supportive first, then provide safety steps.
        3. CONVERSATIONAL: Use for greetings ("Hi", "Hello", "Namaste", "नमस्ते"). Keep it brief.
        
        EMERGENCY: If the user indicates immediate physical danger (e.g., "he is beating me now", "mujhe bachao", "बचाओ"), urge them to call Police (112) or Women's Helpline (181) IMMEDIATELY.
        
        CONTEXT: You have access to Indian legal documents. Use the provided LEGAL CONTEXT to answer accurately.
        """

    def build_user_message(self, query: str, legal_context: str) -> str:
        """Build the user message with legal context if available."""
        if legal_context and "No specific legal context found." not in legal_context and "Unable to retrieve legal context." not in legal_context:
            return f"LEGAL CONTEXT:\n{legal_context}\n\nUSER QUESTION: {query}"
        return query

    def call_openrouter(self, messages: List[Dict], temperature: float = 0.7) -> Optional[str]:
        """
        Call OpenRouter API with Fallback Logic.
        Tries models in order until one succeeds.
        """
        base_url = os.getenv("OPENAI_BASE_URL", "https://openrouter.ai/api/v1") + "/chat/completions"
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "HTTP-Referer": "http://localhost:3000",
            "X-Title": "VoiceGuard"
        }

        for model in self.fallback_models:
            try:
                payload = {
                    "model": model,
                    "messages": messages,
                    "temperature": temperature,
                    "max_tokens": 500
                }
                
                response = requests.post(base_url, headers=headers, json=payload, timeout=20)
                
                # Check for rate limits specifically
                if response.status_code == 429:
                    logger.warning(f"⚠️ Model {model} hit rate limit (429). Switching to backup...")
                    continue 
                
                response.raise_for_status()
                
                data = response.json()
                if 'choices' in data and len(data['choices']) > 0:
                    return data['choices'][0]['message']['content']
                else:
                    logger.warning(f"⚠️ Model {model} returned empty choices. Switching...")
                    continue

            except requests.exceptions.RequestException as e:
                logger.error(f"❌ Error with model {model}: {e}")
                continue 
            except Exception as e:
                logger.error(f"❌ Unexpected error with {model}: {e}")
                continue

        logger.error("❌ All models failed to generate a response.")
        return None

    def add_disclaimer(self, answer: str) -> str:
        """Add a legal disclaimer to the response."""
        if "181" not in answer and "112" not in answer:
            answer += "\n\n(Note: For urgent help, dial 181 or 112.)"
        return answer

    def _should_skip_db_search(self, message: str) -> bool:
        """
        Determine if the DB search should be skipped based on heuristics.
        Returns TRUE to SKIP (for simple chats), FALSE to SEARCH (for legal/safety issues).
        """
        message_lower = message.lower()
        
        # 1. Check length (very short messages usually don't need RAG, unless they are specific keywords)
        words = message_lower.split()
        if len(words) < 2 and message_lower not in self.safety_keywords:
            return True

        # 2. Check for Question Words (usually imply a need for info)
        if message_lower.startswith(('what', 'how', 'why', 'who', 'when', 'where', 'can i', 'is it', 'kya', 'kaise', 'kyun')):
            return False # Do not skip

        # 3. Check against comprehensive keyword list
        # We check if any token in the message roughly matches our keywords
        for word in words:
            # Simple stemming: check if a keyword is contained in the word (e.g., "beating" contains "beat")
            for keyword in self.safety_keywords:
                if keyword in word: 
                    return False # Do not skip, found a relevant keyword

        return True # Skip if no keywords found

    def chat(self, user_id: str, message: str, language: str = "english") -> Dict:
        """Main chat function with database persistence and search optimization."""
        overall_start_time = time.time()
        try:
            if not user_id or not message.strip():
                return {"error": "user_id and a non-empty message are required", "success": False}

            logger.info(f"📨 Processing message from user {user_id}: {message[:50]}...")

            # --- Optimized RAG Search ---
            db_search_time_ms = 0
            context = ""
            
            if self._should_skip_db_search(message):
                logger.info("💬 Simple conversation detected, skipping DB search.")
            else:
                logger.info("🔍 Safety/Legal keywords detected. Searching Database...")
                db_search_start_time = time.time()
                legal_docs = self.search_laws(message)
                context = "\n\n".join(legal_docs)
                db_search_time_ms = round((time.time() - db_search_start_time) * 1000)

            # --- Build Message History ---
            messages = [{"role": "system", "content": self.build_system_prompt()}]
            history_docs = get_chat_history(user_id)
            for doc in history_docs:
                messages.append({"role": doc["role"], "content": doc["content"]})

            user_msg_with_context = self.build_user_message(message, context)
            messages.append({"role": "user", "content": user_msg_with_context})

            # --- Call LLM ---
            api_call_start_time = time.time()
            response = self.call_openrouter(messages)
            api_call_time_ms = round((time.time() - api_call_start_time) * 1000)

            if response is None:
                return {"error": "The AI service is currently busy. Please try again.", "success": False}

            final_response = self.add_disclaimer(response)

            # --- Save to Database ---
            save_chat_message(user_id, "user", message)
            save_chat_message(user_id, "assistant", final_response)

            overall_processing_time_ms = round((time.time() - overall_start_time) * 1000)
            logger.info(f"✅ Response generated. DB: {db_search_time_ms}ms, API: {api_call_time_ms}ms")
            
            return {
                "success": True,
                "response": final_response,
                "timestamp": datetime.now().isoformat(),
                "db_search_time_ms": db_search_time_ms,
                "api_call_time_ms": api_call_time_ms,
                "overall_processing_time_ms": overall_processing_time_ms
            }

        except Exception as e:
            logger.error(f"❌ Unexpected error in chat for user {user_id}: {e}")
            return {"error": "An unexpected server error occurred.", "success": False}

    def clear_user_history(self, user_id: str):
        """Clear conversation history for a user from the database."""
        logger.info(f"Attempting to clear history for user {user_id}...")
        db_clear_history(user_id)

    def get_stats(self) -> Dict:
        return {
            "active_users": "Stored in DB",
            "model": "Auto-Switching (Llama/Gemini/Mistral)",
            "chroma_path": self.chroma_path
        }