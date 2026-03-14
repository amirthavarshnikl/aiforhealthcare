from sentence_transformers import SentenceTransformer
from typing import List
import asyncio
import logging

logger = logging.getLogger(__name__)

# Lazy-load the embedding model to avoid heavy import-time overhead
MODEL_NAME = "all-MiniLM-L6-v2"
_model = None


def get_embedding_model() -> SentenceTransformer:
    """Lazy initialize the embedding model."""
    global _model
    if _model is None:
        logger.info(f"Loading embeddings model: {MODEL_NAME}")
        _model = SentenceTransformer(MODEL_NAME)
        logger.info(f"Embeddings model loaded: {MODEL_NAME}")
    return _model


async def generate_embedding(text: str) -> List[float]:
    """
    Generate embedding for a single text (CPU-bound, runs in thread pool)

    Args:
        text: Text to encode

    Returns:
        Embedding vector as list of floats
    """
    try:
        model = get_embedding_model()
        # Run CPU-intensive operation in thread pool to avoid blocking event loop
        embedding = await asyncio.to_thread(
            model.encode,
            text,
            convert_to_tensor=False
        )
        return embedding.tolist()
    except Exception as e:
        logger.error(f"Error generating embedding: {e}", exc_info=True)
        raise


async def generate_embeddings_batch(
    texts: List[str],
    show_progress_bar: bool = False
) -> List[List[float]]:
    """
    Generate embeddings for multiple texts (CPU-bound, runs in thread pool)

    Args:
        texts: List of texts to encode
        show_progress_bar: Whether to show progress bar

    Returns:
        List of embedding vectors
    """
    try:
        model = get_embedding_model()
        # Run CPU-intensive operation in thread pool to avoid blocking event loop
        embeddings = await asyncio.to_thread(
            model.encode,
            texts,
            convert_to_tensor=False,
            show_progress_bar=show_progress_bar
        )
        return [emb.tolist() for emb in embeddings]
    except Exception as e:
        logger.error(f"Error generating batch embeddings: {e}", exc_info=True)
        raise


def get_embedding_dimension() -> int:
    """Get the dimension of embeddings"""
    return model.get_sentence_embedding_dimension()