import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Le fichier de la base de données
let dbPath = path.resolve(__dirname, 'gosend.sqlite');

// Vercel Serverless Fix: le système est en lecture seule, on doit mémoriser SQLite dans /tmp
if (process.env.VERCEL) {
    const tmpPath = '/tmp/gosend.sqlite';
    import('fs').then(fs => {
        if (!fs.existsSync(tmpPath) && fs.existsSync(dbPath)) {
            fs.copyFileSync(dbPath, tmpPath);
        }
    });
    dbPath = '/tmp/gosend.sqlite';
}

const db = new sqlite3.Database(dbPath);

export function initDB() {
    db.serialize(() => {
        // Table des Utilisateurs
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            phone_number TEXT UNIQUE,
            kyc_status TEXT DEFAULT 'level_1',
            daily_limit INTEGER DEFAULT 100000
        )`);

        // Table des Transactions
        db.run(`CREATE TABLE IF NOT EXISTS transactions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id TEXT,
            amount INTEGER,
            fee INTEGER,
            from_network TEXT,
            to_network TEXT,
            status TEXT DEFAULT 'pending',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(user_id) REFERENCES users(id)
        )`);

        // Table KYC (Pour le futur hébergement des images CNI)
        db.run(`CREATE TABLE IF NOT EXISTS kyc_documents (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id TEXT,
            document_type TEXT,
            status TEXT DEFAULT 'pending',
            upload_date DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(user_id) REFERENCES users(id)
        )`);

        // Injection d'un utilisateur de test (Le compte principal)
        db.run(`INSERT OR IGNORE INTO users (id, phone_number, kyc_status, daily_limit) 
            VALUES ('GOS-943029', '0707070707', 'level_1', 100000)`);
            
        console.log("💿 Base de données SQLite GoSend prête, sécurisée et structurée.");
    });
}

export default db;
