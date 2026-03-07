import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import UploadPage from './pages/UploadPage';
import AISummary from './pages/AISummary';
import Translation from './pages/Translation';
import SummaryPage from './pages/SummaryPage';
import HealthInsights from './pages/HealthInsights';
import './styles/global.css';
import './styles/navbar.css';
import './styles/dropdown.css';
import './styles/modal.css';
import './styles/reports-modal.css';
import './styles/footer.css';
import './styles/language-selector.css';
import './styles/report-card.css';
import './styles/summary-page.css';
import './styles/summary-navbar.css';
import './styles/translation.css';
import './styles/homepage.css';
import './styles/upload.css';

export default function App() {
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showReportsModal, setShowReportsModal] = useState(false);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    // Initialize userId in localStorage if not present
    if (!localStorage.getItem('userId')) {
      localStorage.setItem('userId', `user_${Date.now()}`);
    }
  }, []);

  return (
    <Router>
      <div className="app">
        <Navbar
          onDetailsOpen={() => setShowDetailsModal(true)}
          onReportsOpen={() => setShowReportsModal(true)}
          userName={userName}
        />
        <Routes>
          <Route
            path="/"
            element={
              <HomePage
                showDetailsModal={showDetailsModal}
                setShowDetailsModal={setShowDetailsModal}
                showReportsModal={showReportsModal}
                setShowReportsModal={setShowReportsModal}
                onNameUpdate={setUserName}
              />
            }
          />
          <Route path="/upload" element={<UploadPage />} />
          <Route path="/summary" element={<AISummary />} />
          <Route path="/summary/:reportId" element={<SummaryPage />} />
          <Route path="/translate" element={<Translation />} />
          <Route path="/translation/:reportId" element={<Translation />} />
          <Route path="/insights" element={<HealthInsights />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}
