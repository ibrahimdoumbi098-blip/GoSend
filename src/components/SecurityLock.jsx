import React, { useState } from 'react';
import * as Lucide from 'lucide-react';

const Icon = ({ name, size = 24, className = "" }) => {
  const LucideIcon = Lucide[name];
  if (!LucideIcon) return null;
  return <LucideIcon size={size} className={className} />;
};

export default function SecurityLock({ children }) {
  const [isLocked, setIsLocked] = useState(() => !sessionStorage.getItem('gosend_unlocked'));
  const [pin, setPin] = useState('');
  const [storedPin, setStoredPin] = useState(localStorage.getItem('gosend_pin'));
  const [error, setError] = useState(false);
  const [biometricSim, setBiometricSim] = useState(false);

  const handleNumber = (num) => {
    if (pin.length < 4) {
      const newPin = pin + num;
      setPin(newPin);
      if (newPin.length === 4) verifyPin(newPin);
    }
  };

  const unlock = () => { sessionStorage.setItem('gosend_unlocked', '1'); setIsLocked(false); };

  const verifyPin = (inputPin) => {
    if (!storedPin) {
      localStorage.setItem('gosend_pin', inputPin);
      setStoredPin(inputPin);
      unlock();
    } else if (inputPin === storedPin) {
      unlock();
    } else {
      setError(true);
      setTimeout(() => { setPin(''); setError(false); }, 500);
    }
  };

  const handleFaceID = () => {
    setBiometricSim(true);
    setTimeout(() => { unlock(); setBiometricSim(false); }, 1200);
  };

  if (!isLocked) return children;

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

      <div style={{ width: '100%', maxWidth: '320px', position: 'relative', zIndex: 10, textAlign: 'center' }}>
        {/* Icon */}
        <div style={{
          width: '72px', height: '72px', borderRadius: '24px',
          background: 'linear-gradient(135deg, #EEF2FF, #F5F3FF)',
          border: '1px solid #E0E7FF',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 20px',
          boxShadow: '0 8px 32px rgba(99,102,241,0.08)',
        }}>
          <Icon name={biometricSim ? "ScanFace" : "ShieldCheck"} size={32} className="" style={{ color: '#6366F1' }} />
        </div>

        <h1 style={{ fontSize: '1.4rem', fontWeight: 900, letterSpacing: '-0.04em', color: '#0F172A', marginBottom: '4px' }}>GoSend</h1>
        <p style={{ fontSize: '11px', fontWeight: 600, color: '#94A3B8', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '32px' }}>
          {!storedPin ? "Créez votre code PIN" : "Entrez votre code PIN"}
        </p>

        {/* PIN dots */}
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginBottom: '32px' }}>
          {[0, 1, 2, 3].map((i) => (
            <div key={i} style={{
              width: '14px', height: '14px', borderRadius: '50%',
              border: `2px solid ${error ? '#EF4444' : pin.length > i ? '#6366F1' : '#E2E8F0'}`,
              background: error ? '#EF4444' : pin.length > i ? '#6366F1' : 'transparent',
              transition: 'all 0.2s ease',
              transform: pin.length > i ? 'scale(1.15)' : 'scale(1)',
              boxShadow: pin.length > i ? '0 0 12px rgba(99,102,241,0.3)' : 'none',
            }} />
          ))}
        </div>

        {/* Keypad */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '20px' }}>
          {[1,2,3,4,5,6,7,8,9].map((num) => (
            <button key={num} onClick={() => handleNumber(num.toString())} style={{
              height: '56px', borderRadius: '16px', border: '1px solid #E2E8F0',
              background: 'white', color: '#0F172A', fontSize: '18px', fontWeight: 700,
              cursor: 'pointer', transition: 'all 0.15s', fontFamily: 'Inter, sans-serif',
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            }}>{num}</button>
          ))}
          <button onClick={handleFaceID} style={{
            height: '56px', borderRadius: '16px', border: 'none', background: 'transparent',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#6366F1',
          }}><Icon name="ScanFace" size={24} /></button>
          <button onClick={() => handleNumber('0')} style={{
            height: '56px', borderRadius: '16px', border: '1px solid #E2E8F0',
            background: 'white', color: '#0F172A', fontSize: '18px', fontWeight: 700,
            cursor: 'pointer', fontFamily: 'Inter, sans-serif', boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
          }}>0</button>
          <button onClick={() => setPin(pin.slice(0, -1))} style={{
            height: '56px', borderRadius: '16px', border: 'none', background: 'transparent',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#EF4444',
          }}><Icon name="Delete" size={20} /></button>
        </div>

        <p style={{ fontSize: '10px', color: '#CBD5E1', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase' }}>
          Fintech Security • AES-256
        </p>
      </div>
    </div>
  );
}
