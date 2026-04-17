import React, { useState } from 'react';

export default function Home() {
  const [amount, setAmount] = useState('');
  const [fromNetwork, setFromNetwork] = useState('orange');
  const [toNetwork, setToNetwork] = useState('wave');
  const [phone, setPhone] = useState('');
  const [confirmPhone, setConfirmPhone] = useState('');
  const [error, setError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  const networks = [
    { id: 'orange', name: 'Orange', colorClass: 'orange', dotClass: 'dot-orange' },
    { id: 'mtn', name: 'MTN', colorClass: 'mtn', dotClass: 'dot-mtn' },
    { id: 'moov', name: 'Moov', colorClass: 'moov', dotClass: 'dot-moov' },
    { id: 'wave', name: 'Wave', colorClass: 'wave', dotClass: 'dot-wave' }
  ];

  const feeRate = 0.015;
  const numAmount = parseFloat(amount.replace(/\s/g, ''));
  const fee = (!isNaN(numAmount) && numAmount > 0) ? numAmount * feeRate : 0;
  const total = (!isNaN(numAmount) && numAmount > 0) ? numAmount + fee : 0;

  const handleTransfer = async () => {
    setError('');
    
    if (!amount || numAmount < 500) {
      setError('Le montant minimum est de 500 FCFA.');
      return;
    }
    if (fromNetwork === toNetwork) {
      setError('Veuillez choisir deux réseaux différents.');
      return;
    }
    if (!phone || phone.length < 10) {
      setError('Le numéro doit comporter au moins 10 chiffres.');
      return;
    }
    if (phone !== confirmPhone) {
      setError('Les numéros de téléphone ne correspondent pas.');
      return;
    }

    setIsProcessing(true);
    
    try {
      // 🔗 Connexion Dynamique : Bascule du mode Local (Développement) au mode en Ligne (Serveur Vercel/Railway Production)
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      
      const response = await fetch(`${API_URL}/api/transfer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: 'GOS-943029', // Le compte de test connecté à la base de données
          amount: numAmount,
          from_network: fromNetwork,
          to_network: toNetwork
        })
      });

      const data = await response.json();

      if (!response.ok) {
        // L'API a bloqué le transfert (Ex: Règle anti-blanchiment déclenchée)
        throw new Error(data.error || "Le transfert a été refusé par le serveur.");
      }

      // Succès Confirmé par la Base de Données !
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setAmount('');
        setPhone('');
        setConfirmPhone('');
      }, 4000);
      
    } catch (err) {
      setError(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const currentToNetwork = networks.find(n => n.id === toNetwork);

  return (
    <div className="container">
      <div className="header">
        <h1 className="logo">GoSend</h1>
        <p className="tagline">Envoyez l'argent où vous voulez, instantanément.</p>
      </div>

      <div className="card">
        {success && (
          <div className="success-overlay">
            <div className="success-icon">✓</div>
            <h2 style={{margin: '0 0 10px'}}>Transfert Confirmé !</h2>
            <p style={{color: 'var(--text-muted)', textAlign: 'center', padding: '0 20px'}}>
              Enregistré en Base de Données. {numAmount} FCFA vers le compte {currentToNetwork?.name} ont été traités.
            </p>
          </div>
        )}

        {error && (
          <div className="error-msg">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
            {error}
          </div>
        )}

        <div className="input-group">
          <span className="label">1. J'envoie depuis (Mon réseau)</span>
          <div className="network-selector">
            {networks.map(net => (
              <button 
                key={`from-${net.id}`}
                className={`network-btn ${net.colorClass} ${fromNetwork === net.id ? 'active' : ''}`}
                onClick={() => setFromNetwork(net.id)}
              >
                <span className={`network-dot ${net.dotClass}`}></span> {net.name}
              </button>
            ))}
          </div>
        </div>

        <div className="input-group">
          <span className="label">2. Vers (Réseau du destinataire)</span>
          <div className="network-selector">
            {networks.map(net => (
              <button 
                key={`to-${net.id}`}
                className={`network-btn ${net.colorClass} ${toNetwork === net.id ? 'active' : ''}`}
                onClick={() => setToNetwork(net.id)}
              >
                <span className={`network-dot ${net.dotClass}`}></span> {net.name}
              </button>
            ))}
          </div>
        </div>

        <div className="input-group">
          <span className="label">Montant à transférer</span>
          <input 
            type="tel" 
            className="amount-input" 
            placeholder="5 000" 
            value={amount}
            onChange={(e) => setAmount(e.target.value.replace(/[^0-9]/g, ''))}
          />
          <span className="currency-badge">FCFA</span>
        </div>

        <div className="input-group">
          <span className="label">Numéro du destinataire ({currentToNetwork?.name})</span>
          <input 
            type="tel" 
            className="phone-input" 
            placeholder="0X XX XX XX XX" 
            value={phone}
            onChange={(e) => setPhone(e.target.value.replace(/[^0-9\s+]/g, ''))}
            maxLength={14}
          />
        </div>

        <div className="input-group" style={{ marginBottom: phone.length > 5 ? '25px' : '15px' }}>
          <span className="label">
            Retapez le numéro
            {phone && confirmPhone && phone === confirmPhone && <span style={{color: 'var(--success)'}}>✓ Correspond</span>}
          </span>
          <input 
            type="tel" 
            className="phone-input" 
            placeholder="Confirmer le numéro..." 
            value={confirmPhone}
            onChange={(e) => setConfirmPhone(e.target.value.replace(/[^0-9\s+]/g, ''))}
            onPaste={(e) => e.preventDefault()}
            maxLength={14}
          />
        </div>

        <div className="fee-display">
          <span>Frais de transfert (1.5%)</span>
          <span className="fee-value">{Math.round(fee).toLocaleString('fr-FR')} F</span>
        </div>
        
        <div className="fee-display" style={{background: 'rgba(79, 70, 229, 0.1)', border: 'none', marginBottom: '25px', padding: '20px'}}>
          <span>Total à payer via l'app {networks.find(n=>n.id===fromNetwork)?.name} :</span>
          <span className="fee-value" style={{color: `var(--${fromNetwork === 'orange' ? 'orange' : fromNetwork})`, fontSize:'1.2rem'}}>
            {Math.round(total).toLocaleString('fr-FR')} F
          </span>
        </div>

        <button 
          className="submit-btn" 
          onClick={handleTransfer}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <div className="spinner"></div>
          ) : (
            'Transférer Maintenant'
          )}
        </button>
      </div>
    </div>
  );
}
