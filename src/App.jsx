import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import * as Lucide from 'lucide-react';
import Home from './pages/Home.jsx';
import KycUpload from './pages/KycUpload.jsx';
import UserProfile from './pages/UserProfile.jsx';
import Terms from './pages/Terms.jsx';
import StressDashboard from './pages/StressDashboard.jsx';
import SecurityLock from './components/SecurityLock.jsx';

const Icon = ({ name, size = 18, className = "" }) => {
  const LucideIcon = Lucide[name];
  if (!LucideIcon) return null;
  return <LucideIcon size={size} className={className} />;
};

const NAV_ITEMS = [
  { path: '/', icon: 'ArrowRightLeft', label: 'Transfert' },
  { path: '/profile', icon: 'Clock', label: 'Historique' },
  { path: '/monitoring', icon: 'Activity', label: 'Live' },
  { path: '/terms', icon: 'Shield', label: 'Légal' },
];

function App() {
  const location = useLocation();
  const isActive = (path) => path === '/' ? (location.pathname === '/' || location.pathname === '/transfer') : location.pathname === path;

  return (
    <SecurityLock>
      <div style={{ minHeight: '100vh', background: 'var(--bg-secondary)' }}>
        {/* Navbar */}
        <nav className="navbar">
          <div className="nav-container">
            <Link to="/" className="nav-logo">GOSEND</Link>
            <div className="nav-links">
              <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}><Icon name="ArrowRightLeft" size={14} /> Transfert</Link>
              <Link to="/profile" className={`nav-link ${isActive('/profile') ? 'active' : ''}`}><Icon name="Clock" size={14} /> Historique</Link>
              <Link to="/monitoring" className={`nav-link ${isActive('/monitoring') ? 'active' : ''}`}><Icon name="Activity" size={14} /> Live</Link>
            </div>
          </div>
        </nav>

        {/* Content */}
        <main style={{ paddingTop: '64px' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/transfer" element={<Home />} />
            <Route path="/kyc" element={<KycUpload />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/monitoring" element={<StressDashboard />} />
            <Route path="*" element={<Home />} />
          </Routes>
          <footer className="app-footer">
            <p style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '12px' }}>
              GoSend • Fintech Côte d'Ivoire • 2026
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '24px' }}>
              <Link to="/terms" style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', textDecoration: 'none' }}>Cadre Légal</Link>
              <a href="https://wa.me/2250788661503" target="_blank" rel="noopener noreferrer" style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', textDecoration: 'none' }}>Support</a>
            </div>
          </footer>
        </main>

        {/* Bottom Nav */}
        <nav className="bottom-nav">
          <div className="bottom-nav-inner">
            {NAV_ITEMS.map(item => (
              <Link key={item.path} to={item.path} className={`bottom-nav-item ${isActive(item.path) ? 'active' : ''}`}>
                <Icon name={item.icon} size={20} />
                <span className="bottom-nav-label">{item.label}</span>
              </Link>
            ))}
          </div>
        </nav>

        {/* WhatsApp FAB — Desktop only */}
        <a href="https://wa.me/2250788661503" target="_blank" rel="noopener noreferrer" className="hide-on-mobile"
          style={{ position: 'fixed', bottom: '28px', right: '28px', zIndex: 50 }}>
          <button style={{
            width: '52px', height: '52px', background: 'linear-gradient(135deg, #6366F1, #7C3AED)', color: 'white',
            border: 'none', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 8px 24px rgba(99,102,241,0.3)', cursor: 'pointer',
          }}><Icon name="MessageCircle" size={24} /></button>
        </a>
      </div>
    </SecurityLock>
  );
}

export default App;
