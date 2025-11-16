# verify_embeddings.py

import chromadb
import pprint

def verify_embeddings():
    """
    Connects to the ChromaDB database and performs a few test queries
    to verify that the embeddings are semantically meaningful.
    """
    try:
        # Connect to the existing ChromaDB database
        client = chromadb.PersistentClient(path="./chroma_db")
        collection = client.get_collection("women_safety_laws")
        print("✅ Successfully connected to the 'women_safety_laws' collection.")
        print(f"Total documents in collection: {collection.count()}")
        print("-" * 50)

    except Exception as e:
        print(f"❌ Could not connect to ChromaDB or get collection. Error: {e}")
        print("Please make sure you have run 'python setup_chromadb.py' first.")
        return

    # --- Define Test Queries ---
    # These queries are designed to target specific documents in the database.
    queries = {
        "Domestic Violence Definition": "What is the definition of domestic violence?",
        "Fundamental Rights": "What are the fundamental rights of a citizen?",
        "Sexual Harassment": "What constitutes sexual harassment at the workplace?",
        "Indian Penal Code": "Tell me about the Indian Penal Code."
    }

    for description, query_text in queries.items():
        print(f"🔎 Testing Query: '{description}'")
        print(f"   Query Text: '{query_text}'")

        try:
            # Query the collection
            results = collection.query(
                query_texts=[query_text],
                n_results=2  # Get the top 2 most relevant results
            )

            # Print the results for verification
            print("   ✅ Top Results:")
            for i, (doc, meta) in enumerate(zip(results['documents'][0], results['metadatas'][0])):
                print(f"      Result {i+1}:")
                print(f"         Source: {meta.get('source', 'N/A')}, Page: {meta.get('page', 'N/A')}")
                # Print the first 150 characters of the retrieved document
                print(f"         Content: '{doc.strip()[:150]}...'")
            print("-" * 50)

        except Exception as e:
            print(f"   ❌ Error during query: {e}")
            print("-" * 50)

if __name__ == "__main__":
    verify_embeddings()
