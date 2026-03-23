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
      Une erreur est survenue.
    </p>
  </div>
</template>

<script>
import { mapState } from "vuex";
import axios from "axios";

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
    ...mapState(["user", "cart", "paypalAdresseLivraison"]),
  },
  async mounted() {
    const paypalToken = this.$route.query.token; // token PayPal

    if (!paypalToken) {
      this.error = true;
      this.loading = false;
      return;
    }

    try {
      await axios.post(
        "https://paypalbackend-production.up.railway.app/capture-paypal-order",
        {
          orderId: paypalToken,
          email: this.user.email,
          items: this.cart,
          adresseLivraison: this.paypalAdresseLivraison,
        }
      );

      this.success = true;

      // 🔹 vider le panier et l'adresse PayPal
      this.$store.dispatch("clearCart");
    } catch (err) {
      console.error(err);
      this.error = true;
    } finally {
      this.loading = false;
    }
  },
};
</script>
