# ReportEase Frontend - Quick Start Guide

## 📁 Project Structure

```
medicalreport/
├── frontend/              # Frontend application
│   ├── index.html        # Main HTML file
│   ├── css/
│   │   └── styles.css    # Styling
│   ├── js/
│   │   └── script.js     # Functionality
│   ├── assets/
│   │   └── logo.svg      # App logo
│   └── README.md         # Full documentation
│
└── backend/              # Backend API (FastAPI)
    ├── main.py
    ├── models.py
    ├── config.py
    ├── database/
    ├── services/
    └── requirements.txt
```

## 🚀 Quick Start

### Option 1: Direct Browser (Easiest)

1. **Navigate to frontend folder:**
   ```bash
   cd frontend
   ```

2. **Open in browser:**
   - Double-click `index.html`, OR
   - Right-click → Open with → Your browser

### Option 2: Local Server (Recommended)

#### Using Python:
```bash
cd frontend
python -m http.server 8000
# Visit: http://localhost:8000
```

#### Using Node.js:
```bash
cd frontend
npx http-server
# Visit: http://127.0.0.1:8080
```

## 📋 Features Overview

### 1. **Homepage**
- Hero section with call-to-action
- Feature cards (AI Summarization, Plain Language, Translation)
- How It Works pipeline
- Supported languages showcase
- Professional footer

### 2. **User Dashboard**
- Click user icon (top right) to access:
  - **My Reports** - View uploaded medical reports
  - **My Details** - Update health information
  - **Account Management** - Switch accounts, logout

### 3. **Health Details Modal**
- Save personal information:
  - Full name
  - Date of birth
  - Gender
  - Height (cm)
  - Weight (kg)
- **Automatic BMI calculation** with category display
- Data persists in browser

### 4. **Reports Management**
- View all uploaded medical reports
- Display upload dates
- Quick access to view summaries

## 🔧 Configuration

### Backend Connection

Edit `frontend/js/script.js` to change backend URL:

```javascript
// Line ~220
const API_BASE_URL = 'http://your-backend-url:8000/api';
```

### Customization

**Change Colors** - Edit `css/styles.css`:
```css
:root {
  --green:      #89BE4D;  /* Primary buttons */
  --teal:       #3D5152;  /* Headers */
  --sage:       #BDCBB7;  /* Backgrounds */
  --white:      #FEFEFE;  /* Main background */
}
```

**Change Content** - Edit text directly in `index.html` (all HTML structure with inline comments)

**Update Logo** - Replace `assets/logo.svg` with your logo (PNG, JPG, or SVG)

## 📱 Responsive Design

| Device | Width | Features |
|--------|-------|----------|
| **Desktop** | 1024px+ | Full layout |
| **Tablet** | 680px - 1023px | Adjusted grid |
| **Mobile** | 480px - 680px | Hamburger menu |
| **Small Mobile** | < 480px | Single column |

Test responsiveness with your browser's device emulation (F12 → Toggle device toolbar)

## 💾 Local Storage

The app automatically saves:
- **User ID** - Anonymous session identifier
- **User Details** - Health information (name, DOB, height, weight)
- **User Reports** - Uploaded medical reports

Clear all data:
```javascript
// In browser console (F12)
localStorage.clear();
```

## 🌐 Browser Support

| Browser | Status |
|---------|--------|
| Chrome/Edge | ✅ Full support |
| Firefox | ✅ Full support |
| Safari | ✅ Full support |
| Internet Explorer | ❌ Not supported |

## 🔌 API Integration

The frontend communicates with FastAPI backend:

### Expected Endpoints

```
POST /upload-report
  - Body: FormData { file, user_id, language }
  - Response: { report_id, simplified_text, ... }

POST /ask-question
  - Body: { question, user_id }
  - Response: { answer, sources, confidence }

GET /supported-languages
  - Response: List of language options
```

### Testing API Integration

Open browser console (F12) and test:

```javascript
// Upload a report
await uploadReport(fileObject, 'en');

// Ask a question
await askQuestion('What is my hemoglobin level?', 'demo_user');
```

## 🎨 Color Palette Reference

```
Medical Green:  #89BE4D  → Primary buttons, highlights
Clinical Teal:  #3D5152  → Navigation, headings
Soft Sage:      #BDCBB7  → Backgrounds, accents
Clean White:    #FEFEFE  → Main background
```

## 📝 Fonts Used

- **Headings**: DM Serif Display (serif)
- **Body**: DM Sans (sans-serif)

Loaded from Google Fonts (no local installation needed)

## 🐛 Troubleshooting

### Logo not showing?
- Ensure `assets/logo.svg` exists
- Try `assets/logo.png` if you have a PNG file
- Check browser console for errors (F12)

### Styles not loading?
```bash
# Clear cache
# Windows: Ctrl+Shift+Del
# Mac: Cmd+Shift+Del
# Then refresh: F5 or Cmd+R
```

### JavaScript not working?
1. Open browser console: F12 or Cmd+Option+I
2. Look for red error messages
3. Check that `js/script.js` is loaded (Network tab)

### Backend not responding?
1. Verify backend is running: `http://localhost:8000`
2. Check for CORS errors in console
3. Ensure backend API URLs match config

## 🚀 Deployment

### Static Hosting (No Backend)
- Netlify, Vercel, GitHub Pages, Surge, etc.
- Just upload the `frontend` folder

### With Backend API
1. Deploy backend to server (e.g., AWS, Heroku, DigitalOcean)
2. Update `API_BASE_URL` in `script.js`
3. Ensure CORS is enabled on backend
4. Deploy frontend to static hosting

## 📚 Full Documentation

See `frontend/README.md` for comprehensive documentation including:
- Detailed API integration
- Deployment strategies
- Performance optimization
- Accessibility features
- Browser compatibility

## 🤝 Integration Checklist

- [ ] Backend running at `http://localhost:8000`
- [ ] Frontend displays without errors
- [ ] User dropdown works
- [ ] Health details modal saves BMI
- [ ] Reports can be added to list
- [ ] API endpoints are responding

## 💡 Next Steps

1. **Test locally**: Open `index.html` in browser
2. **Connect backend**: Update API_BASE_URL if needed
3. **Customize**: Update colors, content, logo
4. **Deploy**: Push to static hosting
5. **Monitor**: Check console for errors

## 📞 Support

- Check browser console (F12) for errors
- Review README.md for detailed docs
- Verify backend is running
- Check file paths and permissions

---

**Made with ❤️ for transparent healthcare**
