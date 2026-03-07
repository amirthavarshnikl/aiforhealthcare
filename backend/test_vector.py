from database.vectordb import collection
from database.embeddings import generate_embedding

text = "Myocardial infarction means heart attack"

embedding = generate_embedding(text)

collection.add(
    documents=[text],
    embeddings=[embedding],
    ids=["doc1"]
)

results = collection.query(
    query_embeddings=[generate_embedding("What is heart attack?")],
    n_results=1
)

print(results)