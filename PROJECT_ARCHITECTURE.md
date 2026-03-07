# ReportEase - Complete System Architecture

## 🏥 Project Overview

**ReportEase** is an AI-powered medical report simplification platform that:

1. 📤 Accepts medical reports (PDFs/images)
2. 🤖 Extracts text using AI-powered OCR
3. 📖 Simplifies complex medical language into patient-friendly explanations
4. 🌍 Translates simplified text into 10+ Indian languages
5. 💾 Stores reports and metadata in MongoDB
6. 🔍 Enables semantic search using vector embeddings
7. 🎯 Provides AI-powered question answering via RAG

## 📁 Complete Project Structure

```
medicalreport/
│
├── 📂 frontend/                    # React-free, vanilla HTML/CSS/JS
│   ├── index.html                  # Main page
│   ├── css/styles.css              # All styling
│   ├── js/script.js                # All functionality
│   ├── assets/logo.svg             # Logo (green cross + teal circle)
│   └── README.md                   # Frontend documentation
│
├── 📂 backend/                     # FastAPI medical AI backend
│   ├── main.py                     # FastAPI app & endpoints
│   ├── models.py                   # Pydantic data models
│   ├── config.py                   # Configuration & environment
│   │
│   ├── 📂 database/                # Database layer
│   │   ├── mongodb.py              # MongoDB connection & CRUD operations
│   │   ├── vectordb.py             # ChromaDB vector store operations
│   │   └── embeddings.py           # SentenceTransformer embedding generation
│   │
│   ├── 📂 services/                # AI processing services
│   │   ├── ocr_service.py          # Extract text from PDFs/images (EasyOCR)
│   │   ├── simplify_service.py     # Simplify text (Gemini API)
│   │   ├── translate_service.py    # Translate to Indian languages (Gemini API)
│   │   ├── rag_service.py          # Answer questions using RAG (Gemini + ChromaDB)
│   │   └── report_pipeline.py      # Orchestrate all services
│   │
│   ├── requirements.txt            # Python dependencies
│   ├── .env.example                # Environment variables template
│   └── *.log                       # Service logs (ocr_service.log, etc.)
│
└── 📄 FRONTEND_SETUP.md           # Frontend quick start guide (this file)
```

## 🎨 Frontend Architecture

### Tech Stack
- **HTML5** - Semantic structure
- **CSS3** - Modern responsive design
- **Vanilla JavaScript** - No frameworks, pure DOM manipulation
- **Local Storage** - Browser-based persistence
- **Google Fonts** - DM Serif Display & DM Sans fonts

### Frontend Features

| Component | Purpose | Status |
|-----------|---------|--------|
| **Navigation Bar** | Sticky header with branding | ✅ Complete |
| **Hero Section** | Eye-catching CTAs | ✅ Complete |
| **Feature Cards** | Service highlights | ✅ Complete |
| **How It Works** | Pipeline visualization | ✅ Complete |
| **Languages** | Supported languages display | ✅ Complete |
| **User Dropdown** | Account management | ✅ Complete |
| **Health Details Modal** | BMI calculator & profile | ✅ Complete |
| **Reports Panel** | View uploaded reports | ✅ Complete |
| **Responsive Design** | Mobile-first approach | ✅ Complete |

### Design System

**Color Palette:**
```css
--green:      #89BE4D  /* Primary actions */
--teal:       #3D5152  /* Headers & accents */
--sage:       #BDCBB7  /* Soft backgrounds */
--white:      #FEFEFE  /* Main background */
```

**Fonts:**
- Serif: DM Serif Display (headings)
- Sans: DM Sans (body/UI)

**Breakpoints:**
- Desktop: 1024px+
- Tablet: 680px-1023px
- Mobile: 480px-680px
- Small Mobile: <480px

---

## 🤖 Backend Architecture

### Tech Stack
- **Framework**: FastAPI (async Python)
- **Database**: MongoDB Atlas (document storage)
- **Vector DB**: ChromaDB (semantic search)
- **Embeddings**: SentenceTransformer (all-MiniLM-L6-v2)
- **LLM**: Google Gemini Pro API
- **OCR**: EasyOCR
- **API Client**: google-generativeai

### Database Layer

#### MongoDB Collections
| Collection | Purpose | Fields |
|------------|---------|--------|
| **reports** | Medical reports | user_id, file_name, original_text, simplified_text, translated_text, language, created_at |
| **users** | Patient profiles | name, email, password_hash, created_at |
| **embeddings_metadata** | Embedding info | report_id, user_id, created_at |

#### ChromaDB
- **Collection**: `medical_knowledge`
- **Metric**: Cosine similarity
- **Dimension**: 384 (all-MiniLM-L6-v2)
- **Stores**: Simplified text with embeddings for RAG

### AI Service Layer

#### 1️⃣ OCR Service (`ocr_service.py`)
**Purpose**: Extract text from medical reports

**Supported Formats**:
- Images: JPG, PNG
- PDFs: Single & multi-page

