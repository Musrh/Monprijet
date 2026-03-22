<template>
  <div class="p-6 text-center">
    <h1 class="text-2xl font-bold text-green-600">
      Paiement confirmé ✅
    </h1>
    <p class="mt-4">Merci pour votre commande.</p>
  </div>
</template>

<script>
import axios from "axios";
import { mapState } from "vuex";

export default {
  computed: {
    ...mapState(["cart", "user"]),
  },

  async mounted() {
    const urlParams = new URLSearchParams(window.location.search);

    const sessionId = urlParams.get("session_id"); // Stripe
    const orderId = urlParams.get("token");        // PayPal

    try {
      // 🟡 PAYPAL
      if (orderId) {
        await axios.post(
          "https://stripe-backend-production-2ac4.up.railway.app/capture-paypal-order",
          {
            orderId,
            email: this.user.email,
            adresseLivraison: "Adresse déjà fournie",
            items: this.cart, // 🔥 IMPORTANT
          }
        );
      }

      // 🧹 Vider panier après succès
      this.$store.commit("clearCart");

    } catch (error) {
      console.error("Erreur confirmation paiement:", error);
    }
  },
};
</script>
