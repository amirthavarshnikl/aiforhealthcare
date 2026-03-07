import logging
import asyncio
import time
from typing import Dict, Any, Optional, List
from datetime import datetime
from fastapi import UploadFile
from enum import Enum
import uuid

# Import services
from services.ocr_service import process_medical_report as ocr_process_file
from services.simplify_service import simplify_medical_text
from services.translate_service import translate_text, get_language_info

# Import database modules
from database.mongodb import save_report, update_report, get_report
from database.embeddings import generate_embedding
from database.vectordb import add_embeddings

# Initialize logger
logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)

if not logger.handlers:
    handler = logging.FileHandler("report_pipeline.log")
    formatter = logging.Formatter(
        "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
    )
    handler.setFormatter(formatter)
    logger.addHandler(handler)


# ============================================================================
# ENUMS & CONSTANTS
# ============================================================================

class PipelineStatus(str, Enum):
    """Pipeline execution status stages"""
    PENDING = "pending"
    OCR_IN_PROGRESS = "ocr_in_progress"
    OCR_COMPLETE = "ocr_complete"
    SIMPLIFY_IN_PROGRESS = "simplify_in_progress"
    SIMPLIFY_COMPLETE = "simplify_complete"
    TRANSLATE_IN_PROGRESS = "translate_in_progress"
    TRANSLATE_COMPLETE = "translate_complete"
    EMBEDDING_IN_PROGRESS = "embedding_in_progress"
    EMBEDDING_COMPLETE = "embedding_complete"
    STORAGE_IN_PROGRESS = "storage_in_progress"
    COMPLETE = "complete"
    FAILED = "failed"
    PARTIAL = "partial"


class PipelineStep(str, Enum):
    """Pipeline processing steps"""
    OCR = "ocr"
    SIMPLIFY = "simplify"
    TRANSLATE = "translate"
    EMBEDDING = "embedding"
    STORAGE = "storage"


# ============================================================================
# PIPELINE STATE & TRACKING
# ============================================================================

class PipelineContext:
    """Maintains state throughout the pipeline execution"""

    def __init__(self, user_id: str, file_name: str, target_language: str):
        self.report_id: Optional[str] = None
        self.user_id: str = user_id
        self.file_name: str = file_name
        self.target_language: str = target_language.lower()
        self.status: PipelineStatus = PipelineStatus.PENDING
        self.created_at: datetime = datetime.now()
        self.updated_at: datetime = datetime.now()

        # Results from each step
        self.ocr_result: Optional[Dict[str, Any]] = None
        self.simplify_result: Optional[Dict[str, Any]] = None
        self.translate_result: Optional[Dict[str, Any]] = None
        self.embedding_id: Optional[str] = None

        # Extracted data
        self.original_text: str = ""
        self.simplified_text: str = ""
        self.translated_text: str = ""
        self.summary: str = ""
        self.key_findings: List[str] = []

        # Error tracking
        self.errors: Dict[PipelineStep, str] = {}
        self.warnings: Dict[PipelineStep, str] = {}

    def set_status(self, status: PipelineStatus):
        """Update pipeline status"""
        self.status = status
        self.updated_at = datetime.now()
        logger.info(f"Pipeline status: {status.value} (Report: {self.report_id})")

    def add_error(self, step: PipelineStep, error: str):
        """Record error from a step"""
        self.errors[step] = error
        logger.error(f"Error in {step.value}: {error}")

    def add_warning(self, step: PipelineStep, warning: str):
        """Record warning from a step"""
        self.warnings[step] = warning
        logger.warning(f"Warning in {step.value}: {warning}")

    def has_critical_errors(self) -> bool:
        """Check if critical errors exist (OCR or storage failures)"""
        return (
            PipelineStep.OCR in self.errors or
            PipelineStep.STORAGE in self.errors
        )

    def can_continue_after_error(self, step: PipelineStep) -> bool:
        """Check if pipeline can continue after a step fails"""
        # Can continue if simplify/translate/embedding fail
        # Cannot continue if OCR or storage fails
        return step not in [PipelineStep.OCR, PipelineStep.STORAGE]

    def to_dict(self) -> Dict[str, Any]:
        """Convert context to dictionary for storage"""
        return {
            "user_id": self.user_id,
            "file_name": self.file_name,
            "original_text": self.original_text,
            "simplified_text": self.simplified_text,
            "translated_text": self.translated_text,
            "summary": self.summary,
            "key_findings": self.key_findings,
            "language": self.target_language,
            "status": self.status.value,
            "errors": self.errors,
            "warnings": self.warnings,
            "embedding_id": self.embedding_id,
            "created_at": self.created_at,
            "updated_at": self.updated_at
        }


