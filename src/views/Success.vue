<template>
  <div class="p-6 text-center">
    <h1 class="text-2xl font-bold text-green-600 mb-4">
      {{ titles.paymentSuccess }}
    </h1>

    <p v-if="loading">{{ titles.loading }}</p>

    <p v-if="success" class="text-green-600 font-semibold">
      {{ titles.orderConfirmed }}
    </p>

    <p v-if="error" class="text-red-600 font-semibold">
      {{ titles.errorOccurred }}
    </p>
  </div>
</template>

<script>
import { mapState } from "vuex";
import axios from "axios";

export default {
  name: "Success",
  data() {
    return {
      loading: true,
      success: false,
      error: false,
    };
  },
  computed: {
    ...mapState(["user", "cart"]),

    // 🔹 Module langue depuis Vuex
    currentLang() {
      return this.$store.getters["language/currentLanguage"];
    },

    titles() {
      const translations = {
        fr: {
          paymentSuccess: "Paiement réussi ✅",
          loading: "Confirmation du paiement en cours...",
          orderConfirmed: "Votre commande a bien été enregistrée.",
          errorOccurred: "Une erreur est survenue.",
        },
        en: {
          paymentSuccess: "Payment successful ✅",
          loading: "Confirming your payment...",
          orderConfirmed: "Your order has been successfully recorded.",
          errorOccurred: "An error occurred.",
        },
      };
      return translations[this.currentLang] || translations.fr;
    },
  },
  async mounted() {
    try {
      const sessionId = this.$route.query.session_id; // Stripe
      const paypalToken = this.$route.query.token;    // PayPal

      // ================= STRIPE =================
      if (sessionId) {
        console.log("Stripe payment success:", sessionId);
        this.success = true;
        this.loading = false;
        return;
      }

      // ================= PAYPAL =================
      if (paypalToken) {
        console.log("PayPal token:", paypalToken);

        if (!this.user || !this.user.email) {
          throw new Error("Utilisateur non connecté");
        }

        // 🔹 Adresse depuis Vuex au lieu de localStorage
        const adresse = this.$store.state.paypalAdresseLivraison || "";

        await axios.post(
          "https://paypalbackend-production.up.railway.app/capture-paypal-order",
          {
            orderId: paypalToken,
            email: this.user.email,
            items: this.cart || [],
            adresseLivraison: adresse,
          }
        );

        this.success = true;
      }
    } catch (err) {
      console.error("Erreur Success.vue :", err);
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
