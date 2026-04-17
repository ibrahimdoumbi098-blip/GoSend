import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { ShieldCheck, User, MessageCircle, FileText } from 'lucide-react';
import Home from './pages/Home';
import KycUpload from './pages/KycUpload';
import UserProfile from './pages/UserProfile';
import Terms from './pages/Terms';

function App() {
  const location = useLocation();

  return (
    <>
      <nav className="navbar">
        <div className="nav-container">
          <Link to="/" className="nav-logo">GoSend</Link>
          <div className="nav-links">
            <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>Transfert</Link>
            <Link to="/kyc" className={`nav-link ${location.pathname === '/kyc' ? 'active' : ''}`}>
              <ShieldCheck size={18} /> Vérification KYC
            </Link>
            <Link to="/profile" className={`nav-link ${location.pathname === '/profile' ? 'active' : ''}`}>
              <User size={18} /> Plafonds
            </Link>
            <Link to="/terms" className={`nav-link ${location.pathname === '/terms' ? 'active' : ''}`}>
              <FileText size={18} /> Légal
            </Link>
          </div>
        </div>
      </nav>

      <div className="main-layout">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/kyc" element={<KycUpload />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/terms" element={<Terms />} />
        </Routes>
      </div>
      
      <div className="floating-support" title="Support Client 24/7">
        <button><MessageCircle size={24} /></button>
      </div>
    </>
  );
}

export default App;
