<template>
  <button @click="checkout">Payer avec Stripe</button>
</template>

<script>
import { loadStripe } from '@stripe/stripe-js';

export default {
  methods: {
    async checkout() {
      try {
        // 1️⃣ Initialiser Stripe avec TA clé publique
        const stripe = await loadStripe(
          'pk_test_51T20K6AwgHqDmd0F8LcnioXKpuzSyQv7aPkDhhmtPEH9BA98KOzf6F43K2O4A5WjhHHVlguyp48W0bmqMbwSvcDm00YINXIME3'
        );

        // 2️⃣ Appeler TON backend Railway
        const response = await fetch(
          'https://stripe-backend-production-2ac4.up.railway.app/create-checkout-session',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              // facultatif si ton backend attend des données
              success_url: 'https://monprijet.vercel.app/success',
              cancel_url: 'https://monprijet.vercel.app/cancel',
            }),
          }
        );

        if (!response.ok) {
          throw new Error('Erreur lors de la création de la session');
        }

        const session = await response.json();

        // 3️⃣ Redirection vers Stripe Checkout
        const result = await stripe.redirectToCheckout({
          sessionId: session.id,
        });

        if (result.error) {
          alert(result.error.message);
        }
      } catch (error) {
        console.error(error);
        alert('Erreur paiement : ' + error.message);
      }
    },
  },
};
</script>
