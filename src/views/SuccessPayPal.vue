<template>
  <div class="p-6 text-center">
    <h1 class="text-2xl font-bold text-green-600 mb-4">
      Paiement PayPal réussi ✅
    </h1>

    <p v-if="loading">Confirmation du paiement en cours...</p>

    <p v-if="success" class="text-green-600 font-semibold">
      Votre commande a bien été enregistrée.
    </p>

    <p v-if="error" class="text-red-600 font-semibold">
      Une erreur est survenue lors de la confirmation du paiement.
    </p>
  </div>
</template>

<script>
import axios from "axios";
import { mapState } from "vuex";

export default {
  name: "SuccessPayPal",
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
    // Token PayPal renvoyé par l'URL
    const paypalToken = this.$route.query.token;
    const payerID = this.$route.query.PayerID;

    if (!paypalToken || !this.user) {
      this.error = true;
      this.loading = false;
      return;
    }

    try {
      // Capture l'ordre PayPal via ton backend
      await axios.post(
        "https://paypalbackend-production.up.railway.app/capture-paypal-order",
        {
          orderId: paypalToken,
          email: this.user.email,
          items: this.cart,
          adresseLivraison: localStorage.getItem("adresseLivraison") || "",
        }
      );

      this.success = true;
      localStorage.removeItem("adresseLivraison");
    } catch (err) {
      console.error("Erreur capture PayPal:", err);
      this.error = true;
    } finally {
      this.loading = false;
    }
  },
};
</script>

<style scoped>
h1 {
  color: green;
}
</style>
