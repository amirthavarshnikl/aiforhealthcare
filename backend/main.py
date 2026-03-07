from fastapi import FastAPI, HTTPException, Depends, status, UploadFile, File, APIRouter, Form
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from datetime import datetime
from typing import List, Optional
import os

# IMPORTANT: Load environment variables FIRST before importing other modules
from config import settings

# Import database connections
from database.mongodb import (
    MongoDBConnection,
    save_report,
    get_report,
    get_user_reports,
    update_report,
    delete_report,
    save_user,
    get_user,
    get_user_by_email,
    update_user,
    delete_user
)

from database.vectordb import (
    VectorDBConnection,
    add_embeddings,
    query_embeddings,
    get_collection_count
)

from database.embeddings import generate_embedding, generate_embeddings_batch
from services.report_pipeline import process_medical_report
from services.rag_service import answer_medical_question

# Import models
from models import (
    UserCreate, UserResponse, ReportCreate, ReportUpdate, ReportResponse,
    EmbeddingRequest, RagQuery, RagResponse, RagResult, HealthStatus
)

# Lifespan context manager for startup/shutdown
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    print("\n" + "="*50)
    print("🚀 Starting Medical Report AI Backend...")
    print("="*50)

    try:
        # Validate required environment variables
        print("\n📋 Checking required environment variables...")

        gemini_key = os.getenv("GEMINI_API_KEY")
        if not gemini_key or gemini_key == "your_gemini_api_key_here":
            print("\n⚠️  WARNING: GEMINI_API_KEY not properly configured!")
            print("   AI translation and simplification will not work.")
            print("   To configure: Set GEMINI_API_KEY in backend/.env")
            print("   Get your key from: https://makersuite.google.com/app/apikey")
        else:
            print("✓ GEMINI_API_KEY configured")

        MongoDBConnection.connect()
        VectorDBConnection.connect()
        print("\n✓ All systems initialized successfully!")
        print("="*50 + "\n")
    except Exception as e:
        print(f"\n✗ Startup failed: {e}")
        raise

    yield

    # Shutdown
    print("\n" + "="*50)
    print("🛑 Shutting down Medical Report AI Backend...")
    print("="*50)
    MongoDBConnection.disconnect()
    VectorDBConnection.disconnect()
    print("="*50 + "\n")


# Create FastAPI app
app = FastAPI(
    title="Medical Report AI Backend",
    description="AI-powered medical report processing with RAG",
    version="1.0.0",
    lifespan=lifespan
)

# Create API router with /api prefix
api_router = APIRouter(prefix="/api", tags=["API"])


# Add CORS middleware
# Allowed frontend origins (supports development on multiple ports)
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:8000",  # Frontend serving from same port
    "http://127.0.0.1:8000",
    "http://localhost:5500",  # Live Server (VS Code)
    "http://localhost:5173",  # Vite dev server
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================================
# HEALTH CHECK ENDPOINTS
# ============================================================================

@api_router.get("/health", response_model=HealthStatus)
async def health_check():
    """Check backend health status"""
    db = MongoDBConnection.get_db()

    mongodb_status = False
    try:
        db.client.admin.command("ping")
        mongodb_status = True
    except Exception:
        pass

    return HealthStatus(
        status="healthy",
        mongodb=mongodb_status,
        vectordb=VectorDBConnection.get_collection() is not None,
        embeddings=True,
        timestamp=datetime.now()
    )


@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Medical Report AI Backend Running",
        "docs": "/docs",
        "health": "/api/health"
    }


# ============================================================================
# USER ENDPOINTS
# ============================================================================

@api_router.post("/users", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def create_user(user: UserCreate):
    """Create a new user"""
    try:
        # Check if user already exists
        existing_user = await get_user_by_email(user.email)
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="User with this email already exists"
            )

        user_data = {
            "name": user.name,
            "email": user.email,
            "password": user.password,  # TODO: Hash password in production
            "created_at": datetime.now()
        }

        user_id = await save_user(user_data)
        user_data["_id"] = user_id
        return UserResponse(**user_data)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@api_router.get("/users/{user_id}", response_model=UserResponse)
async def read_user(user_id: str):
    """Get user by ID"""
    user = await get_user(user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    return UserResponse(**user)


# ============================================================================
# REPORT ENDPOINTS
# ============================================================================

@api_router.post("/reports", response_model=ReportResponse, status_code=status.HTTP_201_CREATED)
async def create_report(report: ReportCreate):
    """Create and save a medical report"""
    try:
        # Verify user exists
        user = await get_user(report.user_id)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )

        report_data = {
            "user_id": report.user_id,
            "file_name": report.file_name,
            "original_text": report.original_text,
            "simplified_text": report.simplified_text,
            "translated_text": report.translated_text,
            "language": report.language,
            "metadata": report.metadata or {},
            "created_at": datetime.now(),
            "updated_at": datetime.now()
        }

        report_id = await save_report(report_data)
        report_data["_id"] = report_id
        return ReportResponse(**report_data)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@api_router.get("/reports/{report_id}", response_model=ReportResponse)
async def read_report(report_id: str):
    """Get a report by ID"""
    report = await get_report(report_id)
    if not report:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Report not found"
        )
    return ReportResponse(**report)


