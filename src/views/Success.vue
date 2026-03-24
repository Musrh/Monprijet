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
import axios from "axios";
import { mapState } from "vuex";

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

    // 🔹 langue courante depuis Vuex
    currentLang() {
      return this.$store.getters["language/currentLanguage"];
    },

    // 🔹 titres selon langue
    titles() {
      const translations = {
        fr: {
          payment_success: "Paiement réussi ✅",
          confirming: "Confirmation du paiement en cours...",
          order_recorded: "Votre commande a bien été enregistrée.",
          error: "Une erreur est survenue."
        },
        en: {
          payment_success: "Payment successful ✅",
          confirming: "Confirming payment...",
          order_recorded: "Your order has been recorded.",
          error: "An error occurred."
        }
      };
      return translations[this.currentLang] || translations.fr;
    }
  },
  async mounted() {
    const sessionId = this.$route.query.session_id; // Stripe
    const paypalToken = this.$route.query.token;    // PayPal

    try {
      // ================= STRIPE =================
      if (sessionId) {
        console.log("Stripe payment success:", sessionId);
        this.success = true;
        return;
      }

      // ================= PAYPAL =================
      if (paypalToken) {
        console.log("PayPal token:", paypalToken);

        if (!this.user || !this.user.email) throw new Error("Utilisateur non connecté");

        await axios.post(
          "https://paypalbackend-production.up.railway.app/capture-paypal-order",
          {
            orderId: paypalToken,
            email: this.user.email,
            items: this.cart || [],
            adresseLivraison: this.paypalAdresseLivraison || "",
          }
        );

        this.success = true;

        // 🔹 vider adresse PayPal dans Vuex
        this.$store.dispatch("setPaypalAdresse", "");
      }
    } catch (err) {
      console.error("Erreur Success.vue :", err);
      this.error = true;
    } finally {
      this.loading = false;
    }
  }
};
</script>

<style scoped>
h1 {
  color: green;
}
</style>
