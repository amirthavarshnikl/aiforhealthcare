# ReportEase File Reference Guide

Quick reference for understanding the complete codebase structure.

## 📁 Frontend Files

### `frontend/index.html`
**Purpose**: Main application template (HTML structure)

**What it contains**:
- Navigation bar with user dropdown
- Hero section with CTAs
- Feature showcase cards
- How-it-works pipeline
- Supported languages section
- Call-to-action section
- Footer
- Modal dialogs (health details, reports list)

**Key IDs & Classes**:
- `#userBtn` - User menu button
- `#userDropdown` - User dropdown menu
- `#detailsModal` - Health details modal
- `#reportsPanel` - Reports list panel
- `.nav-links` - Navigation menu

**No styling or logic** (all external)

---

### `frontend/css/styles.css`
**Purpose**: Complete application styling

**Sections**:
1. **Root Variables** - Color palette, shadows
2. **Navigation** - Sticky header styling
3. **Hero Section** - Landing page design
4. **Features** - Card layout and hover effects
5. **How It Works** - Step visualization
6. **Languages** - Language chips
7. **CTA** - Call-to-action section
8. **Footer** - Bottom section
9. **Dropdowns** - User menu styling
10. **Modals** - Popup dialogs
11. **Forms** - Input fields and labels
12. **BMI Box** - Health metric display
13. **Reports Cards** - Report list styling
14. **Responsive** - Mobile breakpoints

**CSS Variables**:
```css
--green:      #89BE4D
--teal:       #3D5152
--sage:       #BDCBB7
--white:      #FEFEFE
```

**No HTML or JavaScript** (pure CSS)

---

### `frontend/js/script.js`
**Purpose**: All interactive functionality

**Major Functions**:

| Function | Purpose |
|----------|---------|
| `toggleMenu()` | Toggle mobile hamburger menu |
| `toggleDropdown()` | Show/hide user dropdown |
| `openDetails()` | Open health details modal |
| `openReports()` | Open reports list panel |
| `closeModal(id)` | Close any modal |
| `calcBMI()` | Calculate BMI automatically |
| `saveDetails()` | Save health information |
| `loadSavedDetails()` | Restore from localStorage |
| `viewReport(index)` | View report summary |
| `addReport()` | Add report to local list |
| `uploadReport(file, lang)` | Upload to backend API |
| `askQuestion(question, userId)` | Ask question via RAG |

**API Integration**:
```javascript
const API_BASE_URL = 'http://localhost:8000/api';
uploadReport(file, language)        // POST /upload-report
askQuestion(question, userId)       // POST /ask-question
```

**Local Storage Keys**:
- `userId` - Current user identifier
- `userDetails` - Saved health information
- `userReports` - Uploaded medical reports

**No HTML structure** (DOM manipulation only)

---

### `frontend/assets/logo.svg`
**Purpose**: Application logo

**Design**: Green medical cross + teal circle
**Scalable**: SVG format (vector)
**Used in**:
- Navbar branding
- Browser favicon
- All references to logo

**Properties**:
```svg
<circle cx="128" cy="128" r="128" fill="#3D5152"/>
<rect fill="#89BE4D"/> <!-- Cross bars -->
<circle stroke="#89BE4D"/> <!-- Outer ring -->
```

---

### `frontend/README.md`
**Purpose**: Frontend-specific documentation

**Contains**:
- Project structure
- Features overview
- Installation instructions
- Usage guide
- API integration details
- Customization guide
- Troubleshooting
- Deployment options
- Accessibility features

---

## 🔙 Backend Files

### `backend/main.py`
**Purpose**: FastAPI application and endpoints

**Sections**:
1. **Imports** - All dependencies
2. **Lifespan** - Startup/shutdown logic
3. **FastAPI Setup** - App creation and CORS
4. **Health Endpoints** - `/health`, `/`
5. **User Endpoints** - CRUD operations
6. **Report Endpoints** - Upload, view, manage
7. **Embedding Endpoints** - Generate embeddings
8. **RAG Endpoints** - Question answering
9. **Error Handling** - HTTP exceptions

**Key Endpoints** (15 total):
```
GET /health              Health status
POST /users              Create user
GET /users/{id}          Get user
GET /users/{id}/reports  List reports
POST /reports            Create report
GET /reports/{id}        Get report
POST /rag/query          Answer question
GET /rag/stats           RAG statistics
```

---

### `backend/models.py`
**Purpose**: Pydantic data models for validation

**Models**:

