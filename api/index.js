import express from 'express';
import cors from 'cors';
import crypto from 'crypto';
import db from '../server/core_db.js';
import { OrangeAPI } from '../server/gateways/orange.js';
import { MtnMoMoAPI } from '../server/gateways/mtn.js';
import { MoovAPI } from '../server/gateways/moov.js';

const app = express();
app.use(cors());
app.use(express.json());

const ALGORITHM = 'aes-256-gcm';
const ENCRYPTION_KEY = Buffer.from(process.env.ENCRYPTION_KEY || '0'.repeat(64), 'hex');

// Gateways
const orangeAPI = new OrangeAPI();
const mtnAPI = new MtnMoMoAPI();
const moovAPI = new MoovAPI();

// =============================================
// SÉCURITÉ : CHIFFREMENT DES DONNÉES
// =============================================
function encrypt(text) {
    if (!text) return text;
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv(ALGORITHM, ENCRYPTION_KEY, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    const authTag = cipher.getAuthTag().toString('hex');
    return `${iv.toString('hex')}:${authTag}:${encrypted}`;
}

// =============================================
// DÉTECTION OPÉRATEUR (SMART ROUTING)
// =============================================
function detectOperator(phone) {
    const p = phone.replace(/\s/g, '');
    // Format CI : 10 chiffres. 
    // Orange: 07, 08, 09
    // MTN: 05, 04, 06
    // Moov: 01
    if (p.length < 2) return 'WAVE';
    const prefix = p.substring(0, 2);
    
    if (['07', '08', '09'].includes(prefix)) return 'ORANGE';
    if (['05', '04', '06'].includes(prefix)) return 'MTN';
    if (['01'].includes(prefix)) return 'MOOV';
    
    return 'WAVE';
}

// =============================================
// ROUTES API GOSEND
// =============================================

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', engine: '🚀 GoSend Core v2.2 (Integrated Gateways)' });
});

app.get('/api/init', async (req, res) => {
    try {
        await db.initCoreTables();
        res.json({ success: true, message: "Base de données initialisée." });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.get('/api/users/:id', async (req, res) => {
    try {
        const { rows } = await db.query`SELECT * FROM users WHERE id = ${req.params.id}`;
        if (rows.length === 0) return res.status(404).json({ error: "Utilisateur non trouvé" });
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/transfer', async (req, res) => {
    const startTime = Date.now();
    const { user_id, amount, phone, idempotency_key, from_network } = req.body;
    const to_operator = detectOperator(phone);

    try {
        if (!amount || amount < 500) throw new Error("Montant minimum 500 FCFA");

        // 1. Vérification Plafond
        const { rows: userRows } = await db.query`SELECT daily_limit FROM users WHERE id = ${user_id}`;
        if (userRows.length === 0) throw new Error("Utilisateur inconnu");
        if (amount > userRows[0].daily_limit) {
            throw new Error(`Plafond dépassé (${userRows[0].daily_limit} FCFA)`);
        }

        // 2. Appel à la Passerelle (Simulation ou Real API)
        let gatewayResult = { success: true };
        const orderId = `GS-${Date.now()}`;

        if (to_operator === 'ORANGE') {
            gatewayResult = await orangeAPI.initiatePayment(amount, orderId, user_id);
        } else if (to_operator === 'MTN') {
            gatewayResult = await mtnAPI.requestToPay(amount, phone, orderId);
        } else if (to_operator === 'MOOV') {
            gatewayResult = await moovAPI.initiatePayment(amount, orderId, phone);
        }

        if (!gatewayResult.success) {
            throw new Error(`Échec de la passerelle ${to_operator}`);
        }

        // 3. Enregistrement Transaction
        const fee = amount * 0.015;
        const txResult = await db.query`
            INSERT INTO transactions (user_id, amount, fee, from_network, to_network, status, idempotency_key)
            VALUES (${user_id}, ${amount}, ${fee}, ${from_network || 'WALLET'}, ${to_operator}, 'completed', ${idempotency_key || orderId})
        `;

        // Récupération de l'ID pour le Ledger
        // Note: SQLite rowCount is change count, we might need a separate query for last_insert_rowid if needed
        // but for now we use the unique idempotency_key for tracking.
        
        // 4. Écriture Ledger immuable
        await db.query`
            INSERT INTO ledger (transaction_id, entry_type, amount) 
            VALUES (${orderId}, 'DEBIT', ${amount + fee})
        `;

        // Télémétrie
        await db.query`
            INSERT INTO telemetry (event_type, latency, status, metadata) 
            VALUES ('TRANSFER_SUCCESS', ${Date.now() - startTime}, 'OK', ${JSON.stringify({ operator: to_operator, amount })})
        `;

        res.status(201).json({
            status: "SUCCESS",
            operator: to_operator,
            transaction_id: orderId,
            message: `Transfert ${to_operator} de ${amount} FCFA réussi.`
        });

    } catch (err) {
        try {
            await db.query`
                INSERT INTO telemetry (event_type, latency, status, metadata) 
                VALUES ('TRANSFER_ERROR', ${Date.now() - startTime}, 'ERROR', ${JSON.stringify({ error: err.message })})
            `;
        } catch (_) { /* telemetry write failure is non-critical */ }
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/transactions', async (req, res) => {
    try {
        const { rows } = await db.query`SELECT * FROM transactions ORDER BY created_at DESC LIMIT 20`;
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/telemetry', async (req, res) => {
    try {
        const { rows: recent } = await db.query`SELECT * FROM telemetry ORDER BY created_at DESC LIMIT 15`;
        res.json({ 
            stats: { success: recent.filter(r => r.status === 'OK').length, failures: recent.filter(r => r.status !== 'OK').length }, 
            recent: recent.map(r => ({ ...r, metadata: JSON.parse(r.metadata || '{}') }))
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/kyc', async (req, res) => {
    const { user_id } = req.body;
    try {
        await db.query`UPDATE users SET kyc_status = 'level_2', daily_limit = 2000000 WHERE id = ${user_id}`;
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Simulation de Webhook pour tests
app.post('/api/webhooks/simulate', async (req, res) => {
    const { transaction_id, status } = req.body;
    try {
        await db.query`UPDATE transactions SET status = ${status} WHERE idempotency_key = ${transaction_id} OR id = ${transaction_id}`;
        res.json({ success: true, message: `Status mis à jour vers ${status}` });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ─── Auto-init des tables AVANT de servir des requêtes ───
const PORT = process.env.PORT || 3001;

async function startServer() {
    try {
        await db.initCoreTables();
    } catch (err) {
        console.error('DB init error:', err.message);
    }

    if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
        app.listen(PORT, '0.0.0.0', () => {
            console.log(`\n🚀 GoSend backend actif sur http://localhost:${PORT}`);
        });
    }
}

startServer();

export default app;
