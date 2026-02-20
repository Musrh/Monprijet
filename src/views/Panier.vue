<template>
  <button @click="checkout">Payer avec Stripe</button>
</template>

<script>
import { loadStripe } from '@stripe/stripe-js';

export default {
  methods: {
    async checkout() {
      console.log("Click détecté");

      const stripe = await loadStripe(
        'pk_test_51T20K6AwgHqDmd0F8LcnioXKpuzSyQv7aPkDhhmtPEH9BA98KOzf6F43K2O4A5WjhHHVlguyp48W0bmqMbwSvcDm00YINXIME3'
      );

      console.log("Stripe chargé");

      const response = await fetch(
        'https://stripe-backend-production-2ac4.up.railway.app/create-checkout-session',
        { method: 'POST' }
      );

      console.log("Réponse reçue");

      const session = await response.json();
      console.log(session);

      await stripe.redirectToCheckout({
        sessionId: session.id,
      });
    }
  }
}
</script>
