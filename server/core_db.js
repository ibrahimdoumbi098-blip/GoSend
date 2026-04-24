import { sql } from '@vercel/postgres';
import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isProduction = !!process.env.POSTGRES_URL;
let localDb = null;

if (!isProduction) {
    const dbPath = path.resolve(__dirname, 'gosend.sqlite');
    localDb = new sqlite3.Database(dbPath);
    console.log("🛠️  GoSend: Utilisation du mode local (SQLite)");
} else {
    console.log("🌐 GoSend: Utilisation du mode production (Vercel Postgres)");
}

/**
 * Exécute une requête SQL de manière agnostique (Vercel vs Local)
 */
export async function query(strings, ...values) {
    if (isProduction) {
        // En prod, on utilise le helper sql de Vercel
        return sql(strings, ...values);
    } else {
        // En local, on convertit la template literal pour SQLite
        return new Promise((resolve, reject) => {
            let sqlString = strings[0];
            for (let i = 1; i < strings.length; i++) {
                sqlString += '?' + strings[i];
            }
            // sqlite3 use run/all depending on query type, we simplify:
            const method = sqlString.trim().toUpperCase().startsWith('SELECT') ? 'all' : 'run';
            
            localDb[method](sqlString, values, function(err, result) {
                if (err) reject(err);
                else resolve({
                    rows: method === 'all' ? result : [],
                    rowCount: method === 'run' ? this.changes : (result ? result.length : 0)
                });
            });
        });
    }
}

/**
 * Initialisation des tables Core
 */
export async function initCoreTables() {
    console.log("⚙️  Initialisation du schéma GoSend...");
    
    // Suite SQL compatible Postgres et SQLite (via types standards)
    const tables = [
        `CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            phone_number TEXT UNIQUE,
            kyc_status TEXT DEFAULT 'level_1',
            daily_limit INTEGER DEFAULT 100000
        )`,
        `CREATE TABLE IF NOT EXISTS transactions (
            id SERIAL PRIMARY KEY,
            user_id TEXT,
            amount INTEGER,
            fee INTEGER,
            from_network TEXT,
            to_network TEXT,
            status TEXT DEFAULT 'pending',
            idempotency_key TEXT UNIQUE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`,
        `CREATE TABLE IF NOT EXISTS ledger (
            id SERIAL PRIMARY KEY,
            transaction_id INTEGER,
            entry_type TEXT, -- 'CREDIT', 'DEBIT'
            amount INTEGER,
            balance_after INTEGER,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`,
        `CREATE TABLE IF NOT EXISTS telemetry (
            id SERIAL PRIMARY KEY,
            event_type TEXT,
            latency INTEGER,
            status TEXT,
            metadata TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`
    ];

    for (const sqlCmd of tables) {
        // Adaptation légère pour SQLite SERIAL -> INTEGER PRIMARY KEY AUTOINCREMENT
        let cmd = sqlCmd;
        if (!isProduction) {
            cmd = cmd.replace('SERIAL PRIMARY KEY', 'INTEGER PRIMARY KEY AUTOINCREMENT');
            cmd = cmd.replace('TIMESTAMP DEFAULT CURRENT_TIMESTAMP', 'DATETIME DEFAULT CURRENT_TIMESTAMP');
        }
        
        try {
            if (isProduction) {
                await sql.query(cmd);
            } else {
                await new Promise((res, rej) => localDb.run(cmd, (err) => err ? rej(err) : res()));
            }
        } catch (e) {
            console.error(`Erreur création table: ${e.message}`);
        }
    }

    // Seed default user
    const seedId = 'GOS-943029';
    const seedQuery = isProduction 
        ? sql`INSERT INTO users (id, phone_number, kyc_status, daily_limit) VALUES (${seedId}, '0707070707', 'level_1', 100000) ON CONFLICT (id) DO NOTHING`
        : new Promise((res, rej) => localDb.run(`INSERT OR IGNORE INTO users (id, phone_number, kyc_status, daily_limit) VALUES (?, ?, ?, ?)`, [seedId, '0707070707', 'level_1', 100000], (err) => err ? rej(err) : res()));
    
    await seedQuery;
    console.log("✅ GoSend: Schéma BDD synchronisé.");
}

export default { query, initCoreTables };
