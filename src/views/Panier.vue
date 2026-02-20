<template>
  <button @click="checkout">Payer avec Stripe</button>
</template>

<script>
// Nécessite : npm install @stripe/stripe-js
import { loadStripe } from '@stripe/stripe-js';

export default {
  methods: {
    async checkout() {
      // 1. Initialiser Stripe avec votre clé publique
      const stripe = await loadStripe('pk_test_votre_cle_publique');

      // 2. Appeler votre back-end pour créer une session de paiement
      const response = await fetch('https://votre-api.com/create-checkout-session', {
        method: 'POST',
      });
      const session = await response.json();

      // 3. Rediriger vers Stripe Checkout
      const result = await stripe.redirectToCheckout({
        sessionId: session.id,
      });

      if (result.error) {
        alert(result.error.message);
      }
    },
  },
};
</script>