**Key Functions**:
```python
process_medical_report(file: UploadFile)
extract_text_from_image(image_bytes: bytes)
extract_text_from_pdf(pdf_bytes: bytes)
validate_text_extraction(text: str)
batch_process_reports(files: List[UploadFile])
```

**Output**: Raw medical text with confidence scores

---

#### 2️⃣ Simplify Service (`simplify_service.py`)
**Purpose**: Convert medical jargon to patient-friendly language

**Model**: Google Gemini Pro API
**Temperature**: 0.3 (factuality-optimized)

**Key Functions**:
```python
simplify_medical_text(text: str)
extract_key_findings(text: str)
generate_summary(text: str)
simplify_batch(texts: List[str])
```

**Output**: Simplified explanation + key findings + summary

---

#### 3️⃣ Translate Service (`translate_service.py`)
**Purpose**: Translate simplified text to Indian languages

**Supported Languages** (10 total):
- Tamil (ta) தமிழ்
- Hindi (hi) हिन्दी
- Telugu (te) తెలుగు
- Kannada (kn) ಕನ್ನಡ
- Malayalam (ml) മലയാളം
- Marathi, Gujarati, Bengali, Punjabi, Urdu

**Key Functions**:
```python
translate_text(text: str, target_language: str)
translate_to_multiple_languages(text: str, languages: List[str])
validate_medical_terminology(original: str, translated: str)
batch_translate(texts: List[str], languages: List[str])
```

**Output**: Translated text with quality validation

---

#### 4️⃣ RAG Service (`rag_service.py`)
**Purpose**: Answer patient questions about medical reports

**Architecture**:
1. Generate question embedding
2. Semantic search in ChromaDB
3. Retrieve top-k relevant documents
4. Pass context to Gemini
5. Generate patient-friendly answer

**Key Functions**:
```python
answer_medical_question(question: str, user_id: str)
answer_followup_question(original: str, followup: str, user_id: str)
semantic_search_reports(query: str, user_id: str)
batch_medical_questions(questions: List[Dict])
```

**Output**: Answer with sources and confidence score

---

#### 5️⃣ Report Pipeline (`report_pipeline.py`)
**Purpose**: Orchestrate entire processing workflow

**Pipeline Flow**:
```
1. Create report record (MongoDB)
2. OCR → Extract text
3. Simplify → Convert to easy language
4. Translate → Multi-language support
5. Generate embeddings → Vector DB
6. Store in MongoDB
7. Return processed report
```

**Status Tracking**:
```
PENDING → OCR_IN_PROGRESS → OCR_COMPLETE
→ SIMPLIFY_IN_PROGRESS → SIMPLIFY_COMPLETE
→ TRANSLATE_IN_PROGRESS → TRANSLATE_COMPLETE
→ EMBEDDING_IN_PROGRESS → EMBEDDING_COMPLETE
→ STORAGE_IN_PROGRESS → COMPLETE/PARTIAL/FAILED
```

**Key Functions**:
```python
process_medical_report(file, user_id, language)
get_pipeline_status(report_id)
retry_failed_pipeline(report_id)
```

---

### API Endpoints

#### Health & Status
```
GET /                                    Root endpoint
GET /health                              Health check status
```

#### User Management
```
POST /users                              Create user
GET /users/{user_id}                     Get user details
PUT /users/{user_id}                     Update user
DELETE /users/{user_id}                  Delete user
```

#### Report Management
```
POST /reports                            Create report
GET /reports/{report_id}                 Get report details
GET /users/{user_id}/reports             List user's reports
PUT /reports/{report_id}                 Update report
DELETE /reports/{report_id}              Delete report
POST /upload-report                      Upload & process report
GET /reports/{report_id}/status          Get processing status
```

#### Embeddings & Search
```
POST /embeddings/generate                Generate single embedding
POST /embeddings/batch                   Generate batch embeddings
GET /rag/stats                           RAG database statistics
```

#### RAG (Question Answering)
```
POST /rag/query                          Answer question about reports
POST /rag/add                            Add documents to RAG
GET /rag/stats                           Get RAG statistics
```

---

## 🔄 Complete Processing Workflow

### Scenario: Patient uploads a medical report

```
Patient (Frontend)
    ↓ Uploads PDF/Image
    ↓
[POST /upload-report]
    ↓
Report Pipeline
    ├─1→ OCR Service
    │     ├─→ Extract text
    │     ├─→ Validate quality
    │     └─→ Return raw text (confidence score)
    │
    ├─2→ Simplify Service
    │     ├─→ Call Gemini API
    │     ├─→ Simplify language
    │     ├─→ Extract key findings
    │     └─→ Generate summary
    │
    ├─3→ Translate Service
    │     ├─→ Translate to patient's language
    │     ├─→ Preserve medical terminology
    │     └─→ Validate translation quality
    │
    ├─4→ Create MongoDB Record
    │     └─→ Store: original, simplified, translated text
    │
    ├─5→ Generate Embeddings
    │     └─→ SentenceTransformer
    │
    ├─6→ Store in ChromaDB
    │     └─→ Index for semantic search
    │
    └─→ Return Processed Report
        ├─ report_id
        ├─ original_text
        ├─ simplified_text
        ├─ translated_text
        ├─ language
        └─ status: "complete"
```

