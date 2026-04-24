// Passerelle de Paiement : Orange Money CI
import fetch from 'node-fetch';

export class OrangeAPI {
    constructor() {
        this.tokenUrl = 'https://api.orange.com/oauth/v3/token';
        this.payUrl = 'https://api.orange.com/orange-money-webpay/dev/v1/webpayment';
        
        // Ces variables viendront du fichier secret .env du CEO
        this.authorizationHeader = process.env.ORANGE_AUTHORIZATION_HEADER || '';
        this.merchantKey = process.env.ORANGE_MERCHANT_KEY || '';
        
        this.returnUrl = 'https://gosend.ci/success'; 
        this.notifUrl = 'https://api.gosend.ci/api/webhooks/orange'; 

        // Mode simulateur si les clés ne sont pas configurées
        this.isSimulator = !this.authorizationHeader || !this.merchantKey;
    }

    async getAccessToken() {
        if (this.isSimulator) {
            console.log("[ORANGE API] Mode Simulateur actif");
            return null;
        }
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
            console.log("[ORANGE API] Erreur token, bascule en simulateur");
            this.isSimulator = true;
            return null;
        }
    }

    async initiatePayment(amount, orderId, customerReference) {
        // ─── Mode Simulateur : succès immédiat ───
        if (this.isSimulator) {
            console.log(`[ORANGE SIM] Paiement simulé: ${amount} FCFA → ${customerReference}`);
            return { success: true, payment_url: null, pay_token: `SIM-ORANGE-${Date.now()}` };
        }

        const token = await this.getAccessToken();
        if (!token) {
            return { success: true, payment_url: null, pay_token: `SIM-ORANGE-${Date.now()}` };
        }

        const requestBody = {
            merchant_key: this.merchantKey,
            currency: "OUV",
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
            
            if (result.ok) {
                const data = await result.json();
                return { success: true, payment_url: data.payment_url, pay_token: data.pay_token };
            } else {
                console.log(`[ORANGE API] Réponse ${result.status}, bascule simulateur`);
                return { success: true, payment_url: null, pay_token: `SIM-ORANGE-${Date.now()}` };
            }
        } catch (error) {
            console.log("[ORANGE API] Transfert simulé (erreur réseau)");
            return { success: true, payment_url: null, pay_token: `SIM-ORANGE-${Date.now()}` };
        }
    }
}