# ============================================================================
# PIPELINE STEP FUNCTIONS
# ============================================================================

async def execute_ocr_step(
    context: PipelineContext,
    file: UploadFile
) -> bool:
    """
    Execute OCR processing step

    Args:
        context: Pipeline context
        file: Uploaded file

    Returns:
        True if successful, False otherwise
    """
    logger.info(f"Starting OCR step (Report: {context.report_id})...")
    context.set_status(PipelineStatus.OCR_IN_PROGRESS)

    try:
        # Call OCR service
        result = await ocr_process_file(file)

        # Store result
        context.ocr_result = result

        if not result.get("success"):
            error_msg = result.get("error", "Unknown OCR error")
            context.add_error(PipelineStep.OCR, error_msg)
            logger.error(f"OCR failed: {error_msg}")
            return False

        # Extract text
        context.original_text = result.get("text", "")

        if not context.original_text:
            error_msg = "OCR returned empty text"
            context.add_error(PipelineStep.OCR, error_msg)
            logger.error(error_msg)
            return False

        # Log validation info
        validation = result.get("validation", {})
        confidence = result.get("confidence", 0)
        logger.info(
            f"✓ OCR complete: {len(context.original_text)} characters, "
            f"confidence: {confidence:.2f}, pages: {result.get('page_count', 1)}"
        )

        context.set_status(PipelineStatus.OCR_COMPLETE)
        return True

    except Exception as e:
        error_msg = f"OCR exception: {str(e)}"
        context.add_error(PipelineStep.OCR, error_msg)
        logger.error(f"✗ {error_msg}", exc_info=True)
        return False


async def execute_simplify_step(context: PipelineContext) -> bool:
    """
    Execute medical text simplification step

    Args:
        context: Pipeline context

    Returns:
        True if successful, False otherwise
    """
    logger.info(f"Starting simplification step (Report: {context.report_id})...")
    context.set_status(PipelineStatus.SIMPLIFY_IN_PROGRESS)

    try:
        # Call simplify service
        result = await simplify_medical_text(context.original_text)

        # Store result
        context.simplify_result = result

        if result.get("error"):
            error_msg = result["error"]
            # Simplification failure is non-critical, warn but continue
            context.add_warning(PipelineStep.SIMPLIFY, error_msg)
            logger.warning(f"Simplification warning: {error_msg}")
            # Fallback to original text
            context.simplified_text = context.original_text
        else:
            # Extract simplified text
            context.simplified_text = result.get("simplified_text", "")
            context.summary = result.get("summary", "")
            context.key_findings = result.get("key_findings", [])

            logger.info(
                f"✓ Simplification complete: {len(context.original_text)} → "
                f"{len(context.simplified_text)} characters"
            )

        context.set_status(PipelineStatus.SIMPLIFY_COMPLETE)
        return True

    except Exception as e:
        error_msg = f"Simplification exception: {str(e)}"
        # Non-critical error, warn but continue
        context.add_warning(PipelineStep.SIMPLIFY, error_msg)
        logger.warning(f"Simplification warning: {error_msg}", exc_info=True)
        # Fallback to original text
        context.simplified_text = context.original_text
        context.set_status(PipelineStatus.SIMPLIFY_COMPLETE)
        return True


