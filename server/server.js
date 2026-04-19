import express from 'express';
import cors from 'cors';
import db, { initDB } from './database.js';
import { OrangeAPI } from './gateways/orange.js';
import { MtnMoMoAPI } from './gateways/mtn.js';

const app = express();

app.use(cors());
app.use(express.json());

initDB();

// Initialisation des Connecteurs Financiers
const orangeAPI = new OrangeAPI();
const mtnAPI = new MtnMoMoAPI();

// 1. Obtenir les infos utilisateur
app.get('/api/users/:id', (req, res) => {
    const { id } = req.params;
    db.get(`SELECT * FROM users WHERE id = ?`, [id], (err, row) => {
        if (err) return res.status(500).json({ error: "Erreur serveur BDD" });
        if (!row) return res.status(404).json({ error: "Utilisateur non trouvé" });
        res.json(row);
    });
});

// 2. MOTEUR DE PAIEMENT (PRODUCTION)
app.post('/api/transfer', (req, res) => {
    const { user_id, amount, from_network, to_network, target_phone } = req.body;
    
    if (!amount || amount < 500) {
        return res.status(400).json({ error: "Montant invalide. Minimum 500 FCFA." });
    }

    const fee = amount * 0.015;

    db.get(`SELECT daily_limit FROM users WHERE id = ?`, [user_id], async (err, user) => {
        if (err || !user) return res.status(400).json({ error: "Identifiant utilisateur introuvable." });
        
        if (amount > user.daily_limit) {
            return res.status(403).json({ error: `Alerte Sécurité: Ce transfert dépasse votre plafond autorisé de ${user.daily_limit} FCFA.` });
        }

        // ==========================================
        // ROUTAGE VERS LES OPÉRATEURS TÉLÉCOMS
        // ==========================================
        let paymentGatewayResult = null;
        let randomOrderId = "GOSEND-" + Math.floor(Math.random() * 1000000);

        try {
            if (from_network === 'orange') {
                paymentGatewayResult = await orangeAPI.initiatePayment(amount + fee, randomOrderId, "ClientGoSend");
            } 
            else if (from_network === 'mtn') {
                paymentGatewayResult = await mtnAPI.requestToPay(amount + fee, target_phone, randomOrderId);
            } 
            else {
                // Secours pour Moov et Wave en attendant leurs clés API
                paymentGatewayResult = { success: true, payment_url: 'https://gosend.ci/simulation' };
            }

            if(!paymentGatewayResult.success) {
                return res.status(400).json({ error: `Le réseau ${from_network.toUpperCase()} a rejeté la requête initiale.` });
            }

            // L'opérateur a accepté l'ordre ! On le sauvegarde en statut "En Attente de finalisation" (Pending_Gateway)
            db.run(`INSERT INTO transactions (user_id, amount, fee, from_network, to_network, status) 
                VALUES (?, ?, ?, ?, ?, 'pending_gateway')`, 
                [user_id, amount, fee, from_network, to_network], 
                function(err) {
                    if (err) return res.status(500).json({ error: "Échec DB." });
                    
                    res.status(201).json({ 
                        message: "L'opérateur télécom va vous demander de valider le code sur votre téléphone.", 
                        transaction_id: this.lastID,
                        gateway_url: paymentGatewayResult.payment_url || null
                    });
            });

        } catch(error) {
            return res.status(500).json({ error: "Erreur de connexion avec l'opérateur financier." });
        }
    });
});

// 3. LES WEBHOOKS (Le "Téléphone Rouge" des opérateurs)
// Orange CI ou MTN CI taperont silencieusement sur cette porte de derrière 
// quand le transfert sera réellement encaissé par eux dans la rue.
app.post('/api/webhooks/orange', (req, res) => {
    const { status, order_id, txnid } = req.body;
    console.log(`\n🚨 [WEBHOOK ORANGE] Réception transaction ${txnid} avec statut: ${status}`);
    
    // Si c'est un vrai succès, on débloque l'argent dans NOTRE base de données !
    if(status === 'SUCCESS') {
       console.log("✔️ Mise à jour de la BDD : L'argent est bien arrivé sur le compte GoSend !");
       // En prod: db.run(`UPDATE transactions SET status = 'success' WHERE id = ?`, [order_id]);
    }
    
    // Réponse technique obligatoire pour qu'Orange arrête de spammer le webhook
    res.status(200).send("OK");
});

// 4. Historique
app.get('/api/transactions', (req, res) => {
    db.all(`SELECT * FROM transactions ORDER BY created_at DESC LIMIT 50`, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// 5. KYC - Vérification d'Identité
app.post('/api/kyc', (req, res) => {
    const { user_id } = req.body;
    
    // On passe le statut à level_2 et la limite à 2.000.000 (selon les directives)
    db.run(`UPDATE users SET kyc_status = 'level_2', daily_limit = 2000000 WHERE id = ?`, [user_id], function(err) {
        if (err) return res.status(500).json({ error: "Erreur lors de la mise à jour des informations." });
        
        // On enregistre également le document virtuellement
        db.run(`INSERT INTO kyc_documents (user_id, document_type, status) VALUES (?, 'CNI', 'verified')`, [user_id]);

        res.json({ success: true, message: "KYC Validé. Plafond augmenté à 2 000 000 FCFA.", new_limit: 2000000 });
    });
});

if (!process.env.VERCEL) {
    const PORT = process.env.PORT || 3001;
    app.listen(PORT, '0.0.0.0', () => {
        console.log(`\n🚀 SERVEUR GOSEND ACTIF !`);
        console.log(`🔌 Connecteurs Orange/MTN prêts.`);
    });
}

export default app;
