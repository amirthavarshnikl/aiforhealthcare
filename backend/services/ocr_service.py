import easyocr
import logging
from typing import Dict, Any, Optional, List
from io import BytesIO
from fastapi import UploadFile
import os

# PDF handling
try:
    import pdf2image
    PDF_SUPPORT = True
except ImportError:
    PDF_SUPPORT = False
    logging.warning("pdf2image not installed. PDF support disabled.")

# Initialize logger
logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)

# Setup file handler
if not logger.handlers:
    handler = logging.FileHandler("ocr_service.log")
    formatter = logging.Formatter(
        "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
    )
    handler.setFormatter(formatter)
    logger.addHandler(handler)

# Initialize EasyOCR reader (lazy loaded)
_ocr_reader = None

def get_ocr_reader():
    """Lazy load OCR reader to avoid initialization overhead on import"""
    global _ocr_reader
    if _ocr_reader is None:
        logger.info("Initializing EasyOCR reader...")
        try:
            _ocr_reader = easyocr.Reader(
                ["en"],
                gpu=False,  # Set to True if GPU available
                model_storage_directory=os.path.join(
                    os.path.dirname(__file__), "../../models/easyocr"
                )
            )
            logger.info("✓ EasyOCR reader initialized successfully")
        except Exception as e:
            logger.error(f"Failed to initialize EasyOCR reader: {e}")
            raise
    return _ocr_reader


# ============================================================================
# VALIDATION FUNCTIONS
# ============================================================================

def validate_file_type(filename: str) -> tuple[bool, str]:
    """
    Validate if file type is supported

    Args:
        filename: Name of the file

    Returns:
        Tuple of (is_valid, file_type) where file_type is 'image' or 'pdf'
    """
    logger.debug(f"Validating file type: {filename}")

    supported_image_formats = {".jpg", ".jpeg", ".png"}
    supported_pdf_formats = {".pdf"}

    file_ext = os.path.splitext(filename)[1].lower()

    if file_ext in supported_image_formats:
        logger.debug(f"✓ File {filename} is a valid image format")
        return True, "image"
    elif file_ext in supported_pdf_formats:
        if not PDF_SUPPORT:
            logger.error("PDF support not available (pdf2image not installed)")
            return False, "pdf"
        logger.debug(f"✓ File {filename} is a valid PDF format")
        return True, "pdf"
    else:
        logger.warning(f"✗ Unsupported file format: {file_ext}")
        return False, ""


def validate_file_size(file_bytes: bytes, max_size_mb: int = 50) -> bool:
    """
    Validate file size

    Args:
        file_bytes: File content as bytes
        max_size_mb: Maximum allowed size in MB

    Returns:
        True if file size is valid
    """
    file_size_mb = len(file_bytes) / (1024 * 1024)
    logger.debug(f"File size: {file_size_mb:.2f} MB (max: {max_size_mb} MB)")

    if file_size_mb > max_size_mb:
        logger.error(f"✗ File size {file_size_mb:.2f}MB exceeds limit of {max_size_mb}MB")
        return False

    logger.debug("✓ File size is valid")
    return True


