// Passerelle de Paiement : Moov Money CI
export class MoovAPI {
    constructor() {
        this.apiUrl = 'https://api.moov-africa.ci/payment/v1';
        this.merchantId = process.env.MOOV_MERCHANT_ID || 'FILL_ME_LATER';
    }

    async initiatePayment(amount, orderId, phone) {
        console.log(`[MOOV API] Initialisation paiement Moov pour ${phone} - ${amount} FCFA`);
        
        // Simulation d'appel API
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({ 
                    success: true, 
                    message: "Demande envoyée au client via Moov Money",
                    transaction_id: `MOOV-${Date.now()}`
                });
            }, 800);
        });
    }
}
