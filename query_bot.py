import chromadb
import requests
import os

OPENROUTER_API_KEY = "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"

client = chromadb.PersistentClient(path="./chroma_db")
collection = client.get_collection("women_safety_laws")

# Store conversation history
conversation_history = []

def search_laws(user_query, n_results=3):
    """Search relevant law sections"""
    results = collection.query(
        query_texts=[user_query],
        n_results=n_results
    )
    return results['documents'][0]

def ask_llama(user_query):
    """Query with RAG using Llama 3.3 70B"""
    
    # Get relevant law sections
    relevant_docs = search_laws(user_query)
    context = "\n\n".join(relevant_docs)
    
    # Build system prompt
    system_prompt = """You are a women's safety legal assistant for India. 

RULES:
1. ONLY answer questions about women's safety, rights, and Indian law
2. For unrelated questions (math, general chat, etc.), politely redirect: "I specialize in women's safety legal questions. Please ask about domestic violence, harassment, legal rights, or emergency help."
3. Use the legal context provided to give accurate answers
4. Include relevant section numbers when applicable
5. Always add disclaimer at the end
6. Respond in the same language as the question (English/Hindi/Hinglish)"""

    # Build user message with context
    user_message = f"""LEGAL CONTEXT:
{context}

USER QUESTION: {user_query}

Remember: Answer ONLY if this relates to women's safety/legal rights. Otherwise, redirect politely."""

    # Build messages array
    messages = [
        {"role": "system", "content": system_prompt}
    ]
    
    # Add conversation history (last 4 messages to keep context manageable)
    messages.extend(conversation_history[-4:])
    
    # Add current query
    messages.append({"role": "user", "content": user_message})
    
    # Call OpenRouter
    response = requests.post(
        "https://openrouter.ai/api/v1/chat/completions",
        headers={
            "Authorization": f"Bearer {OPENROUTER_API_KEY}",
            "Content-Type": "application/json"
        },
        json={
            "model": "meta-llama/llama-3.3-70b-instruct:free",
            "messages": messages,
            "temperature": 0.7,
            "max_tokens": 500
        }
    )
    
    answer = response.json()['choices'][0]['message']['content']
    
    # Store in history
    conversation_history.append({"role": "user", "content": user_query})
    conversation_history.append({"role": "assistant", "content": answer})
    
    # Add disclaimer if not present
    if "Women Helpline 181" not in answer:
        answer += "\n\nThis is legal information, not professional advice. For urgent help: Call Women Helpline 181"
    
    return answer

# Test it
if __name__ == "__main__":
    print("Women Safety Legal Bot (Type 'exit' to quit)\n")
    
    while True:
        question = input("Ask: ")
        if question.lower() == 'exit':
            break
            
        answer = ask_llama(question)
        print(f"\nBot: {answer}\n")
