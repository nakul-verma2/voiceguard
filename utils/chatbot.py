# utils/chatbot.py

import chromadb
import requests
import os
import logging
from typing import Dict, List, Optional
from datetime import datetime
import time

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class WomenSafetyChatbot:
    """Women Safety Legal Chatbot with RAG using ChromaDB and OpenRouter"""
    
    def __init__(self, api_key: str, chroma_path: str = "./chroma_db"):
        """
        Initialize the chatbot
        
        Args:
            api_key: OpenRouter API key
            chroma_path: Path to ChromaDB persistent storage
        """
        try:
            self.api_key = api_key
            self.chroma_path = chroma_path
            self.model = "meta-llama/llama-3.3-70b-instruct:free"
            
            # Initialize ChromaDB
            self.client = chromadb.PersistentClient(path=chroma_path)
            self.collection = self.client.get_collection("women_safety_laws")
            
            # Store conversation history per user
            self.user_histories = {}
            
            logger.info("✅ Chatbot initialized successfully")
        except Exception as e:
            logger.error(f"❌ Failed to initialize chatbot: {str(e)}")
            raise
    
    def search_laws(self, query: str, n_results: int = 3) -> List[str]:
        """
        Search ChromaDB for relevant law sections
        
        Args:
            query: User query to search for
            n_results: Number of results to retrieve
            
        Returns:
            List of relevant document snippets
        """
        try:
            results = self.collection.query(
                query_texts=[query],
                n_results=n_results
            )
            documents = results.get('documents', [[]])[0]
            
            if not documents:
                logger.warning(f"No documents found for query: {query}")
                return ["No specific legal context found."]
            
            return documents
        except Exception as e:
            logger.error(f"❌ Error searching laws: {str(e)}")
            return ["Unable to retrieve legal context."]
    
    def build_system_prompt(self) -> str:
        """Build the system prompt for the LLM"""
        return """You are a women's safety assistant for India.

Your specialty: women's safety, women's rights, and Indian law.

====================
LANGUAGE
====================
Always respond in the same language as the user (English/Hindi/Hinglish).

====================
HOW TO RESPOND
====================
You have TWO response styles. Choose the correct one by carefully reading the user's actual message:

📋 STYLE 1: LEGAL & DETAILED
Use this style ONLY if:
- The user's message contains "LEGAL CONTEXT:" (check their actual text carefully)
- OR they ask about specific laws, IPC sections, legal procedures, FIR filing, courts, acts, or legal rights

Response format:
- Give a detailed, step-by-step legal answer
- Mention relevant Indian laws and sections when you know them
- Explain practical steps they can take
- Remind them to consult a real lawyer for specific cases
- Stay formal, precise, and empathetic

Example questions for STYLE 1:
- "LEGAL CONTEXT: How do I file FIR for workplace harassment?"
- "What sections of IPC protect against domestic violence?"
- "Can I get legal protection from stalking in India?"

---

💬 STYLE 2: SHORT & FRIENDLY
Use this style for everything else:
- Greetings like "hello", "hi", "नमस्ते"
- General safety tips (travel, online safety, boundaries)
- Emotional support questions
- Practical advice (not legal procedures)

Response format:
- Answer in 1-4 sentences maximum
- Be warm, encouraging, and supportive
- Give simple, actionable tips
- Keep it conversational like talking to a friend

Example questions for STYLE 2:
- "hello" → greet back warmly and ask how you can help
- "I feel unsafe at night" → give short safety tips
- "My friend is very controlling" → brief supportive advice

====================
OUT-OF-SCOPE QUESTIONS
====================
If the user asks about topics unrelated to women's safety (coding, cricket, recipes, etc.):
- Reply in 1 sentence politely
- Say you focus on women's safety and rights in India
- Invite them to ask a relevant question

====================
EMERGENCY SITUATIONS
====================
If the user describes immediate danger (violence happening now, threats):
- Be highly empathetic
- Urge them to contact police (100/112), trusted people, or helplines immediately
- Give brief practical steps they can take right now

====================
IMPORTANT RULES
====================
1. Do NOT add words or phrases that the user did not write
2. Read their actual message carefully before deciding which style to use
3. For simple greetings, ALWAYS use STYLE 2 (short & friendly)
4. Never encourage violence, self-harm, or illegal actions
5. You are an informational assistant, not a replacement for real lawyers or police

Now respond to the user's message in the appropriate style."""

    
    def build_user_message(self, query: str, legal_context: str) -> str:
        """Build the user message with legal context"""
        return f"""LEGAL CONTEXT:
{legal_context}

USER QUESTION: {query}

Provide helpful, accurate information based on the context above."""
    
    def call_openrouter(self, messages: List[Dict], temperature: float = 0.7) -> Optional[str]:
        """
        Call OpenRouter API with error handling
        
        Args:
            messages: Message history for the API
            temperature: Model temperature (0.3-1.0)
            
        Returns:
            Model response or None if error
        """
        try:
            response = requests.post(
                "https://openrouter.ai/api/v1/chat/completions",
                headers={
                    "Authorization": f"Bearer {self.api_key}",
                    "Content-Type": "application/json"
                },
                json={
                    "model": self.model,
                    "messages": messages,
                    "temperature": temperature,
                    "max_tokens": 500
                },
                timeout=30
            )
            
            response.raise_for_status()
            
            data = response.json()
            
            if 'choices' not in data or not data['choices']:
                logger.error("❌ Invalid response structure from OpenRouter")
                return None
            
            answer = data['choices'][0]['message']['content']
            return answer
            
        except requests.exceptions.Timeout:
            logger.error("❌ OpenRouter API request timed out")
            return None
        except requests.exceptions.HTTPError as e:
            logger.error(f"❌ HTTP error from OpenRouter: {str(e)}")
            return None
        except Exception as e:
            logger.error(f"❌ Error calling OpenRouter: {str(e)}")
            return None
    
    def add_disclaimer(self, answer: str) -> str:
        """Add legal disclaimer if not present"""
        if "Women Helpline 181" not in answer:
            answer += "\n\nThis is legal information, not professional advice. For urgent help: Call Women Helpline 181"
        return answer
    
    def get_user_history(self, user_id: str, max_messages: int = 4) -> List[Dict]:
        """
        Get conversation history for a user
        
        Args:
            user_id: Unique user identifier
            max_messages: Maximum number of messages to retrieve
            
        Returns:
            List of conversation messages
        """
        if user_id not in self.user_histories:
            self.user_histories[user_id] = []
        
        return self.user_histories[user_id][-max_messages:]
    
    def save_to_history(self, user_id: str, user_message: str, bot_response: str):
        """Save user message and bot response to history"""
        if user_id not in self.user_histories:
            self.user_histories[user_id] = []
        
        self.user_histories[user_id].append({
            "role": "user",
            "content": user_message,
            "timestamp": datetime.now().isoformat()
        })
        self.user_histories[user_id].append({
            "role": "assistant",
            "content": bot_response,
            "timestamp": datetime.now().isoformat()
        })
    
    def chat(self, user_id: str, message: str, language: str = "english") -> Dict:
        """
        Main chat function
        
        Args:
            user_id: Unique user identifier
            message: User message
            language: Language preference (english/hindi/hinglish)
            
        Returns:
            Dictionary with response and metadata
        """
        try:
            # Start overall timer
            overall_start_time = time.time()

            # Validate inputs
            if not user_id or not message:
                logger.warning("❌ Missing user_id or message")
                return {
                    "error": "user_id and message are required",
                    "success": False
                }
            
            message = message.strip()
            
            if len(message) == 0:
                return {
                    "error": "Message cannot be empty",
                    "success": False
                }
            
            logger.info(f"📨 Processing message from user {user_id}: {message[:50]}...")
            
            # Start DB search timer
            db_search_start_time = time.time()
            legal_docs = self.search_laws(message)
            db_search_end_time = time.time()
            db_search_time_ms = round((db_search_end_time - db_search_start_time) * 1000)
            
            context = "\n\n".join(legal_docs)
            
            # Build messages array
            messages = [
                {"role": "system", "content": self.build_system_prompt()}
            ]
            
            # Add conversation history
            history = self.get_user_history(user_id)
            messages.extend(history)
            
            # Add current message
            user_msg = self.build_user_message(message, context)
            messages.append({"role": "user", "content": user_msg})
            
            # Start API call timer
            api_call_start_time = time.time()
            response = self.call_openrouter(messages)
            api_call_end_time = time.time()
            api_call_time_ms = round((api_call_end_time - api_call_start_time) * 1000)
            
            if response is None:
                logger.error("❌ Failed to get response from OpenRouter")
                return {
                    "error": "Failed to generate response. Please try again.",
                    "success": False,
                    "db_search_time_ms": db_search_time_ms,
                    "api_call_time_ms": api_call_time_ms,
                    "overall_processing_time_ms": round((time.time() - overall_start_time) * 1000)
                }
            
            # Add disclaimer
            response = self.add_disclaimer(response)
            
            # Save to history
            self.save_to_history(user_id, message, response)
            
            logger.info(f"✅ Response generated for user {user_id}")
            
            overall_end_time = time.time()
            overall_processing_time_ms = round((overall_end_time - overall_start_time) * 1000)

            return {
                "success": True,
                "response": response,
                "user_id": user_id,
                "language": language,
                "timestamp": datetime.now().isoformat(),
                "db_search_time_ms": db_search_time_ms,
                "api_call_time_ms": api_call_time_ms,
                "overall_processing_time_ms": overall_processing_time_ms
            }
            
        except Exception as e:
            logger.error(f"❌ Unexpected error in chat: {str(e)}")
            return {
                "error": "An unexpected error occurred. Please try again.",
                "success": False,
                "details": str(e),
                "overall_processing_time_ms": round((time.time() - overall_start_time) * 1000)
            }
    
    def clear_user_history(self, user_id: str):
        """Clear conversation history for a user"""
        if user_id in self.user_histories:
            del self.user_histories[user_id]
            logger.info(f"✅ Cleared history for user {user_id}")
    
    def get_stats(self) -> Dict:
        """Get chatbot statistics"""
        return {
            "active_users": len(self.user_histories),
            "total_messages": sum(len(h) for h in self.user_histories.values()),
            "model": self.model,
            "chroma_path": self.chroma_path
        }

    def _should_skip_db_search(self, message: str) -> bool:
        """
        Determine if the DB search should be skipped based on heuristics.
        
        Args:
            message: The user's message.
            
        Returns:
            True if the DB search should be skipped, False otherwise.
        """
        message = message.lower()
        
        # 1. Check message length
        if len(message.split()) < 4:
            return True
            
        # 2. Check for legal keywords
        legal_keywords = ["law", "legal", "police", "fir", "abuse", "domestic", "violence", "section", "act", "ipc", "crpc", "court", "advocate", "lawyer", "harassment"]
        if any(keyword in message for keyword in legal_keywords):
            return False
            
        # 3. Check for question-like structure
        if message.endswith('?') or message.startswith(('what', 'how', 'why', 'who', 'when', 'where')):
            return False
            
        return True

    def chat(self, user_id: str, message: str, language: str = "english") -> Dict:
        """
        Main chat function
        
        Args:
            user_id: Unique user identifier
            message: User message
            language: Language preference (english/hindi/hinglish)
            
        Returns:
            Dictionary with response and metadata
        """
        try:
            # Start overall timer
            overall_start_time = time.time()

            # Validate inputs
            if not user_id or not message:
                logger.warning("❌ Missing user_id or message")
                return {
                    "error": "user_id and message are required",
                    "success": False
                }
            
            message = message.strip()
            
            if len(message) == 0:
                return {
                    "error": "Message cannot be empty",
                    "success": False
                }
            
            logger.info(f"📨 Processing message from user {user_id}: {message[:50]}...")
            
            db_search_time_ms = 0
            context = ""  # Initialize context as empty string
            if self._should_skip_db_search(message):
                logger.info("💬 Simple message detected, skipping DB search.")
            else:
                # Start DB search timer
                db_search_start_time = time.time()
                legal_docs = self.search_laws(message)
                db_search_end_time = time.time()
                db_search_time_ms = round((db_search_end_time - db_search_start_time) * 1000)
                # Check if the search returned actual documents
                if legal_docs and "No specific legal context found." not in legal_docs[0] and "Unable to retrieve legal context." not in legal_docs[0]:
                    context = "\n\n".join(legal_docs)
            
            # Build messages array
            messages = [
                {"role": "system", "content": self.build_system_prompt()}
            ]
            
            # Add conversation history
            history = self.get_user_history(user_id)
            messages.extend(history)
            
            # Add current message
            if context:
                user_msg = self.build_user_message(message, context)
            else:
                user_msg = message
            messages.append({"role": "user", "content": user_msg})
            
            # Start API call timer
            api_call_start_time = time.time()
            response = self.call_openrouter(messages)
            api_call_end_time = time.time()
            api_call_time_ms = round((api_call_end_time - api_call_start_time) * 1000)
            
            if response is None:
                logger.error("❌ Failed to get response from OpenRouter")
                return {
                    "error": "Failed to generate response. Please try again.",
                    "success": False,
                    "db_search_time_ms": db_search_time_ms,
                    "api_call_time_ms": api_call_time_ms,
                    "overall_processing_time_ms": round((time.time() - overall_start_time) * 1000)
                }
            
            # Add disclaimer
            response = self.add_disclaimer(response)
            
            # Save to history
            self.save_to_history(user_id, message, response)
            
            logger.info(f"✅ Response generated for user {user_id}")
            
            overall_end_time = time.time()
            overall_processing_time_ms = round((overall_end_time - overall_start_time) * 1000)

            return {
                "success": True,
                "response": response,
                "user_id": user_id,
                "language": language,
                "timestamp": datetime.now().isoformat(),
                "db_search_time_ms": db_search_time_ms,
                "api_call_time_ms": api_call_time_ms,
                "overall_processing_time_ms": overall_processing_time_ms
            }
            
        except Exception as e:
            logger.error(f"❌ Unexpected error in chat: {str(e)}")
            return {
                "error": "An unexpected error occurred. Please try again.",
                "success": False,
                "details": str(e),
                "overall_processing_time_ms": round((time.time() - overall_start_time) * 1000)
            }
