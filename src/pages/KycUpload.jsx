import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as Lucide from 'lucide-react';

const Icon = ({ name, size = 18, style = {} }) => {
  const LucideIcon = Lucide[name];
  if (!LucideIcon) return null;
  return <LucideIcon size={size} style={style} />;
};

export default function KycUpload() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('idle');
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) setFile(e.target.files[0]);
  };

  const handleSimulatedLaunch = () => {
    if (!file) return;
    setStatus('uploading');
    const interval = setInterval(() => {
      setProgress(prev => { if (prev >= 100) { clearInterval(interval); return 100; } return prev + 10; });
    }, 200);
    setTimeout(() => {
      const API_URL = import.meta.env.VITE_API_URL || '';
      fetch(`${API_URL}/api/kyc`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ user_id: 'GOS-943029' }) })
        .then(() => { setStatus('success'); setTimeout(() => navigate('/profile'), 2000); });
    }, 2500);
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '24px 16px 40px' }}>
      <Link to="/profile" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', textDecoration: 'none', fontSize: '12px', fontWeight: 600, marginBottom: '24px' }}>
        <Icon name="ArrowLeft" size={14} /> Retour au profil
      </Link>

      <div className="transfer-card" style={{ padding: '40px 32px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '20px', background: '#ECFDF5', border: '1px solid #A7F3D0', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
            <Icon name="Shield" size={32} style={{ color: '#10B981' }} />
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.03em', marginBottom: '4px' }}>Vérification d'Identité</h1>
          <p style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>Passer au Niveau 2 — 2M FCFA / jour</p>
        </div>

        {status === 'idle' && (
          <div>
            <div
              onClick={() => document.getElementById('kyc-file').click()}
              style={{
                border: `2px dashed ${file ? '#10B981' : 'var(--border-light)'}`,
                borderRadius: 'var(--radius-lg)',
                padding: '48px 24px',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s',
                background: file ? '#ECFDF5' : 'var(--bg-secondary)',
                marginBottom: '20px',
              }}
            >
              <input type="file" id="kyc-file" style={{ display: 'none' }} onChange={handleFileChange} accept="image/*,.pdf" />
              <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: file ? '#D1FAE5' : 'var(--bg-tertiary)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
                <Icon name={file ? "FileCheck" : "UploadCloud"} size={24} style={{ color: file ? '#10B981' : 'var(--text-muted)' }} />
              </div>
              {file ? (
                <p style={{ fontSize: '13px', fontWeight: 700, color: '#10B981' }}>{file.name}</p>
              ) : (
                <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>Cliquez pour téléverser votre CNI ou Passeport</p>
              )}
              <p style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 600, marginTop: '8px' }}>JPG, PNG, PDF — Max 5MB</p>
            </div>

            <div style={{ background: 'var(--bg-secondary)', padding: '16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)', display: 'flex', gap: '12px', marginBottom: '20px' }}>
              <Icon name="Info" size={18} style={{ color: 'var(--accent-primary)', flexShrink: 0, marginTop: '2px' }} />
              <p style={{ fontSize: '11px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                La vérification est traitée par notre IA sécurisée. Vos données sont supprimées immédiatement après validation.
              </p>
            </div>

            <button onClick={handleSimulatedLaunch} disabled={!file} className="transfer-btn">
              Démarrer la vérification
            </button>
          </div>
        )}

        {status === 'uploading' && (
          <div style={{ textAlign: 'center', padding: '32px 0' }}>
            <div style={{ width: '56px', height: '56px', border: '3px solid var(--border-light)', borderTopColor: 'var(--accent-primary)', borderRadius: '50%', animation: 'spinner 0.8s linear infinite', margin: '0 auto 20px' }} />
            <p style={{ fontSize: '12px', fontWeight: 700, color: 'var(--accent-primary)', letterSpacing: '0.1em', marginBottom: '20px' }}>Analyse en cours... {progress}%</p>
            <div style={{ width: '100%', height: '4px', background: 'var(--bg-tertiary)', borderRadius: '100px', overflow: 'hidden' }}>
              <div style={{ width: `${progress}%`, height: '100%', background: 'var(--accent-primary)', borderRadius: '100px', transition: 'width 0.3s ease' }} />
            </div>
          </div>
        )}

        {status === 'success' && (
          <div style={{ textAlign: 'center', padding: '32px 0' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#ECFDF5', border: '1px solid #A7F3D0', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
              <Icon name="CheckCircle" size={32} style={{ color: '#10B981' }} />
            </div>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '4px' }}>Vérification Réussie</h2>
            <p style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '20px' }}>Plafonds passés à 2 000 000 FCFA / jour</p>
            <div style={{ width: '100%', height: '3px', background: 'var(--bg-tertiary)', borderRadius: '100px', overflow: 'hidden' }}>
              <div className="animate-progress" style={{ height: '100%', background: '#10B981', borderRadius: '100px' }} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
