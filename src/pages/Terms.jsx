import React from 'react';

export default function Terms() {
  return (
    <div className="container" style={{maxWidth: '800px', lineHeight: '1.6'}}>
      <h1 style={{color: 'white', marginBottom: '30px', fontSize: '2.5rem'}}>Cadre Légal & Conformité</h1>
      <div className="card" style={{padding: '40px', borderTop: '4px solid var(--primary)'}}>
        <h3 style={{marginTop: 0, color: 'var(--primary)'}}>1. Confidentialité et Protection des Données</h3>
        <p style={{color: 'var(--text-muted)', marginBottom: '30px'}}>
          Conformément à la législation de la République de Côte d'Ivoire (Loi n° 2013-450 sur la protection des données à caractère personnel), GoSend stocke vos documents d'identité (KYC) sur des serveurs hautement sécurisés. Vos documents ne sont jamais transmis à des tiers commerciaux ou publicitaires.
        </p>
        
        <h3 style={{color: 'var(--primary)'}}>2. Lutte Contre le Blanchiment d'Argent (AML)</h3>
        <p style={{color: 'var(--text-muted)'}}>
          GoSend s'engage à respecter les obligations de vigilance définies par la <strong>BCEAO</strong> (Banque Centrale des États de l'Afrique de l'Ouest). Tout transfert inhabituel ou le fractionnement de paiements dépassant les plafonds associés au "Niveau 1" entraînera une suspension temporaire du compte jusqu'à la soumission complète et validée du dossier KYC (Carte Nationale d'Identité ou Passeport).
        </p>
      </div>
    </div>
  );
}