| Model | Purpose |
|-------|---------|
| `UserCreate` | Validate user creation |
| `UserResponse` | User API response |
| `ReportCreate` | Validate report creation |
| `ReportUpdate` | Validate report updates |
| `ReportResponse` | Report API response |
| `EmbeddingRequest` | Embedding request |
| `RagQuery` | Question input |
| `RagResult` | Single RAG result |
| `RagResponse` | RAG query response |
| `HealthStatus` | Health check response |

**All models include**:
- Type validation
- Default values
- Field aliases
- Config for flexibility

---

### `backend/config.py`
**Purpose**: Configuration management

**Provides**:
- Environment variable loading
- Database URLs
- API keys
- Default values
- Settings class

**Key Settings**:
```python
MONGO_URI              # MongoDB connection
DB_NAME                # Database name
VECTOR_DB_PATH         # ChromaDB location
GEMINI_API_KEY         # Gemini API key
```

---

### `backend/database/mongodb.py`
**Purpose**: MongoDB operations

**Classes**:
- `MongoDBConnection` - Connection management

**Functions**:

| Function | Purpose |
|----------|---------|
| `connect()` | Establish connection |
| `disconnect()` | Close connection |
| `save_report()` | Insert new report |
| `get_report()` | Retrieve report by ID |
| `update_report()` | Update existing report |
| `delete_report()` | Remove report |
| `save_user()` | Create new user |
| `get_user()` | Get user by ID |
| `get_user_by_email()` | Find user by email |
| `update_user()` | Update user info |
| `delete_user()` | Remove user |

**Collections**:
- `reports` - Medical reports
- `users` - Patient profiles

---

### `backend/database/vectordb.py`
**Purpose**: ChromaDB vector operations

**Classes**:
- `VectorDBConnection` - Vector DB management

**Functions**:

| Function | Purpose |
|----------|---------|
| `connect()` | Initialize ChromaDB |
| `add_embeddings()` | Store vectors |
| `query_embeddings()` | Semantic search |
| `get_embedding()` | Retrieve by ID |
| `update_embedding()` | Update vector |
| `delete_embedding()` | Remove vector |
| `get_collection_count()` | Count documents |

**Collection**: `medical_knowledge`
**Metric**: Cosine similarity
**Dimension**: 384

---

### `backend/database/embeddings.py`
**Purpose**: Text-to-vector conversion

**Functions**:

| Function | Purpose |
|----------|---------|
| `generate_embedding()` | Single text → vector |
| `generate_embeddings_batch()` | Multiple texts → vectors |
| `get_embedding_dimension()` | Get vector size |

**Model**: all-MiniLM-L6-v2
**Output**: 384-dimensional vectors

---

### `backend/services/ocr_service.py`
**Purpose**: Extract text from PDFs/images

**Main Function**:
```python
process_medical_report(file: UploadFile)
```

**Supports**:
- Images: JPG, PNG
- PDFs: Multi-page

**Returns**:
- Extracted text
- Confidence scores
- Per-page content
- Validation metrics

**Key Functions**:
- `extract_text_from_image()` - Single image
- `extract_text_from_pdf()` - Multi-page PDF
- `validate_text_extraction()` - Quality check
- `preprocess_extracted_text()` - Clean text
- `batch_process_reports()` - Multiple files

---

### `backend/services/simplify_service.py`
**Purpose**: Convert medical language to plain text

**Main Function**:
```python
simplify_medical_text(text: str)
```

**Returns**:
- Simplified text
- Summary (2-3 sentences)
- Key findings
- Chunk information

**Key Functions**:
- `extract_key_findings()` - Extract important info
- `generate_summary()` - Create brief overview
- `chunk_text_for_processing()` - Split long text
- `merge_simplified_chunks()` - Combine chunks
- `simplify_batch()` - Multiple texts

**Model**: Gemini Pro
**Temperature**: 0.3 (factuality-focused)

---

### `backend/services/translate_service.py`
**Purpose**: Translate to Indian languages

**Main Function**:
```python
translate_text(text: str, target_language: str)
```

**Supported Languages** (10):
- Tamil, Hindi, Telugu, Kannada, Malayalam
- Marathi, Gujarati, Bengali, Punjabi, Urdu

**Returns**:
- Translated text
- Language code
- Quality validation
- Medical term preservation

**Key Functions**:
- `translate_to_multiple_languages()` - Batch translation
- `get_supported_languages()` - List options
- `validate_medical_terminology()` - Check accuracy
- `batch_translate()` - Multiple texts/languages
- `is_language_supported()` - Validate language

**Model**: Gemini Pro
**Temperature**: 0.2 (high accuracy)

---

### `backend/services/rag_service.py`
**Purpose**: Question answering with semantic search

**Main Function**:
```python
answer_medical_question(question: str, user_id: str)
```

