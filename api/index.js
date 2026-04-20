import express from 'express';
import cors from 'cors';
import initSqlJs from 'sql.js';
import { readFileSync, writeFileSync, existsSync } from 'fs';

const app = express();
app.use(cors());
app.use(express.json());

// =============================================
// BASE DE DONNÉES GOSEND (sql.js — pur JavaScript)
// Compatible Vercel Serverless, pas de binaires natifs
// =============================================
const DB_PATH = '/tmp/gosend.sqlite';
let db = null;
let SQL = null;

async function getDB() {
    if (db) return db;
    
    if (!SQL) SQL = await initSqlJs();
    
    // Restaurer la BDD depuis /tmp si elle existe
    try {
        if (existsSync(DB_PATH)) {
            const buffer = readFileSync(DB_PATH);
            db = new SQL.Database(buffer);
        }
    } catch (e) { /* Première exécution, normal */ }
    
    if (!db) db = new SQL.Database();
    
    // Créer les tables si elles n'existent pas
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        phone_number TEXT UNIQUE,
        kyc_status TEXT DEFAULT 'level_1',
        daily_limit INTEGER DEFAULT 100000
    )`);
    db.run(`CREATE TABLE IF NOT EXISTS transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT,
        amount INTEGER,
        fee INTEGER,
        from_network TEXT,
        to_network TEXT,
        status TEXT DEFAULT 'pending',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
    db.run(`CREATE TABLE IF NOT EXISTS kyc_documents (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT,
        document_type TEXT,
        status TEXT DEFAULT 'pending',
        upload_date DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
    
    // Utilisateur de test
    const existing = db.exec("SELECT id FROM users WHERE id = 'GOS-943029'");
    if (existing.length === 0 || existing[0].values.length === 0) {
        db.run("INSERT INTO users (id, phone_number, kyc_status, daily_limit) VALUES ('GOS-943029', '0707070707', 'level_1', 100000)");
    }
    
    persist();
    return db;
}

function persist() {
    if (db) {
        try {
            const data = db.export();
            writeFileSync(DB_PATH, Buffer.from(data));
        } catch (e) { /* Silencieux en serverless */ }
    }
}

// =============================================
// ROUTES API
// =============================================

// 0. Health Check
app.get('/api/health', async (req, res) => {
    await getDB();
    res.json({ status: 'ok', message: '🚀 GoSend Backend opérationnel' });
});

// 1. Obtenir les infos utilisateur
app.get('/api/users/:id', async (req, res) => {
    try {
        const database = await getDB();
        const stmt = database.prepare("SELECT * FROM users WHERE id = ?");
        stmt.bind([req.params.id]);
        if (stmt.step()) {
            const row = stmt.getAsObject();
            stmt.free();
            res.json(row);
        } else {
            stmt.free();
            res.status(404).json({ error: "Utilisateur non trouvé" });
        }
    } catch (err) {
        res.status(500).json({ error: "Erreur serveur BDD" });
    }
});

// 2. MOTEUR DE PAIEMENT
app.post('/api/transfer', async (req, res) => {
    try {
        const database = await getDB();
        const { user_id, amount, from_network, to_network } = req.body;
        
        if (!amount || amount < 500) {
            return res.status(400).json({ error: "Montant invalide. Minimum 500 FCFA." });
        }
        
        const fee = amount * 0.015;
        
        // Vérifier le plafond
        const userStmt = database.prepare("SELECT daily_limit FROM users WHERE id = ?");
        userStmt.bind([user_id]);
        if (!userStmt.step()) {
            userStmt.free();
            return res.status(400).json({ error: "Identifiant utilisateur introuvable." });
        }
        const user = userStmt.getAsObject();
        userStmt.free();
        
        if (amount > user.daily_limit) {
            return res.status(403).json({ error: `Alerte Sécurité: Ce transfert dépasse votre plafond autorisé de ${user.daily_limit} FCFA.` });
        }
        
        // Enregistrer la transaction
        database.run(
            "INSERT INTO transactions (user_id, amount, fee, from_network, to_network, status) VALUES (?, ?, ?, ?, ?, 'pending_gateway')",
            [user_id, amount, fee, from_network, to_network]
        );
        persist();
        
        const lastId = database.exec("SELECT last_insert_rowid()")[0].values[0][0];
        
        res.status(201).json({
            message: "L'opérateur télécom va vous demander de valider le code sur votre téléphone.",
            transaction_id: lastId,
            gateway_url: null
        });
    } catch (err) {
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
        const database = await getDB();
        const result = database.exec("SELECT * FROM transactions ORDER BY created_at DESC LIMIT 50");
        if (result.length === 0) return res.json([]);
        
        const columns = result[0].columns;
        const rows = result[0].values.map(row => {
            const obj = {};
            columns.forEach((col, i) => obj[col] = row[i]);
            return obj;
        });
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 5. KYC - Vérification d'Identité
app.post('/api/kyc', async (req, res) => {
    try {
        const database = await getDB();
        const { user_id } = req.body;
        
        database.run("UPDATE users SET kyc_status = 'level_2', daily_limit = 2000000 WHERE id = ?", [user_id]);
        database.run("INSERT INTO kyc_documents (user_id, document_type, status) VALUES (?, 'CNI', 'verified')", [user_id]);
        persist();
        
        res.json({ success: true, message: "KYC Validé. Plafond augmenté à 2 000 000 FCFA.", new_limit: 2000000 });
    } catch (err) {
        res.status(500).json({ error: "Erreur lors de la mise à jour des informations." });
    }
});

export default app;
