import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import * as Lucide from 'lucide-react';

const Icon = ({ name, size = 18, className = "", style = {} }) => {
  const LucideIcon = Lucide[name];
  if (!LucideIcon) return null;
  return <LucideIcon size={size} className={className} style={style} />;
};

export default function UserProfile() {
  const [userData, setUserData] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const API_URL = import.meta.env.VITE_API_URL || '';
    Promise.all([
      fetch(`${API_URL}/api/users/GOS-943029`).then(res => res.json()),
      fetch(`${API_URL}/api/transactions`).then(res => res.json())
    ]).then(([u, t]) => {
      setUserData(u);
      setTransactions(Array.isArray(t) ? t : []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <div className="spinner" style={{ margin: '0 auto 12px' }} />
        <p style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)' }}>Chargement...</p>
      </div>
    </div>
  );

  const successTx = transactions.filter(tx => tx.status === 'completed' || tx.status === 'success');
  const totalSpent = successTx.reduce((acc, tx) => acc + (tx.amount || 0), 0);
  const limitPct = Math.min(100, (totalSpent / (userData?.daily_limit || 100000)) * 100);

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '24px 16px 40px' }}>
      {/* Profile Card */}
      <div className="transfer-card animate-fade-up" style={{ padding: '32px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
          <div style={{
            width: '64px', height: '64px', borderRadius: '20px',
            background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 8px 24px rgba(99,102,241,0.2)',
          }}>
            <Icon name="User" size={32} style={{ color: 'white' }} />
          </div>
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>ID: {userData?.id}</h1>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '8px' }}>
              <span style={{ padding: '4px 12px', background: 'var(--bg-secondary)', borderRadius: '8px', fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)' }}>{userData?.phone_number}</span>
              <span style={{
                padding: '4px 12px', borderRadius: '8px', fontSize: '11px', fontWeight: 700,
                background: userData?.kyc_status === 'level_2' ? '#ECFDF5' : '#FFFBEB',
                color: userData?.kyc_status === 'level_2' ? '#10B981' : '#F59E0B',
              }}>
                {userData?.kyc_status === 'level_2' ? '✓ Vérifié' : 'Niveau 1'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Limits */}
      <div className="transfer-card animate-fade-up-1" style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div>
            <p style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '4px' }}>Utilisation du plafond</p>
            <p style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              {totalSpent.toLocaleString()} <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>/ {userData?.daily_limit?.toLocaleString()} FCFA</span>
            </p>
          </div>
          <span style={{ fontSize: '1.1rem', fontWeight: 900, color: limitPct > 80 ? '#EF4444' : 'var(--accent-primary)' }}>{limitPct.toFixed(0)}%</span>
        </div>
        <div style={{ width: '100%', height: '6px', background: 'var(--bg-tertiary)', borderRadius: '100px', overflow: 'hidden' }}>
          <div style={{
            height: '100%', borderRadius: '100px', transition: 'width 1s ease-out',
            width: `${limitPct}%`,
            background: limitPct > 80 ? '#EF4444' : 'linear-gradient(90deg, #6366F1, #8B5CF6)',
          }} />
        </div>
        {userData?.kyc_status !== 'level_2' && (
          <Link to="/kyc" style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '14px 16px', marginTop: '16px', borderRadius: 'var(--radius-sm)',
            background: 'var(--accent-primary-light)', textDecoration: 'none', transition: 'all 0.2s',
          }}>
            <div>
              <p style={{ fontSize: '12px', fontWeight: 700, color: 'var(--accent-primary)' }}>Augmenter mes plafonds</p>
              <p style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Passer à 2,000,000 FCFA/jour</p>
            </div>
            <Icon name="ArrowRight" size={16} style={{ color: 'var(--accent-primary)' }} />
          </Link>
        )}
      </div>

      {/* Transactions */}
      <div className="transfer-card animate-fade-up-2" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Transactions récentes</span>
          <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)' }}>{transactions.length} total</span>
        </div>
        {transactions.length === 0 ? (
          <div style={{ padding: '48px 24px', textAlign: 'center' }}>
            <Icon name="Inbox" size={32} style={{ color: 'var(--border-light)', marginBottom: '12px' }} />
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>Aucune transaction</p>
          </div>
        ) : (
          transactions.map(tx => (
            <div key={tx.id} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '16px 24px', borderBottom: '1px solid var(--border-subtle)',
              transition: 'background 0.2s',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '36px', height: '36px', borderRadius: '10px',
                  background: tx.to_network === 'ORANGE' ? '#FFF7ED' : tx.to_network === 'MTN' ? '#FFFBEB' : tx.to_network === 'WAVE' ? '#F0FDFF' : '#EFF6FF',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Icon name="ArrowUpRight" size={16} style={{
                    color: tx.to_network === 'ORANGE' ? '#FF7900' : tx.to_network === 'MTN' ? '#CA8A04' : tx.to_network === 'WAVE' ? '#0891B2' : '#2563EB',
                  }} />
                </div>
                <div>
                  <p style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>Envoi {tx.to_network}</p>
                  <p style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{new Date(tx.created_at).toLocaleString('fr-FR')}</p>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: '13px', fontWeight: 800, color: 'var(--text-primary)' }}>-{tx.amount?.toLocaleString()} F</p>
                <span style={{
                  fontSize: '9px', fontWeight: 700, padding: '2px 8px', borderRadius: '6px',
                  background: (tx.status === 'completed' || tx.status === 'success') ? '#ECFDF5' : '#FEF2F2',
                  color: (tx.status === 'completed' || tx.status === 'success') ? '#10B981' : '#EF4444',
                }}>
                  {(tx.status === 'completed' || tx.status === 'success') ? 'Réussi' : 'Échoué'}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