**Returns**:
- AI-generated answer
- Source documents
- Confidence score
- Medical terms found

**Key Functions**:
- `search_user_reports()` - Find similar documents
- `answer_followup_question()` - Context-aware Q&A
- `semantic_search_reports()` - Pure search
- `batch_medical_questions()` - Multiple questions
- `construct_context_from_results()` - Build prompt context

**Pipeline**:
1. Generate question embedding
2. Semantic search in ChromaDB
3. Filter by user_id
4. Build context block
5. Call Gemini API
6. Return answer with sources

---

### `backend/services/report_pipeline.py`
**Purpose**: Orchestrate entire workflow

**Main Function**:
```python
process_medical_report(file, user_id, target_language)
```

**Returns**:
- Complete processed report
- All intermediate results
- Status and timing
- Errors/warnings

**Classes**:
- `PipelineContext` - State management
- `PipelineStatus` - Enum for stages
- `PipelineStep` - Processing steps

**Pipeline Steps**:
1. OCR extraction
2. Text simplification
3. Multi-language translation
4. Embedding generation
5. MongoDB storage

**Key Functions**:
- `execute_ocr_step()` - Run OCR
- `execute_simplify_step()` - Simplify text
- `execute_translation_step()` - Translate
- `execute_embedding_step()` - Generate vectors
- `execute_storage_step()` - Save to DB
- `get_pipeline_status()` - Check progress

---

### `backend/requirements.txt`
**Purpose**: Python dependency management

**Categories**:
- **Web Framework**: FastAPI, Uvicorn
- **Database**: PyMongo, ChromaDB
- **AI/ML**: Gemini API, SentenceTransformers, EasyOCR
- **PDF/Image**: pdf2image, Pillow, Pytesseract
- **Utilities**: python-dotenv, Tenacity
- **Optional**: Celery, Redis

**Install**:
```bash
pip install -r requirements.txt
```

---

### `backend/.env.example`
**Purpose**: Template for environment variables

**Variables**:
```bash
MONGO_URI=mongodb+srv://...
DB_NAME=medicalreport
VECTOR_DB_PATH=./data/vector-db
GEMINI_API_KEY=...
DEBUG=False
HOST=0.0.0.0
PORT=8000
```

**Never commit actual .env file!**

---

## 📚 Root Level Files

### `README.md`
**Main project documentation**
- Quick start guide
- Feature overview
- Architecture summary
- Deployment instructions
- Troubleshooting

### `PROJECT_ARCHITECTURE.md`
**Detailed technical documentation**
- Complete architecture
- Component descriptions
- Processing workflows
- Technology choices
- Deployment strategy

### `FRONTEND_SETUP.md`
**Frontend-specific setup guide**
- Quick start
- Configuration
- Local storage
- API integration
- Troubleshooting

### `.gitignore`
**Version control exclusions**
- Python artifacts
- Environment files
- Logs
- IDE settings
- OS files
- Temporary files

### `.env.example`
**Environment template**
- Database configuration
- API keys
- Server settings

---

## 🔄 Data Flow Summary

```
User (Frontend)
    ↓ Uploads Report
    ↓
main.py [POST /upload-report]
    ↓
report_pipeline.py
    ├→ ocr_service.py (extract)
    ├→ simplify_service.py (simplify)
    ├→ translate_service.py (translate)
    ├→ embeddings.py (generate vectors)
    ├→ vectordb.py (store vectors)
    └→ mongodb.py (store metadata)
    ↓
Returns: processed report_id
```

```
User asks question
    ↓
main.py [POST /rag/query]
    ↓
rag_service.py
    ├→ embeddings.py (encode question)
    ├→ vectordb.py (semantic search)
    └→ Gemini API (generate answer)
    ↓
Returns: answer + sources + confidence
```

---

## 📊 File Statistics

| Category | Count | Total Size |
|----------|-------|-----------|
| Frontend | 4 files | ~50 KB |
| Backend | 8 files | ~150 KB |
| Config | 4 files | ~10 KB |
| Docs | 4 files | ~100 KB |
| **Total** | **20 files** | **~310 KB** |

---

## 🎯 Quick Navigation

**Want to...**
- **Change colors?** → Edit `frontend/css/styles.css` (lines 1-20)
- **Add a feature?** → Edit `frontend/js/script.js` or `backend/main.py`
- **Fix a bug?** → Check relevant service file, review logs
- **Deploy?** → Read `PROJECT_ARCHITECTURE.md`
- **Understand flow?** → Read `report_pipeline.py`
- **Setup locally?** → Follow `FRONTEND_SETUP.md`

---

**This reference guide helps you navigate the codebase quickly!**
