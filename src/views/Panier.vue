<template>
  <button type="button" @click="checkout">
    Payer avec Stripe
  </button>
</template>

<script>
import { loadStripe } from '@stripe/stripe-js';

export default {
  methods: {
    async checkout() {
      try {
        console.log("1️⃣ Click détecté");

        const stripe = await loadStripe(
          'pk_test_51T20K6AwgHqDmd0F8LcnioXKpuzSyQv7aPkDhhmtPEH9BA98KOzf6F43K2O4A5WjhHHVlguyp48W0bmqMbwSvcDm00YINXIME3'
        );

        console.log("2️⃣ Stripe chargé :", stripe);

        if (!stripe) {
          alert("Stripe ne s'est pas chargé !");
          return;
        }

        const response = await fetch(
          'https://stripe-backend-production-2ac4.up.railway.app/create-checkout-session',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            }
          }
        );

        console.log("3️⃣ Réponse fetch :", response);

        const data = await response.json();
        console.log("4️⃣ Data :", data);

        await stripe.redirectToCheckout({
          sessionId: data.id,
        });

      } catch (error) {
        console.error("❌ ERREUR :", error);
        alert("Erreur : " + error.message);
      }
    }
  }
};
</script>