async def execute_translation_step(context: PipelineContext) -> bool:
    """
    Execute translation step

    Args:
        context: Pipeline context

    Returns:
        True if successful, False otherwise
    """
    logger.info(
        f"Starting translation step to {context.target_language} "
        f"(Report: {context.report_id})..."
    )
    context.set_status(PipelineStatus.TRANSLATE_IN_PROGRESS)

    try:
        # Check if translation is needed
        if context.target_language == "en" or context.target_language == "english":
            logger.info("English selected, skipping translation")
            context.translated_text = context.simplified_text
            context.set_status(PipelineStatus.TRANSLATE_COMPLETE)
            return True

        # Call translation service
        result = await translate_text(
            context.simplified_text,
            context.target_language
        )

        # Store result
        context.translate_result = result

        if not result.get("success"):
            error_msg = result.get("error", "Unknown translation error")
            # Translation failure is non-critical, warn but continue
            context.add_warning(PipelineStep.TRANSLATE, error_msg)
            logger.warning(f"Translation warning: {error_msg}")

            # Log detailed error for debugging
            if "GEMINI_API_KEY" in error_msg or "not set" in error_msg:
                logger.error(
                    "❌ TRANSLATION SKIPPED: Gemini API key not configured. "
                    "To enable translation, set GEMINI_API_KEY in backend/.env "
                    "See: https://makersuite.google.com/app/apikey"
                )

            # Fallback to simplified text
            context.translated_text = context.simplified_text
        else:
            # Extract translated text
            context.translated_text = result.get("translated_text", "")

            logger.info(
                f"✓ Translation complete to {context.target_language}: "
                f"{len(context.translated_text)} characters"
            )

        context.set_status(PipelineStatus.TRANSLATE_COMPLETE)
        return True

    except Exception as e:
        error_msg = f"Translation exception: {str(e)}"
        # Non-critical error, warn but continue
        context.add_warning(PipelineStep.TRANSLATE, error_msg)
        logger.warning(f"Translation warning: {error_msg}", exc_info=True)
        if "GEMINI_API_KEY" in str(e):
            logger.error(
                "❌ TRANSLATION FAILED: Gemini API key configuration issue. "
                "Set GEMINI_API_KEY in backend/.env"
            )
        # Fallback to simplified text
        context.translated_text = context.simplified_text
        context.set_status(PipelineStatus.TRANSLATE_COMPLETE)
        return True


async def execute_embedding_step(context: PipelineContext) -> bool:
    """
    Execute embedding generation step

    Args:
        context: Pipeline context

    Returns:
        True if successful, False otherwise
    """
    logger.info(f"Starting embedding generation (Report: {context.report_id})...")
    context.set_status(PipelineStatus.EMBEDDING_IN_PROGRESS)

    try:
        # Generate embedding from simplified text
        embedding = await generate_embedding(context.simplified_text)

        if not embedding or len(embedding) == 0:
            error_msg = "Embedding generation returned empty result"
            context.add_warning(PipelineStep.EMBEDDING, error_msg)
            logger.warning(f"Embedding warning: {error_msg}")
            context.set_status(PipelineStatus.EMBEDDING_COMPLETE)
            return True

        # Prepare metadata
        metadata = {
            "report_id": context.report_id,
            "user_id": context.user_id,
            "language": context.target_language,
            "source": "medical_report",
            "created_at": context.created_at.isoformat()
        }

        # Add to vector database
        success = await add_embeddings(
            ids=[context.report_id],
            embeddings=[embedding],
            documents=[context.simplified_text],
            metadata=[metadata]
        )

        if not success:
            error_msg = "Failed to add embedding to vector database"
            context.add_warning(PipelineStep.EMBEDDING, error_msg)
            logger.warning(f"Embedding warning: {error_msg}")
        else:
            context.embedding_id = context.report_id
            logger.info(
                f"✓ Embedding generated and stored: "
                f"dimension={len(embedding)}"
            )

        context.set_status(PipelineStatus.EMBEDDING_COMPLETE)
        return True

    except Exception as e:
        error_msg = f"Embedding exception: {str(e)}"
        # Non-critical error, warn but continue
        context.add_warning(PipelineStep.EMBEDDING, error_msg)
        logger.warning(f"Embedding warning: {error_msg}", exc_info=True)
        context.set_status(PipelineStatus.EMBEDDING_COMPLETE)
        return True


async def execute_storage_step(context: PipelineContext) -> bool:
    """
    Execute MongoDB storage step

    Args:
        context: Pipeline context

    Returns:
        True if successful, False otherwise
    """
    logger.info(f"Starting storage step (Report: {context.report_id})...")
    context.set_status(PipelineStatus.STORAGE_IN_PROGRESS)

    try:
        # Prepare report data
        report_data = {
            "user_id": context.user_id,
            "file_name": context.file_name,
            "original_text": context.original_text,
            "simplified_text": context.simplified_text,
            "translated_text": context.translated_text,
            "summary": context.summary,
            "key_findings": context.key_findings,
            "language": context.target_language,
            "embedding_id": context.embedding_id,
            "status": "complete" if not context.has_critical_errors() else "partial",
            "errors": dict(context.errors),
            "warnings": dict(context.warnings),
            "created_at": context.created_at,
            "updated_at": datetime.now()
        }

        # Update report in MongoDB
        success = await update_report(context.report_id, report_data)

        if not success:
            error_msg = "Failed to update report in MongoDB"
            context.add_error(PipelineStep.STORAGE, error_msg)
            logger.error(f"✗ {error_msg}")
            return False

        logger.info(f"✓ Report stored in MongoDB: {context.report_id}")
        context.set_status(PipelineStatus.COMPLETE)
        return True

    except Exception as e:
        error_msg = f"Storage exception: {str(e)}"
        context.add_error(PipelineStep.STORAGE, error_msg)
        logger.error(f"✗ {error_msg}", exc_info=True)
        return False


