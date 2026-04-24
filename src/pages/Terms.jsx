import React from 'react';
import { Link } from 'react-router-dom';
import * as Lucide from 'lucide-react';

const Icon = ({ name, size = 18, style = {} }) => {
  const LucideIcon = Lucide[name];
  if (!LucideIcon) return null;
  return <LucideIcon size={size} style={style} />;
};

const SECTIONS = [
  {
    icon: 'ShieldCheck', color: '#6366F1', bg: '#EEF2FF',
    title: '1. Protection des Données',
    content: 'Conformément à la législation de la République de Côte d\'Ivoire (Loi n° 2013-450), GoSend s\'impose des standards de sécurité bancaire pour la protection de vos données personnelles.',
    quote: 'Chaque octet de donnée est chiffré via l\'algorithme AES-256-GCM avant stockage sécurisé.',
  },
  {
    icon: 'Globe', color: '#8B5CF6', bg: '#F5F3FF',
    title: '2. Conformité BCEAO',
    content: 'GoSend opère dans le strict respect des directives de la BCEAO concernant la lutte contre le blanchiment d\'argent et le financement du terrorisme (AML/CFT).',
    bullets: ['Niveau 1 : Limite de 100,000 FCFA / jour', 'Niveau 2 : Limite de 2,000,000 FCFA / jour (KYC Requis)'],
  },
  {
    icon: 'Lock', color: '#10B981', bg: '#ECFDF5',
    title: '3. Intégrité des Fonds',
    content: 'Le moteur GoSend Ledger utilise des transactions atomiques. En cas d\'échec technique, nos algorithmes garantissent le retour immédiat et automatique des fonds.',
  },
];

export default function Terms() {
  return (
    <div style={{ maxWidth: '700px', margin: '0 auto', padding: '24px 16px 40px' }}>
      <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', textDecoration: 'none', fontSize: '12px', fontWeight: 600, marginBottom: '24px' }}>
        <Icon name="ArrowLeft" size={14} /> Retour
      </Link>

      <div className="transfer-card" style={{ padding: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '40px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '16px', background: '#EEF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="Scale" size={24} style={{ color: '#6366F1' }} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>Cadre Légal</h1>
            <p style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)' }}>Conformité GoSend CI</p>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {SECTIONS.map((s, i) => (
            <div key={i}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name={s.icon} size={18} style={{ color: s.color }} />
                </div>
                <h2 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)' }}>{s.title}</h2>
              </div>
              <div style={{ paddingLeft: '48px' }}>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '12px' }}>{s.content}</p>
                {s.quote && (
                  <div style={{ background: 'var(--bg-secondary)', padding: '16px', borderRadius: 'var(--radius-sm)', borderLeft: `3px solid ${s.color}`, fontSize: '0.85rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                    "{s.quote}"
                  </div>
                )}
                {s.bullets && (
                  <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {s.bullets.map((b, j) => (
                      <li key={j} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: s.color, flexShrink: 0 }} />
                        {b}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: '40px', paddingTop: '20px', borderTop: '1px solid var(--border-light)', textAlign: 'center' }}>
          <p style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
            Certifié GoSend Core • Version 4.0 • 2026
          </p>
        </div>
      </div>
    </div>
  );
}
