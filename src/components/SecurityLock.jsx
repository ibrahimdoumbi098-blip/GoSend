import React, { useState, useEffect } from 'react';
import * as Lucide from 'lucide-react';

const Icon = ({ name, size = 24, className = "", style = {} }) => {
  const LucideIcon = Lucide[name];
  if (!LucideIcon) return null;
  return <LucideIcon size={size} className={className} style={style} />;
};

export default function SecurityLock({ children }) {
  const [isLocked, setIsLocked] = useState(() => !sessionStorage.getItem('gosend_unlocked'));
  const [storedPhone, setStoredPhone] = useState(localStorage.getItem('gosend_phone'));
  const [storedPin, setStoredPin] = useState(localStorage.getItem('gosend_pin'));
  
  // Step: 'phone', 'otp', 'create_pin', 'enter_pin'
  const [step, setStep] = useState(storedPhone && storedPin ? 'enter_pin' : 'phone');
  
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [biometricSim, setBiometricSim] = useState(false);
  
  // Device detection for FaceID
  const [isMobile, setIsMobile] = useState(true);
  useEffect(() => {
    setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || window.innerWidth < 768);
  }, []);

  const unlock = () => { sessionStorage.setItem('gosend_unlocked', '1'); setIsLocked(false); };

  // Handlers for Phone Screen
  const handlePhoneSubmit = (e) => {
    e.preventDefault();
    if (phone.length >= 8) {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setStep('otp');
      }, 1500);
    }
  };

  // Handlers for Keypad (OTP and PIN)
  const handleKeypad = (num) => {
    if (step === 'otp') {
      if (otp.length < 4) {
        const newOtp = otp + num;
        setOtp(newOtp);
        if (newOtp.length === 4) {
          setLoading(true);
          setTimeout(() => {
            setLoading(false);
            setStep('create_pin');
          }, 1200);
        }
      }
    } else if (step === 'create_pin') {
      if (pin.length < 4) {
        const newPin = pin + num;
        setPin(newPin);
        if (newPin.length === 4) {
          localStorage.setItem('gosend_phone', phone);
          localStorage.setItem('gosend_pin', newPin);
          setStoredPhone(phone);
          setStoredPin(newPin);
          unlock();
        }
      }
    } else if (step === 'enter_pin') {
      if (pin.length < 4) {
        const newPin = pin + num;
        setPin(newPin);
        if (newPin.length === 4) {
          if (newPin === storedPin) {
            unlock();
          } else {
            setError(true);
            setTimeout(() => { setPin(''); setError(false); }, 500);
          }
        }
      }
    }
  };

  const handleBackspace = () => {
    if (step === 'otp') setOtp(prev => prev.slice(0, -1));
    else setPin(prev => prev.slice(0, -1));
  };

  const handleFaceID = () => {
    setBiometricSim(true);
    setTimeout(() => { unlock(); setBiometricSim(false); }, 1200);
  };

  const resetAccount = () => {
    localStorage.removeItem('gosend_phone');
    localStorage.removeItem('gosend_pin');
    setStoredPhone(null);
    setStoredPin(null);
    setPin('');
    setOtp('');
    setPhone('');
    setStep('phone');
  };

  if (!isLocked) return children;

  const renderKeypad = () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '20px' }}>
      {[1,2,3,4,5,6,7,8,9].map((num) => (
        <button key={num} onClick={() => handleKeypad(num.toString())} style={{
          height: '56px', borderRadius: '16px', border: '1px solid #E2E8F0',
          background: 'white', color: '#0F172A', fontSize: '18px', fontWeight: 700,
          cursor: 'pointer', transition: 'all 0.15s', fontFamily: 'Inter, sans-serif',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        }}>{num}</button>
      ))}
      {step === 'enter_pin' && isMobile ? (
        <button onClick={handleFaceID} style={{ height: '56px', borderRadius: '16px', border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6366F1' }}>
          <Icon name="ScanFace" size={24} />
        </button>
      ) : <div />}
      <button onClick={() => handleKeypad('0')} style={{
        height: '56px', borderRadius: '16px', border: '1px solid #E2E8F0',
        background: 'white', color: '#0F172A', fontSize: '18px', fontWeight: 700,
        cursor: 'pointer', transition: 'all 0.15s', fontFamily: 'Inter, sans-serif',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
      }}>0</button>
      <button onClick={handleBackspace} style={{ height: '56px', borderRadius: '16px', border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94A3B8' }}>
        <Icon name="Delete" size={24} />
      </button>
    </div>
  );

  const renderDots = (value, length = 4) => (
    <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginBottom: '32px' }}>
      {[...Array(length)].map((_, i) => (
        <div key={i} style={{
          width: '14px', height: '14px', borderRadius: '50%',
          border: `2px solid ${error ? '#EF4444' : value.length > i ? '#6366F1' : '#E2E8F0'}`,
          background: error ? '#EF4444' : value.length > i ? '#6366F1' : 'transparent',
          transition: 'all 0.2s ease',
          transform: value.length > i ? 'scale(1.15)' : 'scale(1)',
          boxShadow: value.length > i ? '0 0 12px rgba(99,102,241,0.3)' : 'none',
        }} />
      ))}
    </div>
  );

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: 'linear-gradient(180deg, #FFFFFF 0%, #F1F5F9 100%)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: '24px', fontFamily: 'Inter, sans-serif',
    }}>
      {/* Subtle gradient orbs */}
      <div style={{ position: 'absolute', top: '10%', left: '20%', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(99,102,241,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '10%', right: '20%', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(139,92,246,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ width: '100%', maxWidth: '340px', position: 'relative', zIndex: 10, textAlign: 'center' }}>
        
        {step === 'phone' && (
          <div className="animate-fade-up">
            <div style={{ width: '72px', height: '72px', borderRadius: '24px', background: 'linear-gradient(135deg, #EEF2FF, #F5F3FF)', border: '1px solid #E0E7FF', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', boxShadow: '0 8px 32px rgba(99,102,241,0.08)' }}>
              <Icon name="Smartphone" size={32} style={{ color: '#6366F1' }} />
            </div>
            <h1 style={{ fontSize: '1.4rem', fontWeight: 900, letterSpacing: '-0.04em', color: '#0F172A', marginBottom: '8px' }}>Bienvenue sur GoSend</h1>
            <p style={{ fontSize: '0.9rem', color: '#64748B', marginBottom: '32px' }}>Entrez votre numéro pour continuer.</p>
            
            <form onSubmit={handlePhoneSubmit}>
              <div style={{ display: 'flex', alignItems: 'center', background: 'white', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '12px 16px', marginBottom: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                <span style={{ fontWeight: 800, color: '#0F172A', borderRight: '1px solid #E2E8F0', paddingRight: '12px', marginRight: '12px' }}>+225</span>
                <input 
                  type="tel" 
                  value={phone} 
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  placeholder="05 00 00 00 00"
                  style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '18px', fontWeight: 700, width: '100%', color: '#0F172A' }}
                  autoFocus
                />
              </div>
              <button 
                type="submit" 
                disabled={phone.length < 8 || loading}
                style={{ width: '100%', padding: '16px', borderRadius: '16px', border: 'none', background: phone.length >= 8 ? 'linear-gradient(135deg, #6366F1, #7C3AED)' : '#E2E8F0', color: phone.length >= 8 ? 'white' : '#94A3B8', fontSize: '14px', fontWeight: 800, cursor: phone.length >= 8 ? 'pointer' : 'not-allowed', transition: 'all 0.2s', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', boxShadow: phone.length >= 8 ? '0 8px 24px rgba(99,102,241,0.3)' : 'none' }}
              >
                {loading ? <Icon name="Loader2" size={18} className="spin" /> : "Continuer"} <Icon name="ArrowRight" size={16} />
              </button>
            </form>
          </div>
        )}

        {step === 'otp' && (
          <div className="animate-fade-up">
            <div style={{ width: '72px', height: '72px', borderRadius: '24px', background: 'linear-gradient(135deg, #ECFDF5, #F0FDF4)', border: '1px solid #D1FAE5', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', boxShadow: '0 8px 32px rgba(16,185,129,0.08)' }}>
              <Icon name="MessageSquare" size={32} style={{ color: '#10B981' }} />
            </div>
            <h1 style={{ fontSize: '1.4rem', fontWeight: 900, letterSpacing: '-0.04em', color: '#0F172A', marginBottom: '8px' }}>Vérification SMS</h1>
            <p style={{ fontSize: '0.9rem', color: '#64748B', marginBottom: '32px' }}>Code envoyé au +225 {phone}</p>
            
            {loading ? (
              <div style={{ padding: '40px 0', display: 'flex', justifyContent: 'center' }}>
                <Icon name="Loader2" size={32} className="spin" style={{ color: '#6366F1' }} />
              </div>
            ) : (
              <>
                {renderDots(otp)}
                {renderKeypad()}
              </>
            )}
          </div>
        )}

        {step === 'create_pin' && (
          <div className="animate-fade-up">
            <div style={{ width: '72px', height: '72px', borderRadius: '24px', background: 'linear-gradient(135deg, #EEF2FF, #F5F3FF)', border: '1px solid #E0E7FF', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', boxShadow: '0 8px 32px rgba(99,102,241,0.08)' }}>
              <Icon name="Lock" size={32} style={{ color: '#6366F1' }} />
            </div>
            <h1 style={{ fontSize: '1.4rem', fontWeight: 900, letterSpacing: '-0.04em', color: '#0F172A', marginBottom: '8px' }}>Sécurisez l'app</h1>
            <p style={{ fontSize: '0.9rem', color: '#64748B', marginBottom: '32px' }}>Créez votre code PIN à 4 chiffres.</p>
            {renderDots(pin)}
            {renderKeypad()}
          </div>
        )}

        {step === 'enter_pin' && (
          <div className="animate-fade-up">
            <div style={{ width: '72px', height: '72px', borderRadius: '24px', background: 'linear-gradient(135deg, #EEF2FF, #F5F3FF)', border: '1px solid #E0E7FF', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', boxShadow: '0 8px 32px rgba(99,102,241,0.08)' }}>
              <Icon name={biometricSim ? "ScanFace" : "ShieldCheck"} size={32} style={{ color: '#6366F1' }} />
            </div>
            <h1 style={{ fontSize: '1.4rem', fontWeight: 900, letterSpacing: '-0.04em', color: '#0F172A', marginBottom: '4px' }}>Bon retour</h1>
            <p style={{ fontSize: '11px', fontWeight: 600, color: '#94A3B8', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '32px' }}>
              Entrez votre code PIN
            </p>
            {renderDots(pin)}
            {renderKeypad()}
            <button onClick={resetAccount} style={{ background: 'none', border: 'none', color: '#94A3B8', fontSize: '12px', marginTop: '16px', cursor: 'pointer', textDecoration: 'underline' }}>
              Ce n'est pas vous ? Se déconnecter.
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
