// Passerelle de Paiement : MTN MoMo API CI

export class MtnMoMoAPI {
    constructor() {
        // En production, nous utiliserons l'API Collection (Pour encaisser)
        this.collectionUrl = 'https://sandbox.momodeveloper.mtn.com/collection/v1_0/requesttopay';
        this.targetEnvironment = 'mtnivorycoast';
        this.subscriptionKey = process.env.MTN_SUBSCRIPTION_KEY || 'FILL_ME_LATER';
    }

    async requestToPay(amount, phoneNumber, orderId) {
        // Corps de la requête officielle MTN
        const requestBody = {
            amount: amount.toString(),
            currency: "XOF", // Franc CFA
            externalId: orderId.toString(),
            payer: {
                partyIdType: "MSISDN", // C'est un numéro de téléphone mobile
                partyId: phoneNumber // Doit être au format 225XXXXXXXX
            },
            payerMessage: "Paiement via GoSend",
            payeeNote: "Transfert Inter-réseaux"
        };
        
        console.log(`[MTN API] Demande de prélèvement (Collection) envoyée au numéro ${phoneNumber}.`);

        // Mode Simulateur en attendant les identifiants d'entreprise du CEO
        return { success: true, status: 'PENDING_USER_APPROVAL_ON_MOBILE' };
    }
}
