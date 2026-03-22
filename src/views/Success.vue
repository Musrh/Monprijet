<template>
  <div class="p-4 max-w-3xl mx-auto">
    <h1 class="text-2xl font-bold mb-4">Paiement PayPal</h1>
    <p v-if="loading">Traitement du paiement...</p>
    <p v-else-if="success" class="text-green-600 font-semibold">Paiement réussi ! Merci pour votre commande.</p>
    <p v-else class="text-red-600 font-semibold">Erreur lors du paiement. Veuillez réessayer.</p>
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
    };
  },
  computed: {
    ...mapState(["cart", "user"]),
  },
  async mounted() {
    try {
      const params = new URLSearchParams(window.location.search);
      const orderId = params.get("token"); // PayPal renvoie l'orderId via token

      if (!orderId || !this.user) throw new Error("Données manquantes");

      await axios.post(
        "https://stripe-backend-production-2ac4.up.railway.app/capture-paypal-order",
        {
          orderId,
          email: this.user.email,
          items: this.cart,
          adresseLivraison: localStorage.getItem("adresseLivraison") || "",
        }
      );

      this.success = true;
      localStorage.removeItem("adresseLivraison"); // Nettoyage
    } catch (err) {
      console.error("Erreur capture PayPal:", err);
      this.success = false;
    } finally {
      this.loading = false;
    }
  },
};
</script>
