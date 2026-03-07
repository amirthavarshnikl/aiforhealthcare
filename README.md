# ReportEase - AI Medical Report Simplifier

An intelligent healthcare platform that transforms complex medical reports into simple, patient-friendly explanations in multiple Indian languages.

## 🎯 Mission

To make medical reports **readable, understandable, and accessible** to all patients by leveraging AI to simplify medical language across multiple languages.

## ✨ Features

✅ **AI-Powered Report Processing**
- Extract text from PDFs and images (EasyOCR)
- Simplify medical jargon using Gemini API
- Translate to 10+ Indian languages

✅ **Semantic Search & Q&A**
- Store reports with embeddings (ChromaDB)
- Ask questions about your medical reports
- Get AI-powered answers with source citations

✅ **Patient-Centric Design**
- Clean, intuitive interface for all users
- Health tracking (BMI calculator)
- Report history management
- Multi-language support

✅ **Production-Ready**
- Scalable architecture (FastAPI + MongoDB)
- Async processing pipeline
- Comprehensive error handling
- Full logging and monitoring

## 🚀 Quick Start

### Option 1: Frontend Only (Demo)

```bash
cd frontend
# Open index.html in your browser
open index.html

# Or use a local server
python -m http.server 8000
# Visit http://localhost:8000
```

### Option 2: Full Stack (Recommended)

#### Prerequisites
- Python 3.8+
- MongoDB Atlas account (free tier available)
- Google Gemini API key (free tier available)

#### Setup Backend

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env with your credentials:
# MONGO_URI=your_mongodb_connection_string
# GEMINI_API_KEY=your_gemini_api_key

# Run backend
python -m uvicorn main:app --reload
# Backend runs at http://localhost:8000
```

#### Setup Frontend

```bash
cd frontend
python -m http.server 8000
# Frontend runs at http://localhost:8000
```

## 📁 Project Structure

```
medicalreport/
├── 🎨 frontend/
│   ├── index.html              # Main application
│   ├── css/styles.css          # Styling
│   ├── js/script.js            # Functionality
│   ├── assets/logo.svg         # Branding
│   └── README.md               # Frontend docs
│
├── 🤖 backend/
│   ├── main.py                 # FastAPI app
│   ├── models.py               # Data models
│   ├── config.py               # Configuration
│   ├── database/               # DB layer
│   ├── services/               # AI services
│   ├── requirements.txt        # Dependencies
│   └── .env.example            # Env template
│
├── 📚 Documentation
│   ├── README.md               # This file
│   ├── FRONTEND_SETUP.md       # Frontend guide
│   ├── PROJECT_ARCHITECTURE.md # Full architecture
│   └── .gitignore              # Git config
```

## 🏗️ Architecture

### Frontend Stack
- **HTML5** + **CSS3** + **Vanilla JavaScript**
- No frameworks, no build tools
- Responsive design (mobile-first)
- Local storage for persistence

### Backend Stack
- **FastAPI** - Modern Python web framework
- **MongoDB** - Document database
- **ChromaDB** - Vector database for RAG
- **SentenceTransformer** - Text embeddings
- **Google Gemini** - LLM for simplification & translation

### AI Services

| Service | Purpose | Technology |
|---------|---------|-----------|
| **OCR** | Extract text from reports | EasyOCR |
| **Simplify** | Convert medical jargon | Gemini API |
| **Translate** | 10+ Indian languages | Gemini API |
| **RAG** | Question answering | Gemini + ChromaDB |
| **Pipeline** | Orchestrate services | FastAPI |

## 🎨 Design System

### Color Palette
```
🟢 Medical Green:  #89BE4D  (Primary action)
🔵 Clinical Teal:  #3D5152  (Headers & nav)
🌿 Soft Sage:      #BDCBB7  (Backgrounds)
⚪ Clean White:    #FEFEFE  (Main BG)
```

### Typography
- **Serif**: DM Serif Display (headings)
- **Sans**: DM Sans (body & UI)

## 📱 Responsive Design

| Device | Width | Experience |
|--------|-------|-----------|
| Desktop | 1024px+ | Full layout |
| Tablet | 680px-1023px | Adjusted grid |
| Mobile | 480px-680px | Hamburger menu |
| Small | <480px | Single column |

## 🔧 Configuration

### Frontend
Edit `frontend/js/script.js` to change API backend:
```javascript
const API_BASE_URL = 'http://localhost:8000/api';
```

### Backend
Create `.env` file with:
```bash
MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/
DB_NAME=medicalreport
VECTOR_DB_PATH=./data/vector-db
GEMINI_API_KEY=your_gemini_key_here
```

## 📚 API Endpoints

### Health
```
GET /                           Root endpoint
GET /health                     Health check
```

### Reports
```
POST /reports                   Create report
GET /reports/{id}               Get report
GET /users/{id}/reports         List user reports
PUT /reports/{id}               Update report
DELETE /reports/{id}            Delete report
```

### RAG (Q&A)
```
POST /rag/query                 Answer questions
POST /rag/add                   Add to RAG
GET /rag/stats                  Statistics
```

### Embeddings
```
POST /embeddings/generate       Single embedding
POST /embeddings/batch          Batch embeddings
```

Full API docs available at `http://localhost:8000/docs` (Swagger UI)