def validate_text_extraction(text: str) -> Dict[str, Any]:
    """
    Validate quality of extracted text

    Args:
        text: Extracted text to validate

    Returns:
        Dictionary with validation results

        {
            "is_valid": bool,
            "confidence_score": float (0-1),
            "quality_metrics": {
                "character_count": int,
                "word_count": int,
                "line_count": int,
                "avg_word_length": float,
                "has_medical_keywords": bool
            }
        }
    """
    logger.debug("Validating extracted text quality...")

    if not text or not text.strip():
        logger.warning("✗ Extracted text is empty")
        return {
            "is_valid": False,
            "confidence_score": 0.0,
            "quality_metrics": {},
            "error": "No text extracted"
        }

    # Calculate metrics
    words = text.split()
    lines = text.split('\n')
    word_count = len(words)
    char_count = len(text)
    avg_word_length = char_count / word_count if word_count > 0 else 0

    # Medical keywords to check for authenticity
    medical_keywords = {
        "patient", "doctor", "medical", "diagnosis", "treatment",
        "medication", "symptom", "disease", "hospital", "clinical",
        "examination", "test", "result", "blood", "pressure",
        "temperature", "report", "date", "signature"
    }
    text_lower = text.lower()
    has_medical_keywords = any(keyword in text_lower for keyword in medical_keywords)

    # Calculate confidence score
    confidence_score = 0.5
    if char_count > 100:
        confidence_score += 0.15
    if word_count > 20:
        confidence_score += 0.15
    if 4 <= avg_word_length <= 8:
        confidence_score += 0.1
    if has_medical_keywords:
        confidence_score += 0.1

    is_valid = confidence_score >= 0.4

    metrics = {
        "character_count": char_count,
        "word_count": word_count,
        "line_count": len(lines),
        "avg_word_length": round(avg_word_length, 2),
        "has_medical_keywords": has_medical_keywords
    }

    logger.info(
        f"Text validation: valid={is_valid}, confidence={confidence_score:.2f}, "
        f"words={word_count}, chars={char_count}"
    )

    return {
        "is_valid": is_valid,
        "confidence_score": min(confidence_score, 1.0),
        "quality_metrics": metrics
    }


# ============================================================================
# TEXT PREPROCESSING FUNCTIONS
# ============================================================================

def preprocess_extracted_text(text: str) -> str:
    """
    Clean and normalize extracted text

    Args:
        text: Raw extracted text

    Returns:
        Cleaned and normalized text
    """
    logger.debug("Preprocessing extracted text...")

    if not text:
        return ""

    # Remove multiple newlines
    text = '\n'.join(line for line in text.split('\n') if line.strip())

    # Remove extra whitespace within lines
    lines = [' '.join(line.split()) for line in text.split('\n')]
    text = '\n'.join(lines)

    # Remove leading/trailing whitespace
    text = text.strip()

    logger.debug(f"Text preprocessing complete. Length: {len(text)} characters")
    return text


def merge_page_texts(page_texts: List[str], separator: str = "\n\n") -> str:
    """
    Merge text from multiple pages

    Args:
        page_texts: List of text from each page
        separator: Text to insert between pages

    Returns:
        Combined text from all pages
    """
    logger.debug(f"Merging {len(page_texts)} pages...")

    merged = separator.join(text for text in page_texts if text and text.strip())
    merged = preprocess_extracted_text(merged)

    logger.info(f"✓ Merged {len(page_texts)} pages into {len(merged)} characters")
    return merged


# ============================================================================
# OCR EXTRACTION FUNCTIONS
# ============================================================================

async def extract_text_from_image(
    image_bytes: bytes,
    image_format: str
) -> Dict[str, Any]:
    """
    Extract text from image using EasyOCR

    Args:
        image_bytes: Image file content as bytes
        image_format: Image format (jpg, jpeg, png)

    Returns:
        {
            "text": str,
            "confidence": float,
            "page_count": int,
            "error": str | None,
            "raw_results": list (for debugging)
        }
    """
    logger.info(f"Starting OCR for image file (format: {image_format})...")

    try:
        # Validate file
        if not validate_file_size(image_bytes):
            return {
                "text": "",
                "confidence": 0.0,
                "page_count": 0,
                "error": "File size exceeds maximum allowed"
            }

        # Convert bytes to image
        import numpy as np
        from PIL import Image
        image = Image.open(BytesIO(image_bytes))
        logger.debug(f"Image loaded: size={image.size}, format={image.format}")

        # Convert PIL Image to numpy array for EasyOCR
        image_array = np.array(image)

        # Initialize OCR reader
        reader = get_ocr_reader()

        # Perform OCR - pass numpy array instead of PIL Image
        logger.debug("Running OCR recognition...")
        results = reader.readtext(image_array)

        if not results:
            logger.warning("✗ No text found in image")
            return {
                "text": "",
                "confidence": 0.0,
                "page_count": 1,
                "error": "No text detected in image"
            }

        # Extract text and confidence
        extracted_text = '\n'.join(
            [result[1] for result in results]
        )
        confidences = [result[2] for result in results]
        avg_confidence = sum(confidences) / len(confidences) if confidences else 0.0

        # Preprocess text
        extracted_text = preprocess_extracted_text(extracted_text)

        logger.info(
            f"✓ OCR complete: {len(extracted_text)} characters, "
            f"confidence: {avg_confidence:.2f}"
        )

        return {
            "text": extracted_text,
            "confidence": avg_confidence,
            "page_count": 1,
            "error": None,
            "raw_results": results
        }

    except Exception as e:
        logger.error(f"✗ Error during image OCR: {str(e)}", exc_info=True)
        return {
            "text": "",
            "confidence": 0.0,
            "page_count": 0,
            "error": f"Image OCR failed: {str(e)}"
        }


