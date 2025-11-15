# Install first: pip install chromadb pypdf langchain langchain-community

import chromadb
from pypdf import PdfReader
import os

# Initialize ChromaDB
client = chromadb.PersistentClient(path="./chroma_db")
collection = client.get_or_create_collection(
    name="women_safety_laws",
    metadata={"description": "Indian laws for women safety"}
)

# Load PDFs
data_folder = "data"
pdf_files = [
    "BNS_2023.pdf",
    "Constitution_India.pdf",
    "IPC_1860.pdf",
    "DV_Act_2005.pdf",
    "DV_Act_2005_Hindi.pdf",
    "Sexual_Harassment_Act_2013.pdf"
]

print("Loading documents into ChromaDB...")

for pdf_file in pdf_files:
    file_path = os.path.join(data_folder, pdf_file)
    print(f"Processing: {pdf_file}")
    
    pdf = PdfReader(file_path)
    for page_num, page in enumerate(pdf.pages[:10]):  # First 10 pages for testing
        text = page.extract_text()
        if text.strip():
            collection.add(
                documents=[text],
                ids=[f"{pdf_file}_page_{page_num}"],
                metadatas=[{"source": pdf_file, "page": page_num}]
            )

print("✅ Done! Database created in ./chroma_db folder")