# ============================================================================
# MAIN PIPELINE ORCHESTRATOR
# ============================================================================

async def process_medical_report(
    file: UploadFile,
    user_id: str,
    target_language: str = "en"
) -> Dict[str, Any]:
    """
    Main pipeline function: orchestrates entire medical report processing

    Args:
        file: Uploaded medical report file (UploadFile from FastAPI)
        user_id: ID of the patient/user
        target_language: Target language for translation (default: English)

    Returns:
        {
            "success": bool,
            "report_id": str,
            "status": str,
            "data": {
                "user_id": str,
                "file_name": str,
                "original_text": str,
                "simplified_text": str,
                "translated_text": str,
                "summary": str,
                "key_findings": List[str],
                "language": str
            },
            "metadata": {
                "steps_completed": List[str],
                "steps_failed": List[str],
                "created_at": datetime,
                "processing_time": float
            },
            "error": str | None
        }
    """
    start_time = time.time()

    logger.info("="*70)
    logger.info("Starting medical report processing pipeline...")
    logger.info(f"User: {user_id}, File: {file.filename}, Language: {target_language}")
    logger.info("="*70)

    # Initialize context
    context = PipelineContext(user_id, file.filename, target_language)

    try:
        # ==================== STEP 1: Create Report Record ====================
        logger.info("Creating report record in MongoDB...")

        initial_report_data = {
            "user_id": user_id,
            "file_name": file.filename,
            "original_text": "",
            "simplified_text": "",
            "translated_text": "",
            "language": target_language.lower(),
            "status": "processing",
            "created_at": context.created_at,
            "updated_at": context.created_at
        }

        report_id = await save_report(initial_report_data)
        if not report_id:
            error_msg = "Failed to create report record in MongoDB"
            logger.error(f"✗ {error_msg}")
            return {
                "success": False,
                "report_id": None,
                "status": "failed",
                "data": {},
                "metadata": {
                    "steps_completed": [],
                    "steps_failed": ["database_init"],
                    "created_at": context.created_at,
                    "processing_time": time.time() - start_time
                },
                "error": error_msg
            }

        context.report_id = str(report_id)
        logger.info(f"✓ Report record created: {context.report_id}")

        # ==================== STEP 2: OCR Processing ====================
        ocr_success = await execute_ocr_step(context, file)
        if not ocr_success:
            context.set_status(PipelineStatus.FAILED)
            logger.error("Pipeline failed: OCR step failed")
            return build_error_response(context, start_time)

        # ==================== STEP 3: Simplification ====================
        await execute_simplify_step(context)

        # ==================== STEP 4: Translation ====================
        await execute_translation_step(context)

        # ==================== STEP 5: Embedding ====================
        await execute_embedding_step(context)

        # ==================== STEP 6: Storage ====================
        storage_success = await execute_storage_step(context)
        if not storage_success:
            logger.error("Pipeline failed: Storage step failed")
            return build_error_response(context, start_time)

        # ==================== SUCCESS ====================
        processing_time = time.time() - start_time

        logger.info("="*70)
        logger.info("✓ Pipeline completed successfully")
        logger.info(f"Report ID: {context.report_id}")
        logger.info(f"Processing time: {processing_time:.2f}s")
        logger.info("="*70)

        return {
            "success": True,
            "report_id": context.report_id,
            "status": context.status.value,
            "data": {
                "user_id": context.user_id,
                "file_name": context.file_name,
                "original_text": context.original_text,
                "simplified_text": context.simplified_text,
                "translated_text": context.translated_text,
                "summary": context.summary,
                "key_findings": context.key_findings,
                "language": context.target_language
            },
            "metadata": {
                "steps_completed": [
                    "ocr",
                    "simplify" if not (PipelineStep.SIMPLIFY in context.errors) else None,
                    "translate" if not (PipelineStep.TRANSLATE in context.errors) else None,
                    "embedding" if not (PipelineStep.EMBEDDING in context.errors) else None,
                    "storage"
                ],
                "steps_failed": list(context.errors.keys()),
                "warnings": dict(context.warnings),
                "created_at": context.created_at,
                "processing_time": processing_time
            },
            "error": None
        }

    except Exception as e:
        error_msg = f"Pipeline exception: {str(e)}"
        context.add_error(PipelineStep.OCR, error_msg)
        logger.error(f"✗ {error_msg}", exc_info=True)
        return build_error_response(context, start_time)


