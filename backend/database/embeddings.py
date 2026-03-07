from sentence_transformers import SentenceTransformer
from typing import List, Union

# Initialize the embedding model
MODEL_NAME = "all-MiniLM-L6-v2"
model = SentenceTransformer(MODEL_NAME)

print(f"✓ Embeddings Model Loaded: {MODEL_NAME}")


async def generate_embedding(text: str) -> List[float]:
    """Generate embedding for a single text"""
    try:
        embedding = model.encode(text, convert_to_tensor=False)
        return embedding.tolist()
    except Exception as e:
        print(f"Error generating embedding: {e}")
        raise


async def generate_embeddings_batch(
    texts: List[str],
    show_progress_bar: bool = False
) -> List[List[float]]:
    """Generate embeddings for multiple texts"""
    try:
        embeddings = model.encode(
            texts,
            convert_to_tensor=False,
            show_progress_bar=show_progress_bar
        )
        return [emb.tolist() for emb in embeddings]
    except Exception as e:
        print(f"Error generating batch embeddings: {e}")
        raise


def get_embedding_dimension() -> int:
    """Get the dimension of embeddings"""
    return model.get_sentence_embedding_dimension()