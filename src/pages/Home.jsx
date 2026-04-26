import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import * as Lucide from 'lucide-react';
import TransactionReceipt from '../components/TransactionReceipt.jsx';
import LandingPage from '../components/LandingPage.jsx';
import { OperatorLogo, OPERATORS } from '../components/OperatorLogos.jsx';

const Icon = ({ name, size = 20, className = "", style = {} }) => {
  const LucideIcon = Lucide[name];
  if (!LucideIcon) return null;
  return <LucideIcon size={size} className={className} style={style} />;
};

export default function Home() {
  const [showTransfer, setShowTransfer] = useState(false);
  const [amount, setAmount] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [senderOperator, setSenderOperator] = useState(null);
  const [receiverOperator, setReceiverOperator] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [processingStep, setProcessingStep] = useState(0);
  const [finalTransaction, setFinalTransaction] = useState(null);
  const [recentTx, setRecentTx] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const API_URL = import.meta.env.VITE_API_URL || '';
    fetch(`${API_URL}/api/transactions`)
      .then(res => res.json())
      .then(data => { if (Array.isArray(data)) setRecentTx(data.slice(0, 3)); })
      .catch(() => {});
  }, [success]);

  // Check if user has visited before
  useEffect(() => {
    if (localStorage.getItem('gosend_visited')) setShowTransfer(true);
  }, []);

  const handleStartTransfer = () => {
    localStorage.setItem('gosend_visited', 'true');
    setShowTransfer(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTransfer = async () => {
    if (!senderOperator || !receiverOperator) return setError("Sélectionnez les opérateurs");
    if (!amount || parseInt(amount) < 500) return setError("Montant minimum : 500 FCFA");
    if (phoneNumber.length < 10) return setError("Numéro invalide (10 chiffres)");

    setIsLoading(true); setError(null); setSuccess(null); setProcessingStep(1);
    try {
      const API_URL = import.meta.env.VITE_API_URL || '';
      const uuid = typeof crypto.randomUUID === 'function' ? crypto.randomUUID() : Math.random().toString(36).substring(2);
      
      // Etape 1: Ping Operateur
      await new Promise(r => setTimeout(r, 1800));
      setProcessingStep(2);
      
      // Etape 2: Verification Conformité
      const response = await fetch(`${API_URL}/api/transfer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: 'GOS-943029', amount: parseInt(amount), phone: phoneNumber, from_network: senderOperator, idempotency_key: uuid })
      });
      const data = await response.json();
      
      await new Promise(r => setTimeout(r, 1500));
      
      if (!response.ok) throw new Error(data.error || 'Erreur');
      
      // Etape 3: Validation
      setProcessingStep(3);
      await new Promise(r => setTimeout(r, 1500));
      
      setFinalTransaction({ ...data, amount: parseInt(amount), phone: phoneNumber, operator: data.operator });
      setSuccess(`Transfert de ${parseInt(amount).toLocaleString()} FCFA réussi`);
    } catch (err) { setError(err.message); }
    finally { setIsLoading(false); setProcessingStep(0); }
  };

  const handleQuickResend = (tx) => {
    setSenderOperator(tx.from_network);
    setReceiverOperator(tx.to_network);
    setAmount(tx.amount?.toString() || '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const fee = amount ? Math.floor(parseInt(amount) * 0.015) : 0;
  const total = amount ? parseInt(amount) + fee : 0;
  const canSubmit = senderOperator && receiverOperator && amount && parseInt(amount) >= 500 && phoneNumber.length >= 10;

  // ─── Show Landing Page if first visit ───
  if (!showTransfer) {
    return <LandingPage onStart={handleStartTransfer} />;
  }

  // ─── Transfer Interface ───
  return (
    <div style={{ maxWidth: '480px', margin: '0 auto', padding: '8px 16px 40px' }}>
      {/* Header */}
      <div className="animate-fade-up" style={{ textAlign: 'center', marginBottom: '20px' }}>
        <div className="animate-float" style={{
          width: '52px', height: '52px', borderRadius: '18px',
          background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 12px', boxShadow: '0 8px 24px rgba(99,102,241,0.2)',
        }}>
          <Icon name="ArrowRightLeft" size={24} style={{ color: 'white' }} />
        </div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 900, letterSpacing: '-0.04em', color: 'var(--text-primary)' }}>
          Nouveau <span style={{ color: 'var(--accent-primary)' }}>Transfert</span>
        </h1>
        <p style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', marginTop: '4px' }}>
          Sélectionnez les opérateurs et le montant
        </p>
      </div>

      {/* Operators */}
      <div className="transfer-card animate-fade-up-1">
        <label style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase', display: 'block', marginBottom: '10px' }}>
          D'où vient l'argent ?
        </label>
        <div className="operator-grid">
          {OPERATORS.map(op => (
            <button key={`s-${op.id}`} className={`operator-btn ${senderOperator === op.id ? 'selected' : ''}`} onClick={() => setSenderOperator(op.id)}>
              <OperatorLogo id={op.id} size={32} />
              <span className="operator-name">{op.short}</span>
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', margin: '12px 0', color: 'var(--text-muted)' }}>
          <Icon name="ArrowDown" size={16} />
        </div>

        <label style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase', display: 'block', marginBottom: '10px' }}>
          Où va l'argent ?
        </label>
        <div className="operator-grid">
          {OPERATORS.map(op => (
            <button key={`r-${op.id}`} className={`operator-btn ${receiverOperator === op.id ? 'selected-receiver' : ''}`} onClick={() => setReceiverOperator(op.id)}>
              <OperatorLogo id={op.id} size={32} />
              <span className="operator-name">{op.short}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Form */}
      <div className="transfer-card animate-fade-up-2">
        <div style={{ marginBottom: '14px' }}>
          <label style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>Numéro du destinataire</label>
          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}><Icon name="Smartphone" size={18} /></div>
            <input type="tel" placeholder="07 XX XX XX XX" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value.replace(/[^0-9]/g, '').slice(0, 10))} className="transfer-input" />
          </div>
        </div>
        <div style={{ marginBottom: '14px' }}>
          <label style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>Montant (FCFA)</label>
          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontWeight: 900, fontSize: '14px' }}>F</div>
            <input type="number" placeholder="Min 500" value={amount} onChange={(e) => setAmount(e.target.value)} className="transfer-input" style={{ fontSize: '20px', fontWeight: 800 }} />
          </div>
        </div>

        {/* Fee breakdown */}
        {amount && parseInt(amount) >= 500 && (
          <div style={{ background: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)', padding: '14px 16px', marginBottom: '14px', border: '1px solid var(--border-light)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>Frais de service (1.5%)</span>
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 700 }}>{fee.toLocaleString()} F</span>
            </div>
            <div style={{ height: '1px', background: 'var(--border-light)', margin: '0 0 8px' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '13px', color: 'var(--text-primary)', fontWeight: 800 }}>Total à payer</span>
              <span style={{ fontSize: '13px', color: 'var(--accent-success)', fontWeight: 900 }}>{total.toLocaleString()} FCFA</span>
            </div>
          </div>
        )}

        {error && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px', borderRadius: 'var(--radius-sm)', background: '#FEF2F2', border: '1px solid #FECACA', marginBottom: '14px' }}>
            <Icon name="AlertCircle" size={16} style={{ color: '#EF4444' }} />
            <p style={{ fontSize: '12px', fontWeight: 600, color: '#EF4444' }}>{error}</p>
          </div>
        )}

        {success && !finalTransaction && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px', borderRadius: 'var(--radius-sm)', background: '#ECFDF5', border: '1px solid #A7F3D0', marginBottom: '14px' }}>
            <Icon name="CheckCircle" size={16} style={{ color: '#10B981' }} />
            <p style={{ fontSize: '12px', fontWeight: 600, color: '#10B981' }}>{success}</p>
          </div>
        )}

        <button onClick={handleTransfer} disabled={isLoading || !canSubmit} className="transfer-btn">
          {isLoading ? <div className="spinner" /> : <><span>Envoyer</span><Icon name="Send" size={16} /></>}
        </button>
      </div>

      {/* Recent Transactions */}
      {recentTx.length > 0 && (
        <div className="transfer-card animate-fade-up-3">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Derniers transferts</span>
            <Link to="/profile" style={{ fontSize: '11px', fontWeight: 700, color: 'var(--accent-primary)', textDecoration: 'none' }}>Voir tout →</Link>
          </div>
          {recentTx.map(tx => (
            <button key={tx.id} onClick={() => handleQuickResend(tx)} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%',
              padding: '10px 12px', borderRadius: 'var(--radius-sm)', border: 'none',
              background: 'var(--bg-secondary)', cursor: 'pointer', transition: 'all 0.2s', marginBottom: '6px', textAlign: 'left',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <OperatorLogo id={tx.to_network} size={24} />
                <div>
                  <p style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>{tx.from_network} → {tx.to_network}</p>
                  <p style={{ fontSize: '10px', color: 'var(--text-muted)', margin: 0 }}>{new Date(tx.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}</p>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--text-primary)' }}>{tx.amount?.toLocaleString()} F</span>
                <Icon name="RotateCcw" size={12} style={{ color: 'var(--text-muted)' }} />
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Processing Modal */}
      {processingStep > 0 && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
          <div style={{ width: '100%', maxWidth: '340px', background: 'white', borderRadius: '28px', padding: '40px 32px', textAlign: 'center', boxShadow: 'var(--shadow-xl)' }}>
            <div style={{ position: 'relative', width: '64px', height: '64px', margin: '0 auto 24px' }}>
              <div style={{ width: '64px', height: '64px', border: '3px solid var(--border-light)', borderTopColor: 'var(--accent-primary)', borderRadius: '50%', animation: 'spinner 0.8s linear infinite' }} />
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon name={processingStep === 1 ? "Shield" : processingStep === 2 ? "Zap" : "Database"} size={22} style={{ color: 'var(--accent-primary)' }} />
              </div>
            </div>
            <h2 style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '20px' }}>
              {processingStep === 1 ? `Connexion à ${OPERATORS.find(o=>o.id===senderOperator)?.short || 'l\'opérateur'}...` : processingStep === 2 ? "Vérification du numéro..." : "Transfert en cours..."}
            </h2>
            {[{ step: 1, label: `Ping ${OPERATORS.find(o=>o.id===senderOperator)?.short || 'Opérateur 1'}` }, { step: 2, label: 'Vérification conformité' }, { step: 3, label: `Validation ${OPERATORS.find(o=>o.id===receiverOperator)?.short || 'Opérateur 2'}` }].map(s => (
              <div key={s.step} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', fontSize: '11px', fontWeight: 700, color: processingStep >= s.step ? 'var(--accent-primary)' : 'var(--text-muted)' }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: processingStep >= s.step ? 'var(--accent-primary)' : 'var(--border-light)', transition: 'all 0.3s' }} />
                {s.label}
              </div>
            ))}
          </div>
        </div>
      )}

      {finalTransaction && (
        <TransactionReceipt transaction={finalTransaction} onClose={() => { setFinalTransaction(null); setAmount(''); setPhoneNumber(''); }} />
      )}
    </div>
  );
}