async def extract_text_from_pdf(pdf_bytes: bytes) -> Dict[str, Any]:
    """
    Extract text from PDF using OCR (converts pages to images first)

    Args:
        pdf_bytes: PDF file content as bytes

    Returns:
        {
            "text": str,
            "page_contents": List[str],
            "total_pages": int,
            "page_confidences": List[float],
            "error": str | None
        }
    """
    logger.info("Starting OCR for PDF file...")

    if not PDF_SUPPORT:
        logger.error("PDF support not available")
        return {
            "text": "",
            "page_contents": [],
            "total_pages": 0,
            "error": "PDF support not available (pdf2image not installed)"
        }

    try:
        # Validate file
        if not validate_file_size(pdf_bytes):
            return {
                "text": "",
                "page_contents": [],
                "total_pages": 0,
                "error": "File size exceeds maximum allowed"
            }

        # Convert PDF to images
        logger.debug("Converting PDF pages to images...")
        pdf_file = BytesIO(pdf_bytes)
        pages = pdf2image.convert_from_bytes(pdf_bytes)
        logger.info(f"✓ Converted PDF to {len(pages)} images")

        # Initialize OCR reader
        reader = get_ocr_reader()

        # Process each page
        page_texts = []
        page_confidences = []

        for page_num, page_image in enumerate(pages, 1):
            logger.debug(f"Processing page {page_num}/{len(pages)}...")

            try:
                # OCR on page
                results = reader.readtext(page_image)

                if results:
                    page_text = '\n'.join([result[1] for result in results])
                    confidences = [result[2] for result in results]
                    avg_confidence = sum(confidences) / len(confidences)
                else:
                    page_text = ""
                    avg_confidence = 0.0

                # Preprocess
                page_text = preprocess_extracted_text(page_text)
                page_texts.append(page_text)
                page_confidences.append(avg_confidence)

                logger.debug(
                    f"Page {page_num} complete: {len(page_text)} chars, "
                    f"confidence: {avg_confidence:.2f}"
                )

            except Exception as e:
                logger.warning(f"Error processing page {page_num}: {str(e)}")
                page_texts.append("")
                page_confidences.append(0.0)

        # Merge all pages
        merged_text = merge_page_texts(page_texts)

        logger.info(
            f"✓ PDF OCR complete: {len(pages)} pages, "
            f"total text: {len(merged_text)} characters"
        )

        return {
            "text": merged_text,
            "page_contents": page_texts,
            "total_pages": len(pages),
            "page_confidences": page_confidences,
            "error": None
        }

    except Exception as e:
        logger.error(f"✗ Error during PDF OCR: {str(e)}", exc_info=True)
        return {
            "text": "",
            "page_contents": [],
            "total_pages": 0,
            "error": f"PDF OCR failed: {str(e)}"
        }


# ============================================================================
# MAIN FASTAPI INTEGRATION FUNCTION
# ============================================================================

