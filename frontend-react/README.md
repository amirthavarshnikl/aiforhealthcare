# ReportEase — React Frontend

Modern React frontend for the ReportEase healthcare AI application.

## 📋 Project Structure

```
src/
├── components/
│   ├── Navbar.jsx
│   ├── Footer.jsx
│   ├── UserDropdown.jsx
│   ├── DetailsModal.jsx
│   ├── ReportsModal.jsx
│   ├── ReportCard.jsx
│   ├── UploadBox.jsx
│   └── LanguageSelector.jsx
├── pages/
│   ├── Home.jsx
│   ├── UploadReport.jsx
│   ├── AISummary.jsx
│   ├── Translation.jsx
│   └── HealthInsights.jsx
├── services/
│   └── api.js
├── styles/
│   ├── global.css
│   ├── navbar.css
│   ├── home.css
│   ├── upload.css
│   ├── summary.css
│   ├── translation.css
│   ├── insights.css
│   ├── dropdown.css
│   ├── modal.css
│   ├── reports-modal.css
│   ├── footer.css
│   ├── language-selector.css
│   └── report-card.css
├── App.jsx
└── main.jsx
```

## 🚀 Quick Start

### Prerequisites
- Node.js 16+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The app will open at `http://localhost:5173`

## 🔗 Backend Connection

The frontend connects to the FastAPI backend at:
```
http://127.0.0.1:8000/api
```

Make sure the FastAPI backend is running before starting the frontend:
```bash
cd backend
python -m uvicorn main:app --reload
```

## 📄 Pages

1. **Home** (`/`) — Landing page with features and CTA
2. **Upload** (`/upload`) — File upload with drag-drop and metadata
3. **Summary** (`/summary`) — AI-generated report summary
4. **Translation** (`/translate`) — Multi-language translation
5. **Health Insights** (`/insights`) — AI-extracted health insights

## 🎨 Color Palette

- Medical Green: `#89BE4D`
- Clinical Teal: `#3D5152`
- Soft Sage: `#BDCBB7`
- Clean White: `#FEFEFE`
- Teal Dark: `#2c3c3d`
- Muted: `#5e6e6f`

## 🔤 Fonts

- **DM Serif Display** — Headings
- **DM Sans** — Body text

## 📱 Responsive Design

- Desktop (1024px+)
- Tablet (680px - 1023px)
- Mobile (<680px)

## 🔧 Configuration

### API Base URL
Edit `src/services/api.js` line 3 to change the API URL:

```javascript
const API_BASE_URL = 'http://127.0.0.1:8000/api';
```

### Vite Configuration
See `vite.config.js` for build and dev server settings.

## 📦 Dependencies

- **react** — UI library
- **react-dom** — React DOM rendering
- **react-router-dom** — Client-side routing

## ✅ Features Implemented

- [x] Responsive design (mobile, tablet, desktop)
- [x] File upload with drag-drop
- [x] Language selection (4 languages)
- [x] User details modal with BMI calculator
- [x] Report history management
- [x] API integration with FastAPI backend
- [x] localStorage persistence
- [x] Smooth navigation and animations
- [x] Error handling and validation

## 🚀 Deployment

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
```

The build output will be in the `dist` folder.

### Deploy to Netlify/Vercel
```bash
npm run build
# Then deploy the 'dist' folder
```

## 📝 Notes

- All data is stored in `localStorage` on the browser
- Backend at `http://127.0.0.1:8000` must be running
- No external UI libraries (pure CSS)
- Full keyboard navigation support
- Accessible modals with proper focus management

## 🤝 Contributing

When adding new pages:
1. Create component in `src/pages/`
2. Create stylesheet in `src/styles/`
3. Add route in `App.jsx`
4. Import styles in component

## 📞 Support

For issues or questions about the frontend, please refer to the API documentation in the backend README.
