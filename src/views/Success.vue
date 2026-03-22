<template>
  <div class="p-6 text-center">
    <h1 class="text-2xl font-bold text-green-600 mb-4">Paiement réussi ✅</h1>

    <p v-if="loading">Confirmation du paiement en cours...</p>
    <p v-if="success" class="text-green-600 font-semibold">Votre commande a bien été enregistrée.</p>
    <p v-if="error" class="text-red-600 font-semibold">Une erreur est survenue.</p>
  </div>
</template>

<script>
import { mapState } from "vuex";
import axios from "axios";

export default {
  data() { return { loading: true, success: false, error: false }; },
  computed: { ...mapState(["user", "cart"]) },
  async mounted() {
    try {
      const sessionId = this.$route.query.session_id;
      const paypalToken = this.$route.query.token;

      // Stripe
      if (sessionId) {
        console.log("Stripe success:", sessionId);
        this.success = true;
      }

      // PayPal capture
      if (paypalToken) {
        console.log("Capturing PayPal order:", paypalToken);

        await axios.post(
          "https://stripe-backend-production-2ac4.up.railway.app/capture-paypal-order",
          { orderId: paypalToken }
        );

        this.success = true;
      }
    } catch (err) {
      console.error(err);
      this.error = true;
    }
    this.loading = false;
  },
};
</script>
