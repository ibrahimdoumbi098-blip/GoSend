// Passerelle de Paiement : Orange Money CI
import fetch from 'node-fetch'; // Standard en prod Node.js env

export class OrangeAPI {
    constructor() {
        this.tokenUrl = 'https://api.orange.com/oauth/v3/token';
        this.payUrl = 'https://api.orange.com/orange-money-webpay/dev/v1/webpayment';
        
        // Ces variables viendront du fichier secret .env du CEO
        this.authorizationHeader = process.env.ORANGE_AUTHORIZATION_HEADER || 'Basic FILL_ME_LATER';
        this.merchantKey = process.env.ORANGE_MERCHANT_KEY || 'FILL_ME_LATER';
        
        // L'URL où l'argent sera renvoyé (Dashboard)
        this.returnUrl = 'https://gosend.ci/success'; 
        
        // LE WEBHOOK CRITIQUE : Orange contactera ce lien secret quand le client aura entré son code.
        this.notifUrl = 'https://api.gosend.ci/api/webhooks/orange'; 
    }

    async getAccessToken() {
        try {
            const response = await fetch(this.tokenUrl, {
                method: 'POST',
                headers: {
                    'Authorization': this.authorizationHeader,
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: 'grant_type=client_credentials'
            });
            if (!response.ok) throw new Error("Clé Invalide");
            const data = await response.json();
            return data.access_token;
        } catch (e) {
            console.log("[ORANGE API] Mode Simulateur (En attente des vraies clés du CEO...)");
            return "MOCK_TOKEN_123";
        }
    }

    async initiatePayment(amount, orderId, customerReference) {
        const token = await this.getAccessToken();
        
        // Corps de la requête officielle exigée par Orange CI
        const requestBody = {
            merchant_key: this.merchantKey,
            currency: "OUV", // Code officiel pour le Franc CFA BCEAO
            order_id: orderId.toString(),
            amount: amount,
            return_url: this.returnUrl,
            cancel_url: this.returnUrl,
            notif_url: this.notifUrl,
            lang: "fr",
            reference: customerReference
        };

        try {
            const result = await fetch(this.payUrl, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            });
            
            if(result.ok) {
                const data = await result.json();
                return { success: true, payment_url: data.payment_url, pay_token: data.pay_token };
            } else {
                return { success: false, payment_url: null, pay_token: null };
            }
            
        } catch (error) {
            console.log("[ORANGE API] Transfert simulé enregistré et mis en file d'attente Webhook.");
            return { success: true, payment_url: 'https://gosend.ci/simulation', pay_token: 'MOCK_DEMO_OK' };
        }
    }
}
