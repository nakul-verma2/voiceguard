# utils/chatbot.py

import chromadb
import requests
import os
import logging
from typing import Dict, List, Optional
from datetime import datetime

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
        return """You are a women's safety legal assistant for India.

CORE RULES:
1. Answer questions about women's safety, rights, and Indian law
2. For unrelated questions, politely redirect to your specialty
3. Use the legal context provided to give accurate answers
4. Include relevant section numbers when applicable
5. Be empathetic, supportive, and respectful
6. Respond in the same language as the user (English/Hindi/Hinglish)

TONE:
- Warm and conversational for casual chat
- Detailed and precise for legal questions
- Empathetic for emergency situations"""
    
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
            
            # Search for relevant laws
            legal_docs = self.search_laws(message)
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
            
            # Get response from LLM
            response = self.call_openrouter(messages)
            
            if response is None:
                logger.error("❌ Failed to get response from OpenRouter")
                return {
                    "error": "Failed to generate response. Please try again.",
                    "success": False
                }
            
            # Add disclaimer
            response = self.add_disclaimer(response)
            
            # Save to history
            self.save_to_history(user_id, message, response)
            
            logger.info(f"✅ Response generated for user {user_id}")
            
            return {
                "success": True,
                "response": response,
                "user_id": user_id,
                "language": language,
                "timestamp": datetime.now().isoformat()
            }
            
        except Exception as e:
            logger.error(f"❌ Unexpected error in chat: {str(e)}")
            return {
                "error": "An unexpected error occurred. Please try again.",
                "success": False,
                "details": str(e)
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
