import React, { useEffect, useState } from 'react';
import { User, Activity, Clock, CheckCircle, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function UserProfile() {
  const [userData, setUserData] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔗 Connexion avec notre VRAI Serveur Backend
  useEffect(() => {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
    
    // Fetch User Data and Transactions in parallel
    Promise.all([
      fetch(`${API_URL}/api/users/GOS-943029`).then(res => res.json()),
      fetch(`${API_URL}/api/transactions`).then(res => res.json())
    ])
    .then(([userDataRes, txDataRes]) => {
      setUserData(userDataRes);
      setTransactions(txDataRes);
      setLoading(false);
    })
    .catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  if (loading) return <div style={{color:'white', padding: '50px', textAlign: 'center'}}><div className="spinner"></div> Connexion au serveur bancaire...</div>;

  const getStatusIcon = (status) => {
    switch(status) {
      case 'success': return <CheckCircle size={18} color="var(--success)" />;
      case 'pending':
      case 'pending_gateway': return <Clock size={18} color="var(--orange)" />;
      default: return <XCircle size={18} color="var(--error)" />;
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'success': return 'Confirmé';
      case 'pending':
      case 'pending_gateway': return 'En attente';
      default: return 'Échoué';
    }
  };

  return (
    <div className="container" style={{maxWidth: '800px'}}>
      <div className="header" style={{textAlign: 'left', display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '40px'}}>
         <div style={{width: '80px', height: '80px', background: 'var(--primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
           <User size={40} color="white" />
         </div>
         <div>
           <h2 style={{color: 'white', fontSize:'2rem', margin: '0 0 5px'}}>ID: {userData?.id}</h2>
           <p style={{margin: '0 0 10px 0', color: 'var(--text-muted)'}}>Numéro : {userData?.phone_number}</p>
           {userData?.kyc_status === 'level_1' ? (
             <span style={{background: 'rgba(239, 68, 68, 0.1)', color: 'var(--error)', padding: '5px 10px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 'bold'}}>Niveau 1 (Non Vérifié KYC)</span>
           ) : (
             <span style={{background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', padding: '5px 10px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 'bold'}}>Niveau 2 (Vérifié)</span>
           )}
         </div>
      </div>

      <div className="card" style={{padding: '40px', marginBottom: '20px'}}>
         <h3 style={{marginTop: '0', display: 'flex', alignItems: 'center', gap: '10px'}}><Activity size={20} color="var(--primary)"/> Suivi du Plafond Journalier (Données Réelles)</h3>
         <div style={{display: 'flex', justifyContent: 'space-between', margin: '20px 0 10px 0', color: 'var(--text-muted)', fontWeight: 'bold'}}>
            <span>Consommé : 0 F</span>
            <span style={{color: 'white'}}>Total Autorisé : {userData?.daily_limit?.toLocaleString('fr-FR')} F</span>
         </div>
         <div style={{width: '100%', height: '14px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', overflow: 'hidden'}}>
            <div style={{width: '0%', height: '100%', background: 'linear-gradient(90deg, var(--orange), var(--error))', borderRadius: '10px', transition: 'width 1s ease-in-out'}}></div>
         </div>
         
         {userData?.daily_limit <= 100000 && (
           <div style={{marginTop: '30px', padding: '20px', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', borderLeft: '4px solid var(--primary)'}}>
              <p style={{margin: '0 0 15px 0', color: 'var(--text-muted)'}}>Pour augmenter votre limite d'envoi à <strong>2 000 000 F par jour</strong>, vous devez prouver votre identité.</p>
              <Link to="/kyc" className="secondary-btn" style={{display: 'inline-block', textDecoration:'none', textAlign:'center'}}>Lancer la vérification KYC</Link>
           </div>
         )}
      </div>

      <div className="card" style={{padding: '40px'}}>
        <h3 style={{marginTop: '0', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px'}}><Clock size={20} color="var(--primary)"/> Historique des Transactions</h3>
        
        {transactions.length === 0 ? (
          <p style={{color: 'var(--text-muted)', textAlign: 'center'}}>Aucune transaction récente.</p>
        ) : (
          <div style={{display: 'flex', flexDirection: 'column', gap: '15px'}}>
            {transactions.map(tx => (
              <div key={tx.id} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px'}}>
                <div style={{display: 'flex', gap: '15px', alignItems: 'center'}}>
                   <div style={{width: '40px', height: '40px', borderRadius: '50%', background: `var(--${tx.to_network || 'primary'})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', textTransform: 'uppercase', fontSize: '0.8rem', color: 'white'}}>
                     {tx.to_network?.substring(0, 2)}
                   </div>
                   <div>
                     <h4 style={{margin: '0 0 5px', color: 'white'}}>{tx.amount?.toLocaleString('fr-FR')} FCFA</h4>
                     <p style={{margin: '0', fontSize: '0.85rem', color: 'var(--text-muted)'}}>
                       Depuis {tx.from_network} • {new Date(tx.created_at).toLocaleDateString('fr-FR')}
                     </p>
                   </div>
                </div>
                <div style={{display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem', color: 'var(--text-muted)'}}>
                   {getStatusText(tx.status)}
                   {getStatusIcon(tx.status)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
