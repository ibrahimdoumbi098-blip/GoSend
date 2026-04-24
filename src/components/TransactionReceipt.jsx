import React from 'react';
import * as Lucide from 'lucide-react';

const Icon = ({ name, size = 20, style = {} }) => {
  const LucideIcon = Lucide[name];
  if (!LucideIcon) return null;
  return <LucideIcon size={size} style={style} />;
};

export default function TransactionReceipt({ transaction, onClose }) {
  if (!transaction) return null;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 10000,
      background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(12px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px',
    }}>
      <div className="animate-fade-up" style={{
        width: '100%', maxWidth: '380px', background: 'white',
        borderRadius: '28px', overflow: 'hidden', boxShadow: '0 32px 64px rgba(0,0,0,0.15)',
      }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #6366F1, #7C3AED)',
          padding: '40px 32px', textAlign: 'center', position: 'relative',
        }}>
          <div style={{
            width: '56px', height: '56px', borderRadius: '18px',
            background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 12px',
          }}>
            <Icon name="Check" size={28} style={{ color: 'white' }} />
          </div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 900, color: 'white', letterSpacing: '-0.03em', marginBottom: '4px' }}>Transfert Réussi</h2>
          <p style={{ fontSize: '10px', fontWeight: 600, color: 'rgba(255,255,255,0.6)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>Confirmé</p>
        </div>

        {/* Body */}
        <div style={{ padding: '32px' }}>
          {/* Amount */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '20px', borderBottom: '1px solid #F1F5F9', marginBottom: '20px' }}>
            <span style={{ fontSize: '10px', fontWeight: 800, color: '#94A3B8', letterSpacing: '0.15em', textTransform: 'uppercase' }}>Montant</span>
            <span style={{ fontSize: '1.3rem', fontWeight: 900, color: '#0F172A' }}>{transaction.amount?.toLocaleString()} FCFA</span>
          </div>

          {/* Details Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
            <div>
              <p style={{ fontSize: '9px', fontWeight: 800, color: '#94A3B8', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '4px' }}>Destinataire</p>
              <p style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A' }}>{transaction.phone}</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: '9px', fontWeight: 800, color: '#94A3B8', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '4px' }}>Opérateur</p>
              <p style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A' }}>{transaction.operator}</p>
            </div>
          </div>

          {/* Transaction Meta */}
          <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '14px', marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '10px', fontWeight: 700, color: '#94A3B8' }}>Transaction ID</span>
              <span style={{ fontSize: '10px', fontWeight: 700, color: '#0F172A', fontFamily: 'monospace' }}>{transaction.transaction_id}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '10px', fontWeight: 700, color: '#94A3B8' }}>Date & Heure</span>
              <span style={{ fontSize: '10px', fontWeight: 700, color: '#0F172A' }}>{new Date().toLocaleString('fr-FR')}</span>
            </div>
          </div>

          {/* Actions */}
          <button onClick={() => window.print()} style={{
            width: '100%', padding: '14px', borderRadius: '14px', border: 'none',
            background: '#0F172A', color: 'white', fontWeight: 800, fontSize: '11px',
            letterSpacing: '0.1em', cursor: 'pointer', display: 'flex', alignItems: 'center',
            justifyContent: 'center', gap: '8px', marginBottom: '10px', fontFamily: 'Inter, sans-serif',
          }}>
            <Icon name="Printer" size={14} style={{ color: 'white' }} /> Imprimer le reçu
          </button>
          <button onClick={onClose} style={{
            width: '100%', padding: '14px', borderRadius: '14px', border: 'none',
            background: '#F1F5F9', color: '#475569', fontWeight: 700, fontSize: '11px',
            letterSpacing: '0.05em', cursor: 'pointer', fontFamily: 'Inter, sans-serif',
          }}>
            Retour au tableau de bord
          </button>
        </div>
      </div>
    </div>
  );
}
