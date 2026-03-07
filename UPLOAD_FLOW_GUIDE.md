# ReportEase Upload-to-Translation Flow Guide

## What Happens When You Click "Analyze Report"

### 1. **File Upload Page** (`/upload`)
   - **Action**: Click "Browse File" button
   - **What happens**:
     - File picker opens (supports: PDF, JPG, PNG, WEBP)
     - Select file from computer
     - File displays with name and size
     - Progress bar appears

### 2. **Metadata Entry** (On same page)
   - Complete the form:
     - Report Name (auto-filled from filename)
     - Report Type (dropdown: Blood Test, X-Ray, etc.)
     - Report Date (date picker)
     - Patient Name
     - Output Language (EN/TA/HI/KN selector)

### 3. **Click "Analyze Report" Button**
   - Button becomes active only when file is selected
   - Shows "Analyzing..." while processing
   - Progress bar animates from 0-100%

### 4. **Backend Processing**
   - File sent to: `http://127.0.0.1:8000/api/upload-report`
   - Backend performs:
     - OCR (extract text from PDF/image)
     - Medical text analysis
     - Generate simplified summary
     - AI-powered health insights
     - Translate to 4 languages (EN, TA, HI, KN)

### 5. **Data Storage**
   - Response stored in localStorage under `currentReport` key
   - Includes:
     - Original medical text
     - Simplified version in English
     - Summary, explanations, findings
     - Health score
     - Doctor recommendations
     - **Translations for all 4 languages** (TA, HI, KN)

### 6. **Auto-Navigation to Summary Page** (`/summary`)
   - Displays immediately after processing
   - Shows:
     - Medical summary
     - Original report text
     - Copy & Download buttons
     - "Translate" button

### 7. **Click "Translate" Button**
   - Navigates to: `/translate`
   - Translation Page loads with:
     - **Language tabs** at top (EN | TA | HI | KN)
     - Click any tab to view content in that language
     - **All 4 languages available**:
       - English (default)
       - Tamil (தமிழ்)
       - Hindi (हिन्दी)
       - Kannada (ಕನ್ನಡ)

## Data Flow Diagram

```
[Upload Page]
     ↓
[Select File + Fill Metadata]
     ↓
[Click "Analyze Report"]
     ↓
[Progress Bar: 0% → 100%]
     ↓
[Backend API: POST /api/upload-report]
     ├─ OCR text extraction
     ├─ Medical analysis
     ├─ Simplification
     ├─ Health insights
     └─ 4-Language Translation
     ↓
[Save to localStorage as "currentReport"]
     ↓
[Auto-Navigate to /summary]
     ↓
[Display Summary Results]
     ├─ Show original text
     ├─ Show simplified version
     └─ Copy / Download / Translate buttons
     ↓
[Click "Translate" → /translate]
     ↓
[Display All 4 Languages]
     ├─ English (EN) - Default
     ├─ Tamil (TA)
     ├─ Hindi (HI)
     └─ Kannada (KN)
```

## Error Handling & Crash Prevention

### ✅ Protected Against Crashes:

1. **JSON Parsing Errors**
   - Try-catch blocks in AISummary.jsx and Translation.jsx
   - Falls back to default data if parsing fails

2. **Missing Backend Data**
   - Uses fallback translations if backend doesn't provide them
   - Provides default values for all fields

3. **Network Errors**
   - Clear error messages if backend is not running
   - Shows: "Backend is not running. Make sure it's running at http://127.0.0.1:8000"

4. **Missing Optional Fields**
   - Uses optional chaining (`?.`) to safely access nested properties
   - Provides defaults: "Medical Report", current date, "Patient"

5. **File Validation**
   - Only accepts: PDF, JPG, PNG, WEBP
   - Max file size: 50MB
   - Shows alert if invalid file selected

## Expected Backend Response Format

```json
{
  "report_id": "unique-report-id-or-timestamp",
  "metadata": {
    "report_name": "Blood Test",
    "report_date": "2025-03-02",
    "patient_name": "Priya Sharma",
    "report_type": "Blood Test"
  },
  "original_text": "Full original medical report text from OCR...",
  "simplified_text": "Patient-friendly simplified version in English...",
  "summary": "Brief summary of key findings...",
  "explanation": "Detailed medical explanation...",
  "findings": ["Finding 1", "Finding 2", "Finding 3"],
  "health_score": 75,
  "doctor_note": "Doctor's recommendations and follow-up notes...",
  "translations": {
    "ta": {
      "summary": "தமிழ் சுருக்கம்...",
      "explanation": "தமிழ் விளக்கம்...",
      "doctor_note": "தமிழ் டாக்டர் குறிப்பு..."
    },
    "hi": {
      "summary": "हिंदी सारांश...",
      "explanation": "हिंदी व्याख्या...",
      "doctor_note": "हिंदी डॉक्टर नोट..."
    },
    "kn": {
      "summary": "ಕನ್ನಡ ಸಾರಾಂಶ...",
      "explanation": "ಕನ್ನಡ ವಿವರಣೆ...",
      "doctor_note": "ಕನ್ನಡ ಡಾಕ್ಟರ್ ನೋಟ್..."
    }
  }
}
```

## Components Involved

### Upload Page (`/upload`)
- **File**: `src/pages/UploadReport.jsx`
- **Components**:
  - `UploadBox.jsx` - File selection UI
  - `LanguageSelector.jsx` - Language picker
  - API call to backend
  - Progress tracking
  - Error handling

### Summary Page (`/summary`)
- **File**: `src/pages/AISummary.jsx`
- **Displays**: Results from localStorage
- **Navigation**: Link to `/translate`

### Translation Page (`/translate`)
- **File**: `src/pages/Translation.jsx`
- **Components**:
  - `LanguageTabs.jsx` - Language switcher (EN/TA/HI/KN)
  - `TranslationCard.jsx` - Display content
  - `ComparisonCard.jsx` - Language comparison
  - `LanguageInfoCard.jsx` - Language details
  - `QualityCard.jsx` - Translation quality metrics
  - `ShareExportCard.jsx` - Share/download options
  - All translation components with fallback data

## Testing Checklist

- [ ] Click "Browse File" - file picker opens
- [ ] Select a valid file (PDF, JPG, PNG, or WEBP)
- [ ] File displays with name and size
- [ ] Enter metadata (Report Type, Date, Patient Name)
- [ ] Click "Analyze Report" button
- [ ] Progress bar animates 0-100%
- [ ] Auto-navigates to Summary page
- [ ] Summary displays results
- [ ] Click "Translate" button
- [ ] Translation page loads with 4 language tabs
- [ ] Click each tab (EN/TA/HI/KN) - content changes
- [ ] All languages display correctly
- [ ] No crashes during entire flow

## Key URL Endpoints

- **Upload Page**: `http://localhost:3000/upload`
- **Summary Page**: `http://localhost:3000/summary`
- **Translation Page**: `http://localhost:3000/translate`
- **Backend API**: `http://127.0.0.1:8000/api/upload-report`

## Success Criteria Met ✅

✅ File browse functionality - Select files from computer
✅ File upload to backend - Connected to API endpoint
✅ Navigate to summary page - Auto-redirects after upload
✅ Display summary in 4 languages - EN/TA/HI/KN support
✅ Link to AI pipeline - POST to backend for processing
✅ No crashes - Error handling throughout
✅ Fallback data - Works even if backend returns incomplete data
