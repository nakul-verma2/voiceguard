import os
from dotenv import load_dotenv
import logging
from dotenv import load_dotenv
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure, OperationFailure
from datetime import datetime

# --- Load environment variables BEFORE anything else ---
load_dotenv()

# --- Setup Logging ---
logging.basicConfig(level=logging.INFO, format='%(asctime)s | %(levelname)s | %(message)s')

# --- Database Connection ---
MONGO_URI = os.getenv("MONGO_URI")
MONGO_DB_NAME = os.getenv("MONGO_DB_NAME", "voiceguard_db")

client = None
db = None
users_collection = None
chat_history_collection = None
evidence_collection = None

try:
    if MONGO_URI:
        client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000)
        client.admin.command('ismaster')
        db = client[MONGO_DB_NAME]
        users_collection = db["users"]
        chat_history_collection = db["chat_history"]
        evidence_collection = db["evidence"]
        logging.info(f"✅ Successfully connected to MongoDB and initialized collections.")
    else:
        logging.error("FATAL: MONGO_URI environment variable not set.")

except ConnectionFailure as e:
    logging.error(f"❌ Could not connect to MongoDB: {e}")
except OperationFailure as e:
    logging.error(f"❌ MongoDB operation failed during initialization: {e}")
except Exception as e:
    logging.error(f"❌ An unexpected error occurred during MongoDB connection: {e}")

if db is None:
    logging.warning("Database connection failed. All database operations will be skipped.")

# --- User Functions ---
def get_user(user_id):
    """Retrieves a user document from the database."""
    if users_collection is None:
        logging.warning("Skipping get_user: database not connected.")
        return None
    try:
        return users_collection.find_one({"user_id": user_id})
    except OperationFailure as e:
        logging.error(f"Error getting user {user_id}: {e}")
        return None

def update_user_contacts(user_id, contacts):
    """Updates or creates a user with their emergency contacts."""
    if users_collection is None:
        logging.warning("Skipping update_user_contacts: database not connected.")
        return None
    try:
        result = users_collection.update_one(
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
    if chat_history_collection is None:
        logging.warning("Skipping save_chat_message: database not connected.")
        return None
    try:
        message = {
            "user_id": user_id,
            "role": role,
            "content": content,
            "timestamp": datetime.utcnow()
        }
        result = chat_history_collection.insert_one(message)
        return result
    except OperationFailure as e:
        logging.error(f"Error saving chat message for user {user_id}: {e}")
        return None

def get_chat_history(user_id, limit=20):
    """Retrieves the most recent chat history for a user."""
    if chat_history_collection is None:
        logging.warning("Skipping get_chat_history: database not connected.")
        return []
    try:
        history = chat_history_collection.find({"user_id": user_id}).sort("timestamp", -1).limit(limit)
        return list(history)[::-1]
    except OperationFailure as e:
        logging.error(f"Error getting chat history for user {user_id}: {e}")
        return []

def clear_user_history(user_id):
    """Deletes all chat messages for a specific user."""
    if chat_history_collection is None:
        logging.warning("Skipping clear_user_history: database not connected.")
        return None
    try:
        result = chat_history_collection.delete_many({"user_id": user_id})
        logging.info(f"Cleared {result.deleted_count} messages for user {user_id}.")
        return result
    except OperationFailure as e:
        logging.error(f"Error clearing history for user {user_id}: {e}")
        return None

# --- Evidence Functions ---
def save_evidence_metadata(user_id, filename, file_url, content_type):
    """Saves metadata about an uploaded file to the evidence collection."""
    if evidence_collection is None:
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
        result = evidence_collection.insert_one(metadata)
        logging.info(f"Saved evidence metadata for user {user_id}: {filename}")
        return result
    except OperationFailure as e:
        logging.error(f"Error saving evidence metadata for user {user_id}: {e}")
        return None
