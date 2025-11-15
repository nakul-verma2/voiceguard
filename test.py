# test_chatbot.py

import sys
import os

# Add utils to path if needed
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from utils.chatbot import WomenSafetyChatbot

def test_chatbot():
    """Simple test script for the chatbot"""
    
    print("=" * 60)
    print("🧪 TESTING WOMEN SAFETY CHATBOT")
    print("=" * 60)
    
    # Step 1: Initialize chatbot
    print("\n[1] Initializing chatbot...")
    try:
        api_key = "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"
        chatbot = WomenSafetyChatbot(api_key=api_key, chroma_path="./chroma_db")
        print("✅ Chatbot initialized successfully")
    except Exception as e:
        print(f"❌ Failed to initialize chatbot: {str(e)}")
        return
    
    # Step 2: Test greeting (namaste)
    print("\n[2] Testing greeting message...")
    try:
        user_id = "test_user_001"
        message = "namaste"
        
        print(f"   User ID: {user_id}")
        print(f"   Message: {message}")
        
        response = chatbot.chat(user_id=user_id, message=message, language="hindi")
        
        if response.get('success'):
            print("\n✅ Response received:")
            print("-" * 60)
            print(response['response'])
            print("-" * 60)
            print(f"\n   Timestamp: {response['timestamp']}")
        else:
            print(f"\n❌ Error: {response.get('error')}")
            if 'details' in response:
                print(f"   Details: {response['details']}")
    
    except Exception as e:
        print(f"❌ Test failed with exception: {str(e)}")
        import traceback
        print("\nFull traceback:")
        traceback.print_exc()
    
    # Step 3: Test stats
    print("\n[3] Getting chatbot stats...")
    try:
        stats = chatbot.get_stats()
        print("✅ Stats:")
        for key, value in stats.items():
            print(f"   {key}: {value}")
    except Exception as e:
        print(f"❌ Failed to get stats: {str(e)}")
    
    # Step 4: Test invalid input
    print("\n[4] Testing error handling (empty message)...")
    try:
        response = chatbot.chat(user_id="test_user_002", message="", language="english")
        if not response.get('success'):
            print(f"✅ Error correctly caught: {response.get('error')}")
        else:
            print("⚠️  Expected error but got success")
    except Exception as e:
        print(f"❌ Unexpected exception: {str(e)}")
    
    # Step 5: Test missing user_id
    print("\n[5] Testing error handling (missing user_id)...")
    try:
        response = chatbot.chat(user_id="", message="hello", language="english")
        if not response.get('success'):
            print(f"✅ Error correctly caught: {response.get('error')}")
        else:
            print("⚠️  Expected error but got success")
    except Exception as e:
        print(f"❌ Unexpected exception: {str(e)}")
    
    print("\n" + "=" * 60)
    print("🎉 TEST COMPLETED")
    print("=" * 60)

if __name__ == "__main__":
    test_chatbot()
