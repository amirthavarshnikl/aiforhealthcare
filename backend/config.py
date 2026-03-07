import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()


class Settings:
    # MongoDB
    MONGO_URI: str = os.getenv("MONGO_URI", "mongodb://localhost:27017")
    DB_NAME: str = os.getenv("DB_NAME", "medicalreport")

    # Vector Database
    VECTOR_DB_PATH: str = os.getenv("VECTOR_DB_PATH", "./data/vector-db")

    # FastAPI
    DEBUG: bool = os.getenv("DEBUG", "False").lower() == "true"
    HOST: str = os.getenv("HOST", "0.0.0.0")
    PORT: int = int(os.getenv("PORT", "8000"))

    # Embedding Model
    EMBEDDING_MODEL: str = "all-MiniLM-L6-v2"
    EMBEDDING_DIMENSION: int = 384

    # Vector DB
    COLLECTION_NAME: str = "medical_knowledge"
    VECTOR_SEARCH_METRIC: str = "cosine"

    @classmethod
    def get_db_url(cls) -> str:
        """Get database URL"""
        return cls.MONGO_URI

    @classmethod
    def is_production(cls) -> bool:
        """Check if running in production"""
        return not cls.DEBUG


# Create global settings instance
settings = Settings()