### Scenario: Patient asks a question

```
Patient (Frontend)
    ↓ Asks: "What does hemoglobin level mean?"
    ↓
[POST /rag/query]
    ↓
RAG Service
    ├─1→ Generate Question Embedding
    │     └─→ SentenceTransformer
    │
    ├─2→ Semantic Search in ChromaDB
    │     └─→ Find top-5 similar documents
    │
    ├─3→ Build Context
    │     └─→ Compile retrieved documents
    │
    ├─4→ Call Gemini API
    │     ├─→ Provide: Question + Context
    │     ├─→ Constraint: Only use provided context
    │     └─→ Generate answer
    │
    └─→ Return Answer
        ├─ answer: "Clear explanation..."
        ├─ sources: [retrieved documents]
        ├─ confidence: 0.92
        └─ medical_terms: [extracted keywords]
```

---

## 🔐 Configuration & Environment

### Required Environment Variables

```bash
# MongoDB
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/
DB_NAME=medicalreport

# Vector Database
VECTOR_DB_PATH=./data/vector-db

# Gemini API
GEMINI_API_KEY=your-api-key-here

# FastAPI
DEBUG=False
HOST=0.0.0.0
PORT=8000
```

### Dependencies

**OCR & PDF**:
- easyocr
- pdf2image
- pillow
- pytesseract

**AI/ML**:
- google-generativeai
- sentence-transformers
- chromadb

**Database**:
- pymongo
- motor (async MongoDB)

**Framework**:
- fastapi
- uvicorn
- pydantic
- python-dotenv

**Task Queue** (optional):
- celery
- redis

---

## 🚀 Deployment Strategy

### Frontend Deployment
1. Static hosting (Netlify, Vercel, AWS S3)
2. No build process required
3. Update API_BASE_URL for production backend

### Backend Deployment
1. Container deployment (Docker)
2. Environment variables configuration
3. Database connection to MongoDB Atlas
4. Gemini API key management

### Production Checklist
- [ ] Frontend on CDN
- [ ] Backend on cloud platform
- [ ] MongoDB Atlas configured
- [ ] Gemini API key secured
- [ ] CORS properly configured
- [ ] SSL/TLS enabled
- [ ] Environment variables set
- [ ] Error logging enabled
- [ ] Rate limiting configured
- [ ] Monitoring/alerts set up

---

## 📊 Technology Stack Summary

| Component | Technology | Purpose |
|-----------|-----------|---------|
| **Frontend** | HTML/CSS/JS | Patient interface |
| **Backend** | FastAPI | API server |
| **OCR** | EasyOCR | Text extraction |
| **LLM** | Gemini Pro | Simplification & Translation |
| **Embeddings** | SentenceTransformer | Semantic search |
| **Vector DB** | ChromaDB | RAG retrieval |
| **Document DB** | MongoDB | Report storage |
| **Language** | Python 3.8+ | Backend code |

---

## 🎯 Key Features

✅ **Multi-language Support** - 10 Indian languages
✅ **Medical Accuracy** - Gemini-powered with validation
✅ **Privacy First** - HIPAA-ready architecture
✅ **Semantic Search** - Find related reports instantly
✅ **AI Q&A** - Ask questions, get answers about reports
✅ **Responsive Design** - Works on all devices
✅ **No Code Bloat** - Vanilla JavaScript frontend
✅ **Production Ready** - Proper error handling & logging
✅ **Scalable** - Async processing, database indexing
✅ **Easy Deployment** - Containerizable, cloud-ready

---

## 📞 Quick Start

### Frontend
```bash
cd frontend
# Open index.html in browser or
python -m http.server 8000
```

### Backend
```bash
cd backend
pip install -r requirements.txt
python -m uvicorn main:app --reload
```

### Environment Setup
```bash
cp .env.example .env
# Edit .env with your credentials
```

---

## 📚 Full Documentation

- **Frontend**: See `frontend/README.md`
- **Backend**: See `backend/README.md` (create with API docs)
- **Setup Guide**: See `FRONTEND_SETUP.md`

---

## 🤝 Architecture Philosophy

1. **Separation of Concerns** - Each service has single responsibility
2. **Modular Design** - Services can be replaced independently
3. **Error Resilience** - Non-critical failures don't break pipeline
4. **User Privacy** - Minimal data collection, local storage preference
5. **Scalability** - Async processing, database indexing
6. **Accessibility** - WCAG-compliant frontend
7. **Security** - CORS, environment variables, input validation

---

## ✨ What Makes ReportEase Different

1. **Patient Centric** - Language designed for patients, not doctors
2. **Multilingual** - Indian language support (not just English)
3. **AI-Powered** - Latest LLMs (Gemini) for accuracy
4. **Semantic Search** - Find reports by meaning, not keywords
5. **No Paywalls** - Open-source approach to healthcare
6. **Privacy Focused** - Patient data stays local/secure

---

**ReportEase: Making Healthcare Transparent & Accessible** 🏥❤️

Made for the 2025 Hackathon | Empowering patients through technology
