import express from 'express';
import cors from 'cors';
import { sql } from '@vercel/postgres';

const app = express();
app.use(cors());
app.use(express.json());

// =============================================
// INITIALISATION DE LA BASE DE DONNÉES (POSTGRES)
// Cette fonction s'assure que les tables existent
// =============================================
async function initDB() {
    try {
        // Table des Utilisateurs
        await sql`
            CREATE TABLE IF NOT EXISTS users (
                id TEXT PRIMARY KEY,
                phone_number TEXT UNIQUE,
                kyc_status TEXT DEFAULT 'level_1',
                daily_limit INTEGER DEFAULT 100000
            );
        `;

        // Table des Transactions
        await sql`
            CREATE TABLE IF NOT EXISTS transactions (
                id SERIAL PRIMARY KEY,
                user_id TEXT,
                amount INTEGER,
                fee INTEGER,
                from_network TEXT,
                to_network TEXT,
                status TEXT DEFAULT 'pending',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `;

        // Table KYC
        await sql`
            CREATE TABLE IF NOT EXISTS kyc_documents (
                id SERIAL PRIMARY KEY,
                user_id TEXT,
                document_type TEXT,
                status TEXT DEFAULT 'pending',
                upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `;

        // Injection de l'utilisateur de test si absent
        await sql`
            INSERT INTO users (id, phone_number, kyc_status, daily_limit)
            VALUES ('GOS-943029', '0707070707', 'level_1', 100000)
            ON CONFLICT (id) DO NOTHING;
        `;
        
        console.log("💿 Base de données Postgres GoSend prête.");
    } catch (error) {
        console.error("❌ Erreur Initialisation Postgres:", error);
    }
}

// =============================================
// ROUTES API (MIGRÉES VERS POSTGRES)
// =============================================

// 0. Health Check
app.get('/api/health', async (req, res) => {
    await initDB();
    res.json({ status: 'ok', message: '🚀 GoSend Backend (Postgres) opérationnel' });
});

// 1. Obtenir les infos utilisateur
app.get('/api/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { rows } = await sql`SELECT * FROM users WHERE id = ${id}`;
        
        if (rows.length > 0) {
            res.json(rows[0]);
        } else {
            res.status(404).json({ error: "Utilisateur non trouvé" });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur serveur BDD Postgres" });
    }
});

// 2. MOTEUR DE PAIEMENT
app.post('/api/transfer', async (req, res) => {
    try {
        const { user_id, amount, from_network, to_network } = req.body;
        
        if (!amount || amount < 500) {
            return res.status(400).json({ error: "Montant invalide. Minimum 500 FCFA." });
        }
        
        const fee = amount * 0.015;
        
        // Vérifier le plafond
        const { rows: userRows } = await sql`SELECT daily_limit FROM users WHERE id = ${user_id}`;
        if (userRows.length === 0) {
            return res.status(400).json({ error: "Identifiant utilisateur introuvable." });
        }
        
        const user = userRows[0];
        if (amount > user.daily_limit) {
            return res.status(403).json({ error: `Alerte Sécurité: Ce transfert dépasse votre plafond autorisé de ${user.daily_limit} FCFA.` });
        }
        
        // Enregistrer la transaction
        const { rows: txRows } = await sql`
            INSERT INTO transactions (user_id, amount, fee, from_network, to_network, status)
            VALUES (${user_id}, ${amount}, ${fee}, ${from_network}, ${to_network}, 'pending_gateway')
            RETURNING id;
        `;
        
        res.status(201).json({
            message: "L'opérateur télécom va vous demander de valider le code sur votre téléphone.",
            transaction_id: txRows[0].id,
            gateway_url: null
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur de connexion avec l'opérateur financier." });
    }
});

// 3. Webhooks Orange
app.post('/api/webhooks/orange', (req, res) => {
    const { status, txnid } = req.body;
    console.log(`🚨 [WEBHOOK ORANGE] Transaction ${txnid}: ${status}`);
    res.status(200).send("OK");
});

// 4. Historique des transactions
app.get('/api/transactions', async (req, res) => {
    try {
        const { rows } = await sql`SELECT * FROM transactions ORDER BY created_at DESC LIMIT 50`;
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// 5. KYC - Vérification d'Identité
app.post('/api/kyc', async (req, res) => {
    try {
        const { user_id } = req.body;
        
        await sql`UPDATE users SET kyc_status = 'level_2', daily_limit = 2000000 WHERE id = ${user_id}`;
        await sql`INSERT INTO kyc_documents (user_id, document_type, status) VALUES (${user_id}, 'CNI', 'verified')`;
        
        res.json({ success: true, message: "KYC Validé. Plafond augmenté à 2 000 000 FCFA.", new_limit: 2000000 });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur lors de la mise à jour des informations." });
    }
});

export default app;