## 🚀 Deployment

### Frontend
Deploy to any static hosting:
- **Netlify** - Drag & drop
- **Vercel** - GitHub integration
- **AWS S3** - Scalable
- **GitHub Pages** - Free

### Backend
Deploy to cloud platforms:
- **Heroku** - Beginner-friendly
- **AWS** - Scalable
- **DigitalOcean** - Affordable
- **Railway** - Modern alternative

### Database
- **MongoDB Atlas** - Free tier available
- **ChromaDB** - Runs locally or in-process

## 🔐 Security Considerations

- Environment variables for sensitive data
- CORS configured for frontend
- Input validation on all endpoints
- Error handling without data leaks
- Rate limiting recommended
- HTTPS in production

## 📊 Technology Stack

| Category | Technology | Version |
|----------|-----------|---------|
| Frontend | HTML5/CSS3/JS | Latest |
| Backend | Python | 3.8+ |
| Framework | FastAPI | 0.104+ |
| Database | MongoDB | Atlas |
| Vector DB | ChromaDB | 0.4+ |
| LLM | Gemini | Pro |
| OCR | EasyOCR | 1.7+ |
| Embeddings | SentenceTransformer | 2.2+ |

## 🧪 Testing

### Frontend Testing
```bash
# Open browser console (F12)
# Test user dropdown, modals, BMI calculator
# Check responsive design with device emulation
```

### Backend Testing
```bash
# API documentation
http://localhost:8000/docs  # Swagger UI
http://localhost:8000/redoc # ReDoc

# Test with curl or Postman
curl http://localhost:8000/health
```

## 📝 Supported Languages

🇮🇳 **Indian Languages** (10):
- Tamil (தமிழ்)
- Hindi (हिन्दी)
- Telugu (తెలుగు)
- Kannada (ಕನ್ನಡ)
- Malayalam (മലയാളം)
- Marathi (मराठी)
- Gujarati (ગુજરાતી)
- Bengali (বাংলা)
- Punjabi (ਪੰਜਾਬੀ)
- Urdu (اردو)

🌍 **Global**: English (default)

## 🤝 Contributing

This is a hackathon project. Contributions welcome!

## 📄 License

MIT License - Open source for healthcare transparency

## 🆘 Troubleshooting

### Frontend not loading?
- Check file paths in index.html
- Verify CSS/JS files are accessible
- Clear browser cache (Ctrl+Shift+Del)

### Backend not responding?
- Ensure `python -m uvicorn main:app --reload` is running
- Check MONGO_URI and GEMINI_API_KEY
- Review error logs

### API connection issues?
- Update API_BASE_URL in script.js
- Verify CORS headers on backend
- Check browser console for errors

### Embedding issues?
- Ensure ChromaDB path is writable
- Check vector database is initialized
- Review rag_service.log

## 📞 Support

- Check `FRONTEND_SETUP.md` for setup help
- Read `PROJECT_ARCHITECTURE.md` for design details
- Review service logs: `*.log` files in backend
- Check browser console (F12) for debugging

## 📖 Documentation

- **Frontend**: `frontend/README.md`
- **Setup Guide**: `FRONTEND_SETUP.md`
- **Architecture**: `PROJECT_ARCHITECTURE.md`
- **API Docs**: `http://localhost:8000/docs` (when running)

## 🎯 Roadmap

- [ ] User authentication & authorization
- [ ] Advanced RAG with document context
- [ ] Multi-file report comparison
- [ ] Doctor collaboration features
- [ ] Mobile app (React Native)
- [ ] Prescription management
- [ ] Lab result tracking

## ✨ What's New

**Current Version**: 1.0.0

- ✅ Complete OCR pipeline
- ✅ Medical text simplification
- ✅ Multi-language translation
- ✅ Semantic search with RAG
- ✅ Question answering
- ✅ Responsive frontend
- ✅ Production-ready backend

## 🏆 Hackathon

Built for **2025 Hackathon** with focus on:
- Healthcare accessibility
- AI/ML innovation
- User experience
- Code quality
- Scalability

## 💡 Vision

A world where every patient can understand their medical reports, regardless of language or medical knowledge.

## 🙏 Acknowledgments

- Google Gemini API for AI capabilities
- EasyOCR for document processing
- ChromaDB for vector search
- FastAPI for modern backend
- MongoDB for reliability

---

## 🚀 Getting Started Now

### Fastest Path (Frontend Only)
```bash
cd frontend
open index.html
```

### Full Experience (Full Stack)
```bash
# Terminal 1: Backend
cd backend && pip install -r requirements.txt
cp .env.example .env  # Update with your keys
python -m uvicorn main:app --reload

# Terminal 2: Frontend
cd frontend
python -m http.server 8000

# Open http://localhost:8000 in browser
```

### Next Steps
1. Explore the UI
2. Review documentation
3. Configure environment variables
4. Connect to backend
5. Test report upload
6. Try Q&A features

---

**ReportEase** - Making Healthcare Transparent 🏥❤️

*Because every patient deserves to understand their health.*

**Built with:** 🐍 Python • ⚡ FastAPI • 🎨 Responsive Design • 🤖 AI/ML • 📚 RAG • 🌍 Multilingual

Questions? Check the documentation or review the code - it's all well-commented!
