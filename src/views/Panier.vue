<template>
  <button type="button" @click="checkout">
    Payer avec Stripe
  </button>
</template>

<script>
export default {
  methods: {
    async checkout() {
      try {
        const response = await fetch(
          'https://stripe-backend-production-2ac4.up.railway.app/create-checkout-session',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        const session = await response.json();

        if (session.url) {
          // ✅ Redirection officielle Stripe 2026
          window.location.href = session.url;
        } else {
          alert("Erreur : URL Stripe manquante");
        }

      } catch (error) {
        console.error(error);
        alert("Erreur paiement : " + error.message);
      }
    },
  },
};
</script>