@api_router.get("/users/{user_id}/reports", response_model=List[ReportResponse])
async def list_user_reports(user_id: str):
    """Get all reports for a user"""
    # Verify user exists
    user = await get_user(user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    reports = await get_user_reports(user_id)
    return [ReportResponse(**report) for report in reports]


@api_router.put("/reports/{report_id}", response_model=ReportResponse)
async def update_report_endpoint(report_id: str, report_update: ReportUpdate):
    """Update a report"""
    try:
        # Check if report exists
        existing_report = await get_report(report_id)
        if not existing_report:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Report not found"
            )

        update_data = {
            k: v for k, v in report_update.dict().items()
            if v is not None
        }
        update_data["updated_at"] = datetime.now()

        success = await update_report(report_id, update_data)
        if not success:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to update report"
            )

        updated_report = await get_report(report_id)
        return ReportResponse(**updated_report)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@api_router.delete("/reports/{report_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_report_endpoint(report_id: str):
    """Delete a report"""
    try:
        # Check if report exists
        existing_report = await get_report(report_id)
        if not existing_report:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Report not found"
            )

        success = await delete_report(report_id)
        if not success:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to delete report"
            )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


# ============================================================================
# EMBEDDING & RAG ENDPOINTS
# ============================================================================

@api_router.post("/embeddings/generate")
async def generate_embedding_endpoint(request: EmbeddingRequest):
    """Generate embedding for text"""
    try:
        embedding = await generate_embedding(request.text)
        return {
            "text": request.text,
            "embedding": embedding,
            "dimension": len(embedding)
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@api_router.post("/embeddings/batch")
async def generate_batch_embeddings(texts: List[str]):
    """Generate embeddings for multiple texts"""
    try:
        embeddings = await generate_embeddings_batch(texts, show_progress_bar=False)
        return {
            "count": len(embeddings),
            "texts": texts,
            "embeddings": embeddings
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@api_router.post("/rag/query", response_model=RagResponse)
async def rag_query(query: RagQuery):
    """
    Query the vector database using RAG with full medical context

    Uses semantic search and Gemini AI to answer patient questions
    about their medical reports.
    """
    try:
        # Use the full RAG service for comprehensive question answering
        result = await answer_medical_question(
            question=query.query,
            user_id=query.filters.get("user_id") if query.filters else "demo_user"
        )

        return RagResponse(
            results=[RagResult(**result)],
            query=query.query,
            count=1
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@api_router.post("/rag/add")
async def add_rag_documents(
    ids: List[str],
    documents: List[str],
    metadata: List[dict] = None
):
    """Add documents to RAG database"""
    try:
        if len(ids) != len(documents):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Number of IDs must match number of documents"
            )

        # Generate embeddings
        embeddings = await generate_embeddings_batch(documents)

        # Add to vector database
        success = await add_embeddings(
            ids=ids,
            embeddings=embeddings,
            documents=documents,
            metadata=metadata
        )

        if not success:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to add documents"
            )

        return {
            "message": "Documents added successfully",
            "count": len(ids)
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@api_router.get("/rag/stats")
async def rag_stats():
    """Get RAG database statistics"""
    try:
        count = await get_collection_count()
        return {
            "collection_name": "medical_knowledge",
            "document_count": count
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


# ============================================================================
# REPORT SUMMARY & TRANSLATION ENDPOINTS
# ============================================================================

@api_router.get("/reports/{report_id}/summary")
async def get_report_summary(report_id: str):
    """Get simplified summary and findings for a report"""
    try:
        report = await get_report(report_id)
        if not report:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Report not found"
            )

        # Extract key data for summary display
        summary_data = {
            "report_id": report_id,
            "metadata": report.get("metadata", {}),
            "medical_summary": report.get("simplified_text", ""),
            "original_text": report.get("original_text", ""),
            "language": report.get("language", "English"),
            "created_at": report.get("created_at"),
            "updated_at": report.get("updated_at")
        }

        return summary_data
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@api_router.get("/reports/{report_id}/translation")
async def get_report_translation(report_id: str, language: str = "English"):
    """Get translated content for a report"""
    try:
        report = await get_report(report_id)
        if not report:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Report not found"
            )

        # Extract translation data
        translation_data = {
            "report_id": report_id,
            "language": language,
            "metadata": report.get("metadata", {}),
            "translated_text": report.get("translated_text", ""),
            "simplified_text": report.get("simplified_text", ""),
            "original_text": report.get("original_text", ""),
            "created_at": report.get("created_at"),
            "updated_at": report.get("updated_at")
        }

        return translation_data
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


# ============================================================================
# AI MEDICAL REPORT PROCESSING ENDPOINT
# ============================================================================

@api_router.post("/upload-report")
async def upload_medical_report(
    file: UploadFile = File(...),
    language: str = Form("English"),
    user_id: str = Form("demo_user"),
    report_name: str = Form(default=""),
    report_type: str = Form(default=""),
    report_date: str = Form(default=""),
    patient_name: str = Form(default="")
):
    """
    Upload medical report and run full AI pipeline

    Pipeline:
    Upload → OCR → Simplify → Translate → Embed → Store

    Parameters:
    - file: Medical report file (PDF, JPG, PNG, WEBP)
    - language: Target language for translation
    - user_id: User ID for tracking reports
    - report_name: Custom name for the report
    - report_type: Type of report (Blood Work, X-Ray, etc.)
    - report_date: Date of the report
    - patient_name: Patient name (for metadata)
    """

    try:
        # Process the medical report through the full pipeline
        result = await process_medical_report(
            file=file,
            user_id=user_id,
            target_language=language
        )

        # Add metadata to the result
        result["metadata"] = {
            "report_name": report_name,
            "report_type": report_type,
            "report_date": report_date,
            "patient_name": patient_name,
            "uploaded_at": datetime.now().isoformat()
        }

        return result

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


# ============================================================================
# REGISTER API ROUTER
# ============================================================================

app.include_router(api_router)
