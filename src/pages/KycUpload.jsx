import React, { useState } from 'react';
import { UploadCloud, CheckCircle, ShieldAlert, Camera } from 'lucide-react';

export default function KycUpload() {
  const [status, setStatus] = useState('pending');

  const handleUpload = async () => {
    setStatus('processing');
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const response = await fetch(`${API_URL}/api/kyc`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: 'GOS-943029' })
      });
      
      if (!response.ok) throw new Error('Erreur serveur');
      
      setStatus('verified');
    } catch (err) {
      console.error(err);
      setStatus('pending');
      alert("Une erreur est survenue lors de l'envoi de vos documents.");
    }
  };

  return (
    <div className="container" style={{maxWidth: '600px'}}>
      <div className="header" style={{marginBottom: '20px'}}>
         <h2 style={{color: 'white', fontSize:'2rem', margin: '0 0 10px'}}>Vérification d'Identité</h2>
         <p className="tagline">Passez au Niveau 2 selon les directives de la BCEAO.</p>
      </div>

      <div className="card" style={{borderTop: '4px solid var(--primary)'}}>
        
        {status === 'verified' ? (
          <div style={{textAlign: 'center', padding: '40px 20px'}}>
            <CheckCircle size={60} color="var(--success)" style={{marginBottom: '20px'}} />
             <h2 style={{margin: '0 0 10px'}}>Niveau 2 Atteint !</h2>
             <p style={{color: 'var(--text-muted)', marginBottom: '30px'}}>
               Votre identité a été confirmée avec succès. Vous pouvez désormais transférer jusqu'à <strong>2 000 000 FCFA</strong> par jour.
             </p>
             <button className="submit-btn" onClick={() => window.location.href = '/'}>Faire un transfert</button>
          </div>
        ) : (
          <>
            <div className="level-banner">
              <ShieldAlert size={24} color="var(--orange)" />
              <div>
                <strong>Niveau actuel : Niveau 1</strong><br/>
                <span style={{fontSize: '0.85rem'}}>Plafond bloqué à 100 000 FCFA / jour</span>
              </div>
            </div>

            <h3 style={{marginTop: '0'}}>Documents Requis</h3>
            
            <div className="upload-box">
              <UploadCloud size={40} color="var(--primary)" />
              <p style={{margin: '10px 0'}}><strong>Carte Nationale d'Identité (CNI) ou Passeport</strong></p>
              <p style={{fontSize: '0.85rem', color: 'var(--text-muted)', margin: '0'}}>Format JPEG, PNG ou PDF (Max 5MB)</p>
              <button className="secondary-btn">Sélectionner le fichier</button>
            </div>

            <div className="upload-box" style={{marginTop: '20px'}}>
              <Camera size={40} color="var(--wave)" />
              <p style={{margin: '10px 0'}}><strong>Selfie de sécurité</strong></p>
              <p style={{fontSize: '0.85rem', color: 'var(--text-muted)', margin: '0'}}>Prenez un selfie bien éclairé</p>
              <button className="secondary-btn">Ouvrir la caméra</button>
            </div>

            <div style={{marginTop: '30px', padding: '15px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', fontSize: '0.85rem', color: 'var(--text-muted)'}}>
              🔒 GoSend chiffre vos données personnelles et ne les partage pas avec des tiers. Vérification conforme aux normes anti-blanchiment (AML).
            </div>

            <button 
              className="submit-btn" 
              style={{marginTop: '20px'}}
              onClick={handleUpload}
              disabled={status === 'processing'}
            >
              {status === 'processing' ? <div className="spinner"></div> : 'Soumettre mes documents'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
