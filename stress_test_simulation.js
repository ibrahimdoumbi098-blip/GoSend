// Native fetch is available in Node v24+

/**
 * GoSend Pression Test v1.0
 * Objectif: 5000 transactions en 60 secondes
 * Simule des transferts réels avec détection de routage et échecs intermittents.
 */

const TARGET_URL = 'https://gosend-peach.vercel.app/api/transfer';
const TOTAL_REQUESTS = 5000;
const CONCURRENCY = 50; // Nombre de requêtes simultanées

const PREFIXES = {
    'ORANGE': ['07', '08', '09'],
    'MTN': ['05', '04', '06'],
    'MOOV': ['01', '02', '03'],
    'WAVE': ['00']
};

function generateRandomPhone() {
    const operators = Object.keys(PREFIXES);
    const op = operators[Math.floor(Math.random() * operators.length)];
    const prefix = PREFIXES[op][Math.floor(Math.random() * PREFIXES[op].length)];
    const suffix = Math.floor(Math.random() * 100000000).toString().padStart(8, '0');
    return prefix + suffix;
}

async function sendTransaction(id) {
    const phone = generateRandomPhone();
    const amount = Math.floor(Math.random() * 50000) + 500;
    const shouldFail = Math.random() < 0.1; // 10% d'échecs forcés pour tester le rollback

    try {
        const start = Date.now();
        const res = await fetch(TARGET_URL, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'x-simulate-failure': shouldFail ? 'true' : 'false'
            },
            body: JSON.stringify({
                user_id: 'GOS-943029',
                amount: amount,
                phone: phone,
                idempotency_key: `stress-test-${id}-${Date.now()}`
            })
        });
        
        const duration = Date.now() - start;
        console.log(`[TX ${id}] ${res.status} | ${phone} | ${duration}ms | ${shouldFail ? 'FAILURE_SIM' : 'OK'}`);
        return { success: res.ok, duration };
    } catch (e) {
        console.error(`[TX ${id}] CRITICAL ERROR:`, e.message);
        return { success: false, duration: 0 };
    }
}

async function run() {
    console.log("🚀 Lancement de l'Audit de Stress GoSend...");
    console.log(`Cible: ${TARGET_URL}`);
    console.log(`Volume: ${TOTAL_REQUESTS} transactions`);
    
    let completed = 0;
    const startTime = Date.now();

    async function worker() {
        while (completed < TOTAL_REQUESTS) {
            const id = ++completed;
            if (id > TOTAL_REQUESTS) break;
            await sendTransaction(id);
        }
    }

    const workers = Array.from({ length: CONCURRENCY }, () => worker());
    await Promise.all(workers);

    const totalTime = (Date.now() - startTime) / 1000;
    console.log("\n==========================================");
    console.log(`✅ AUDIT TERMINÉ en ${totalTime.toFixed(2)}s`);
    console.log(`TPS Moyen: ${(TOTAL_REQUESTS / totalTime).toFixed(2)} tx/s`);
    console.log("==========================================");
}

run();
