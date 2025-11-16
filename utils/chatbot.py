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
        Initialize the chatbot.

        Args:
            api_key: OpenRouter API key.
            chroma_path: Path to ChromaDB persistent storage.
        """
        try:
            self.api_key = api_key
            self.chroma_path = chroma_path
            self.model = os.getenv("MODEL_ID", "meta-llama/llama-3.3-70b-instruct:free")

            # Initialize ChromaDB for RAG
            self.client = chromadb.PersistentClient(path=chroma_path)
            self.collection = self.client.get_collection("women_safety_laws")

            logger.info("✅ Chatbot initialized successfully")
        except Exception as e:
            logger.error(f"❌ Failed to initialize chatbot: {str(e)}")
            raise

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
        1. LEGAL & DETAILED: Use if the user asks about laws, IPC sections, legal procedures, FIRs, courts, or rights. Be formal, step-by-step, and mention specific laws.
        2. SHORT & FRIENDLY: Use for everything else (greetings, general safety tips, emotional support). Be warm, encouraging, and conversational (1-4 sentences).
        EMERGENCY: If the user is in immediate danger, urge them to contact police (112) or helplines (181) immediately.
        OUT-OF-SCOPE: If asked about unrelated topics, politely state you focus on women's safety in India.
        """

    def build_user_message(self, query: str, legal_context: str) -> str:
        """Build the user message with legal context if available."""
        if legal_context and "No specific legal context found." not in legal_context and "Unable to retrieve legal context." not in legal_context:
            return f"LEGAL CONTEXT:\n{legal_context}\n\nUSER QUESTION: {query}"
        return query

    def call_openrouter(self, messages: List[Dict], temperature: float = 0.7) -> Optional[str]:
        """Call OpenRouter API with error handling."""
        try:
            response = requests.post(
                os.getenv("OPENAI_BASE_URL", "https://openrouter.ai/api/v1") + "/chat/completions",
                headers={"Authorization": f"Bearer {self.api_key}"},
                json={"model": self.model, "messages": messages, "temperature": temperature, "max_tokens": 500},
                timeout=30
            )
            response.raise_for_status()
            data = response.json()
            return data['choices'][0]['message']['content']
        except requests.exceptions.RequestException as e:
            logger.error(f"❌ API request error: {e}")
            return None
        except (KeyError, IndexError) as e:
            logger.error(f"❌ Invalid API response structure: {e}")
            return None

    def add_disclaimer(self, answer: str) -> str:
        """Add a legal disclaimer to the response."""
        if "Helpline 181" not in answer:
            answer += "\n\nThis is legal information, not professional advice. For urgent help, call the Women Helpline at 181."
        return answer

    def _should_skip_db_search(self, message: str) -> bool:
        """Determine if the DB search should be skipped based on heuristics."""
        message = message.lower()
        if len(message.split()) < 4:
            return True
        legal_keywords = ["law", "legal", "police", "fir", "abuse", "domestic", "violence", "section", "act", "ipc", "crpc", "court", "advocate", "lawyer", "harassment"]
        if any(keyword in message for keyword in legal_keywords):
            return False
        if message.endswith('?') or message.startswith(('what', 'how', 'why', 'who', 'when', 'where')):
            return False
        return True

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
                logger.info("💬 Simple message detected, skipping DB search for faster response.")
            else:
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
                return {"error": "Failed to generate response from AI model.", "success": False}

            final_response = self.add_disclaimer(response)

            # --- Save to Database ---
            save_chat_message(user_id, "user", message)
            save_chat_message(user_id, "assistant", final_response)

            logger.info(f"✅ Response generated and saved for user {user_id}")
            
            return {
                "success": True,
                "response": final_response,
                "timestamp": datetime.now().isoformat(),
                "db_search_time_ms": db_search_time_ms,
                "api_call_time_ms": api_call_time_ms,
                "overall_processing_time_ms": round((time.time() - overall_start_time) * 1000)
            }

        except Exception as e:
            logger.error(f"❌ Unexpected error in chat for user {user_id}: {e}")
            return {"error": "An unexpected server error occurred.", "success": False}

    def clear_user_history(self, user_id: str):
        """Clear conversation history for a user from the database."""
        logger.info(f"Attempting to clear history for user {user_id}...")
        db_clear_history(user_id)

    def get_stats(self) -> Dict:
        """Get chatbot statistics. (Note: In-memory stats are no longer available)."""
        return {
            "active_users": "N/A (now stored in DB)",
            "total_messages": "N/A (now stored in DB)",
            "model": self.model,
            "chroma_path": self.chroma_path
        }