async def process_medical_report(file: UploadFile) -> Dict[str, Any]:
    """
    Main function to process uploaded medical report
    Accepts FastAPI UploadFile and returns extracted text

    Args:
        file: FastAPI UploadFile object

    Returns:
        {
            "success": bool,
            "text": str,
            "page_count": int,
            "confidence": float,
            "file_name": str,
            "file_type": str,
            "validation": dict,
            "error": str | None,
            "pages": List[str] (for PDFs)
        }
    """
    logger.info(f"Processing uploaded report: {file.filename}")

    try:
        # Validate file type
        is_valid_type, file_type = validate_file_type(file.filename)
        if not is_valid_type:
            error_msg = f"Unsupported file type: {file.filename}"
            logger.error(f"✗ {error_msg}")
            return {
                "success": False,
                "text": "",
                "page_count": 0,
                "confidence": 0.0,
                "file_name": file.filename,
                "file_type": "",
                "validation": {},
                "error": error_msg,
                "pages": []
            }

        # Read file content
        logger.debug(f"Reading file content...")
        file_bytes = await file.read()
        logger.debug(f"File read complete: {len(file_bytes)} bytes")

        # Process based on file type
        if file_type == "image":
            logger.info(f"Processing as image file...")
            result = await extract_text_from_image(file_bytes, file_type)

            # Validate extracted text
            validation = validate_text_extraction(result["text"])

            return {
                "success": not result.get("error"),
                "text": result["text"],
                "page_count": result["page_count"],
                "confidence": result["confidence"],
                "file_name": file.filename,
                "file_type": file_type,
                "validation": validation,
                "error": result.get("error"),
                "pages": []
            }

        elif file_type == "pdf":
            logger.info(f"Processing as PDF file...")
            result = await extract_text_from_pdf(file_bytes)

            # Validate extracted text
            validation = validate_text_extraction(result["text"])

            avg_confidence = (
                sum(result["page_confidences"]) / len(result["page_confidences"])
                if result["page_confidences"] else 0.0
            )

            return {
                "success": not result.get("error"),
                "text": result["text"],
                "page_count": result["total_pages"],
                "confidence": avg_confidence,
                "file_name": file.filename,
                "file_type": file_type,
                "validation": validation,
                "error": result.get("error"),
                "pages": result["page_contents"]
            }

    except Exception as e:
        error_msg = f"Unexpected error processing report: {str(e)}"
        logger.error(f"✗ {error_msg}", exc_info=True)
        return {
            "success": False,
            "text": "",
            "page_count": 0,
            "confidence": 0.0,
            "file_name": file.filename,
            "file_type": "",
            "validation": {},
            "error": error_msg,
            "pages": []
        }


# ============================================================================
# UTILITY FUNCTIONS
# ============================================================================

def get_supported_formats() -> Dict[str, List[str]]:
    """Get list of supported file formats"""
    return {
        "images": [".jpg", ".jpeg", ".png"],
        "documents": [".pdf"] if PDF_SUPPORT else []
    }


async def batch_process_reports(
    files: List[UploadFile],
    skip_errors: bool = True
) -> Dict[str, Any]:
    """
    Process multiple report files at once

    Args:
        files: List of UploadFile objects
        skip_errors: If True, continue processing even if one file fails

    Returns:
        {
            "processed": int,
            "failed": int,
            "results": List[dict],
            "errors": List[str]
        }
    """
    logger.info(f"Batch processing {len(files)} files...")

    results = []
    errors = []

    for file in files:
        try:
            result = await process_medical_report(file)
            results.append(result)

            if result.get("error") and not skip_errors:
                raise Exception(result["error"])

        except Exception as e:
            error_msg = f"Failed to process {file.filename}: {str(e)}"
            logger.error(error_msg)
            errors.append(error_msg)

            if not skip_errors:
                raise

    logger.info(
        f"✓ Batch processing complete: {len(results)} processed, {len(errors)} failed"
    )

    return {
        "processed": len([r for r in results if r["success"]]),
        "failed": len(errors),
        "results": results,
        "errors": errors
    }
