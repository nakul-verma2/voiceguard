import os
from dotenv import load_dotenv
import logging
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure, OperationFailure
from datetime import datetime

# --- Load environment variables BEFORE anything else ---
load_dotenv()

# --- Setup Logging ---
logging.basicConfig(level=logging.INFO, format='%(asctime)s | %(levelname)s | %(message)s')

# --- Database Connection Helper ---
def _get_db():
    """
    Establishes a new database connection for the current process.
    Returns the database object or None if connection fails.
    """
    mongo_uri = os.getenv("MONGO_URI")
    if not mongo_uri:
        logging.error("FATAL: MONGO_URI environment variable not set.")
        return None
    
    try:
        client = MongoClient(mongo_uri, serverSelectionTimeoutMS=5000)
        # The ismaster command is cheap and does not require auth.
        client.admin.command('ismaster')
        db_name = os.getenv("MONGO_DB_NAME", "voiceguard_db")
        return client[db_name]
    except (ConnectionFailure, OperationFailure) as e:
        logging.error(f"❌ Could not connect to MongoDB: {e}")
        return None

# --- User Functions ---
def get_user(user_id):
    """Retrieves a user document from the database."""
    db = _get_db()
    if db is None:
        logging.warning("Skipping get_user: database not connected.")
        return None
    try:
        return db.users.find_one({"user_id": user_id})
    except OperationFailure as e:
        logging.error(f"Error getting user {user_id}: {e}")
        return None

def update_user_contacts(user_id, contacts):
    """Updates or creates a user with their emergency contacts."""
    db = _get_db()
    if db is None:
        logging.warning("Skipping update_user_contacts: database not connected.")
        return None
    try:
        result = db.users.update_one(
            {"user_id": user_id},
            {"$set": {"emergency_contacts": contacts, "updated_at": datetime.utcnow()}},
            upsert=True
        )
        logging.info(f"Updated contacts for user {user_id}.")
        return result
    except OperationFailure as e:
        logging.error(f"Error updating contacts for user {user_id}: {e}")
        return None

# --- Chat History Functions ---
def save_chat_message(user_id, role, content):
    """Saves a single chat message to the chat_history collection."""
    db = _get_db()
    if db is None:
        logging.warning("Skipping save_chat_message: database not connected.")
        return None
    try:
        message = {
            "user_id": user_id,
            "role": role,
            "content": content,
            "timestamp": datetime.utcnow()
        }
        result = db.chat_history.insert_one(message)
        return result
    except OperationFailure as e:
        logging.error(f"Error saving chat message for user {user_id}: {e}")
        return None

def get_chat_history(user_id, limit=20):
    """Retrieves the most recent chat history for a user."""
    db = _get_db()
    if db is None:
        logging.warning("Skipping get_chat_history: database not connected.")
        return []
    try:
        history = db.chat_history.find({"user_id": user_id}).sort("timestamp", -1).limit(limit)
        return list(history)[::-1]
    except OperationFailure as e:
        logging.error(f"Error getting chat history for user {user_id}: {e}")
        return []

def clear_user_history(user_id):
    """Deletes all chat messages for a specific user."""
    db = _get_db()
    if db is None:
        logging.warning("Skipping clear_user_history: database not connected.")
        return None
    try:
        result = db.chat_history.delete_many({"user_id": user_id})
        logging.info(f"Cleared {result.deleted_count} messages for user {user_id}.")
        return result
    except OperationFailure as e:
        logging.error(f"Error clearing history for user {user_id}: {e}")
        return None

# --- Evidence Functions ---
def save_evidence_metadata(user_id, filename, file_url, content_type):
    """Saves metadata about an uploaded file to the evidence collection."""
    db = _get_db()
    if db is None:
        logging.warning("Skipping save_evidence_metadata: database not connected.")
        return None
    try:
        metadata = {
            "user_id": user_id,
            "filename": filename,
            "url": file_url,
            "content_type": content_type,
            "timestamp": datetime.utcnow()
        }
        result = db.evidence.insert_one(metadata)
        logging.info(f"Saved evidence metadata for user {user_id}: {filename}")
        return result
    except OperationFailure as e:
        logging.error(f"Error saving evidence metadata for user {user_id}: {e}")
        return None
