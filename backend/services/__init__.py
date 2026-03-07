"""
Services package for medical report processing

This package contains all AI processing services:
- ocr_service: Extract text from images and PDFs
- simplify_service: Simplify medical language using Gemini API
- translate_service: Translate reports to Indian languages
- rag_service: Retrieve and generate answers from medical knowledge base
- report_pipeline: Orchestrate all services in the correct order
"""

from .ocr_service import (
    process_medical_report,
    extract_text_from_image,
    extract_text_from_pdf,
    validate_text_extraction,
    preprocess_extracted_text,
    batch_process_reports,
    get_supported_formats
)

from .simplify_service import (
    simplify_medical_text,
    extract_key_findings,
    extract_key_medical_findings,
    generate_summary,
    simplify_batch,
    get_simplification_stats,
    validate_input_text as validate_simplify_input,
    chunk_text_for_processing,
    merge_simplified_chunks
)

from .translate_service import (
    translate_text,
    translate_to_multiple_languages,
    get_supported_languages,
    is_language_supported,
    get_language_info,
    validate_medical_terminology,
    batch_translate,
    get_translation_stats,
    validate_input_text as validate_translate_input,
    validate_language,
    chunk_text_for_translation,
    merge_translated_chunks,
    SUPPORTED_LANGUAGES
)

from .report_pipeline import (
    process_medical_report as pipeline_process_medical_report,
    get_pipeline_status,
    retry_failed_pipeline,
    validate_language as validate_pipeline_language,
    validate_user_id,
    PipelineStatus,
    PipelineStep,
    PipelineContext
)

from .rag_service import (
    answer_medical_question,
    answer_followup_question,
    batch_medical_questions,
    semantic_search_reports,
    get_rag_stats,
    test_rag_service,
    search_user_reports,
    construct_context_from_results,
    extract_medical_terms_from_query
)

__all__ = [
    # OCR Service
    "process_medical_report",
    "extract_text_from_image",
    "extract_text_from_pdf",
    "validate_text_extraction",
    "preprocess_extracted_text",
    "batch_process_reports",
    "get_supported_formats",
    # Simplify Service
    "simplify_medical_text",
    "extract_key_findings",
    "extract_key_medical_findings",
    "generate_summary",
    "simplify_batch",
    "get_simplification_stats",
    "validate_simplify_input",
    "chunk_text_for_processing",
    "merge_simplified_chunks",
    # Translation Service
    "translate_text",
    "translate_to_multiple_languages",
    "get_supported_languages",
    "is_language_supported",
    "get_language_info",
    "validate_medical_terminology",
    "batch_translate",
    "get_translation_stats",
    "validate_translate_input",
    "validate_language",
    "chunk_text_for_translation",
    "merge_translated_chunks",
    "SUPPORTED_LANGUAGES",
    # Pipeline Service
    "pipeline_process_medical_report",
    "get_pipeline_status",
    "retry_failed_pipeline",
    "validate_pipeline_language",
    "validate_user_id",
    "PipelineStatus",
    "PipelineStep",
    "PipelineContext",
    # RAG Service
    "answer_medical_question",
    "answer_followup_question",
    "batch_medical_questions",
    "semantic_search_reports",
    "get_rag_stats",
    "test_rag_service",
    "search_user_reports",
    "construct_context_from_results",
    "extract_medical_terms_from_query"
]




