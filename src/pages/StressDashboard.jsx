import React, { useState, useEffect } from 'react';
import * as Lucide from 'lucide-react';

const Icon = ({ name, size = 18, style = {} }) => {
  const LucideIcon = Lucide[name];
  if (!LucideIcon) return null;
  return <LucideIcon size={size} style={style} />;
};

export default function StressDashboard() {
  const [stats, setStats] = useState({ success: 0, failures: 0, avg_latency: 0, total_volume: 0 });
  const [recent, setRecent] = useState([]);
  const [isLive, setIsLive] = useState(true);

  useEffect(() => {
    let interval;
    if (isLive) {
      const fetchStats = async () => {
        try {
          const API_URL = import.meta.env.VITE_API_URL || '';
          const res = await fetch(`${API_URL}/api/telemetry`);
          const data = await res.json();
          if (data.stats) setStats(data.stats);
          if (data.recent) setRecent(data.recent);
        } catch (e) { /* silent */ }
      };
      fetchStats();
      interval = setInterval(fetchStats, 3000);
    }
    return () => clearInterval(interval);
  }, [isLive]);

  const successRate = stats.success + stats.failures > 0
    ? ((stats.success / (stats.success + stats.failures)) * 100).toFixed(1)
    : "100";

  const CARDS = [
    { icon: 'Database', label: 'Transactions', value: stats.success + stats.failures, color: '#6366F1', bg: '#EEF2FF' },
    { icon: 'ShieldCheck', label: 'Taux de Succès', value: `${successRate}%`, color: '#10B981', bg: '#ECFDF5' },
    { icon: 'Zap', label: 'Latence Moy.', value: `${Math.round(stats.avg_latency || 0)}ms`, color: '#F59E0B', bg: '#FFFBEB' },
    { icon: 'BarChart3', label: 'Volume (5 min)', value: `${(stats.total_volume || 0).toLocaleString()} F`, color: '#8B5CF6', bg: '#F5F3FF' },
  ];

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '24px 16px 40px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
            <Icon name="Activity" size={22} style={{ color: '#6366F1' }} />
            <h1 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>Monitoring Live</h1>
          </div>
          <p style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)' }}>Télémétrie temps réel • Grade Fintech</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'var(--bg-card)', padding: '6px 12px', borderRadius: '14px', border: '1px solid var(--border-light)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '4px 10px', background: '#ECFDF5', borderRadius: '8px', fontSize: '10px', fontWeight: 800, color: '#10B981' }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10B981', animation: 'pulseGlow 2s infinite' }} />
            LIVE
          </div>
          <button onClick={() => setIsLive(!isLive)} style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', padding: '4px 8px' }}>
            {isLive ? 'PAUSE' : 'REPRENDRE'}
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        {CARDS.map((c, i) => (
          <div key={i} className="transfer-card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: c.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon name={c.icon} size={18} style={{ color: c.color }} />
              </div>
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--text-primary)', marginBottom: '2px', fontFamily: 'Inter, monospace' }}>{c.value}</h2>
            <p style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{c.label}</p>
          </div>
        ))}
      </div>

      {/* Event Stream */}
      <div className="transfer-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-light)' }}>
          <h3 style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Transaction Stream</h3>
        </div>
        {recent.length === 0 ? (
          <div style={{ padding: '48px 20px', textAlign: 'center' }}>
            <Icon name="Radio" size={28} style={{ color: 'var(--border-light)', marginBottom: '8px' }} />
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>En attente d'événements...</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
              <thead>
                <tr style={{ background: 'var(--bg-secondary)' }}>
                  {['TIMESTAMP', 'EVENT', 'LATENCY', 'STATUS'].map(h => (
                    <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 800, color: 'var(--text-muted)', fontSize: '10px', letterSpacing: '0.1em' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recent.map(log => (
                  <tr key={log.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: '12px 16px', color: 'var(--text-muted)', fontFamily: 'monospace', fontSize: '11px' }}>{new Date(log.created_at).toLocaleTimeString()}</td>
                    <td style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--text-primary)', textTransform: 'uppercase', fontSize: '11px' }}>{log.event_type}</td>
                    <td style={{ padding: '12px 16px', fontFamily: 'monospace', color: 'var(--accent-primary)', fontWeight: 700, fontSize: '11px' }}>{log.latency}ms</td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{
                        padding: '3px 10px', borderRadius: '6px', fontSize: '9px', fontWeight: 800,
                        background: log.status === 'OK' ? '#ECFDF5' : '#FEF2F2',
                        color: log.status === 'OK' ? '#10B981' : '#EF4444',
                      }}>
                        {log.status === 'OK' ? 'PASSED' : 'REJECTED'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
