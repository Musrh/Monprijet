<template>
  <div class="p-6 text-center">
    <h1 class="text-2xl font-bold text-green-600 mb-4">
      Paiement réussi ✅
    </h1>

    <p v-if="loading">Confirmation du paiement en cours...</p>

    <p v-if="success" class="text-green-600 font-semibold">
      Votre commande a bien été enregistrée.
    </p>

    <p v-if="error" class="text-red-600 font-semibold">
      Une erreur est survenue.
    </p>
  </div>
</template>

<script>
import axios from "axios";
import { mapState } from "vuex";

export default {
  data() {
    return {
      loading: true,
      success: false,
      error: false,
    };
  },
  computed: {
    ...mapState(["user", "cart"]),
  },
  async mounted() {
    const sessionId = this.$route.query.session_id; // Stripe
    const paypalToken = this.$route.query.token;   // PayPal

    try {
      // ================= STRIPE =================
      if (sessionId) {
        // Capture non nécessaire, Stripe via webhook Firestore
        console.log("Stripe success:", sessionId);
        this.success = true;
      }

      // ================= PAYPAL =================
      if (paypalToken) {
        console.log("Capture PayPal order:", paypalToken);

        await axios.post(
          "https://stripe-backend-production-2ac4.up.railway.app/capture-paypal-order",
          {
            orderId: paypalToken,
            email: this.user.email,
            adresseLivraison: "Adresse déjà fournie",
            items: this.cart, // <- Items correctement envoyés pour Firestore
          }
        );

        this.success = true;
      }

      // 🔹 Vider le panier après succès
      if (this.success) {
        this.$store.commit("clearCart");
      }
    } catch (err) {
      console.error("Erreur confirmation paiement:", err);
      this.error = true;
    }

    this.loading = false;
  },
};
</script>