def build_error_response(
    context: PipelineContext,
    start_time: float
) -> Dict[str, Any]:
    """
    Build error response for failed pipeline

    Args:
        context: Pipeline context with error information
        start_time: Pipeline start time for calculating duration

    Returns:
        Structured error response
    """
    processing_time = time.time() - start_time

    return {
        "success": False,
        "report_id": context.report_id,
        "status": context.status.value,
        "data": {
            "user_id": context.user_id,
            "file_name": context.file_name,
            "original_text": context.original_text,
            "simplified_text": context.simplified_text,
            "translated_text": context.translated_text,
            "summary": context.summary,
            "key_findings": context.key_findings,
            "language": context.target_language
        },
        "metadata": {
            "steps_completed": [],
            "steps_failed": list(context.errors.keys()),
            "warnings": dict(context.warnings),
            "created_at": context.created_at,
            "processing_time": processing_time,
            "errors": dict(context.errors)
        },
        "error": "; ".join(context.errors.values()) if context.errors else "Unknown error"
    }


# ============================================================================
# UTILITY FUNCTIONS
# ============================================================================

async def get_pipeline_status(report_id: str) -> Dict[str, Any]:
    """
    Get current status of a pipeline execution

    Args:
        report_id: Report ID to check

    Returns:
        Pipeline status and progress
    """
    logger.debug(f"Fetching pipeline status for report: {report_id}")

    try:
        report = await get_report(report_id)

        if not report:
            return {
                "status": "not_found",
                "report_id": report_id,
                "error": "Report not found"
            }

        return {
            "status": report.get("status", "unknown"),
            "report_id": report_id,
            "created_at": report.get("created_at"),
            "updated_at": report.get("updated_at"),
            "progress": 100 if report.get("status") == "complete" else 50,
            "errors": report.get("errors", {}),
            "warnings": report.get("warnings", {})
        }

    except Exception as e:
        logger.error(f"Error fetching pipeline status: {str(e)}")
        return {
            "status": "error",
            "report_id": report_id,
            "error": str(e)
        }


async def retry_failed_pipeline(report_id: str) -> Dict[str, Any]:
    """
    Retry processing a failed report

    Note: Requires re-uploading the file, so this is a placeholder
    for future implementation with stored file references

    Args:
        report_id: Report ID to retry

    Returns:
        Status of retry operation
    """
    logger.warning(f"Retry requested for report: {report_id}")
    logger.warning("Retry not implemented - requires file re-upload")

    return {
        "success": False,
        "report_id": report_id,
        "error": "Retry requires re-uploading the file. Please upload the report again."
    }


def validate_language(language: str) -> tuple[bool, str]:
    """
    Validate language parameter

    Args:
        language: Language name/code

    Returns:
        Tuple of (is_valid, error_message)
    """
    from services.translate_service import is_language_supported

    language_lower = language.lower().strip()

    # Allow English as always valid
    if language_lower in ["en", "english"]:
        return True, ""

    # Check if language is in supported languages
    if is_language_supported(language_lower):
        return True, ""

    return False, f"Unsupported language: {language}"


def validate_user_id(user_id: str) -> tuple[bool, str]:
    """
    Validate user ID parameter

    Args:
        user_id: User ID to validate

    Returns:
        Tuple of (is_valid, error_message)
    """
    if not user_id or not isinstance(user_id, str):
        return False, "User ID must be a non-empty string"

    if len(user_id.strip()) == 0:
        return False, "User ID cannot be empty"

    return True, ""


async def test_pipeline() -> Dict[str, Any]:
    """
    Test the pipeline with a sample file

    Note: This is for debugging purposes
    """
    logger.info("Testing pipeline with sample data...")
    logger.warning("Pipeline test function requires an actual uploaded file")

    return {
        "message": "Pipeline test requires uploading an actual file",
        "suggestion": "Use the /upload-report endpoint with a real medical report file"
    }


# ============================================================================
# MODULE EXPORTS
# ============================================================================

__all__ = [
    "process_medical_report",
    "get_pipeline_status",
    "retry_failed_pipeline",
    "validate_language",
    "validate_user_id",
    "PipelineStatus",
    "PipelineStep",
    "PipelineContext"
]
