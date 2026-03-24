<template>
  <div class="p-6 text-center min-h-screen flex flex-col justify-center items-center">
    <h1 class="text-2xl font-bold text-green-600 mb-4">
      {{ titles.payment_success }}
    </h1>

    <p v-if="loading">{{ titles.confirming }}</p>

    <p v-if="success" class="text-green-600 font-semibold">
      {{ titles.order_recorded }}
    </p>

    <p v-if="error" class="text-red-600 font-semibold">
      {{ titles.error }}
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
    ...mapState(["user", "cart", "paypalAdresseLivraison"]),
    currentLang() {
      return this.$store.getters["language/currentLanguage"];
    },
    titles() {
      const translations = {
        fr: {
          payment_success: "Paiement réussi ✅",
          confirming: "Confirmation de votre commande en cours...",
          order_recorded: "Votre commande a bien été enregistrée.",
          error: "Une erreur est survenue."
        },
        en: {
          payment_success: "Payment successful ✅",
          confirming: "Confirming your order...",
          order_recorded: "Your order has been recorded.",
          error: "An error occurred."
        }
      };
      return translations[this.currentLang] || translations.fr;
    }
  },
  async mounted() {
    const stripeSessionId = this.$route.query.session_id; // Stripe
    const paypalToken = this.$route.query.token;          // PayPal

    if (!this.user || (!stripeSessionId && !paypalToken)) {
      this.error = true;
      this.loading = false;
      return;
    }

    try {
      if (stripeSessionId) {
        // 🔹 Confirmation Stripe
        await axios.post(
          "https://stripe-backend-production-2ac4.up.railway.app/confirm-stripe-payment",
          {
            sessionId: stripeSessionId,
            email: this.user.email,
            items: this.cart,
          }
        );
      } else if (paypalToken) {
        // 🔹 Confirmation PayPal
        await axios.post(
          "https://paypalbackend-production.up.railway.app/capture-paypal-order",
          {
            orderId: paypalToken,
            email: this.user.email,
            items: this.cart,
            adresseLivraison: this.paypalAdresseLivraison
          }
        );
      }

      this.success = true;

      // 🔹 Vider le panier et l'adresse PayPal
      this.$store.dispatch("clearCart");
      if (paypalToken) this.$store.dispatch("setPaypalAdresse", "");
    } catch (err) {
      console.error("Erreur confirmation paiement:", err);
      this.error = true;
    } finally {
      this.loading = false;
    }
  }
};
</script>

<style scoped>
/* Optionnel : style minimal */
</style>
