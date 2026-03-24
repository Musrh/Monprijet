<template>
  <div class="p-6 text-center">
    <h1 class="text-2xl font-bold text-green-600 mb-4">
      {{ $t("success.title") }} ✅
    </h1>

    <p v-if="loading">{{ $t("success.loading") }}</p>

    <p v-if="success" class="text-green-600 font-semibold">
      {{ $t("success.successMessage") }}
    </p>

    <p v-if="error" class="text-red-600 font-semibold">
      {{ $t("success.errorMessage") }}
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
    ...mapState(["user", "cart"]),
    currentLang() {
      return this.$store.getters["language/currentLanguage"];
    }
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
          throw new Error(this.$t("success.userNotLoggedIn"));
        }

        const adresse = localStorage.getItem("adresseLivraison") || "";

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

        // nettoyer pour éviter d’envoyer à nouveau
        localStorage.removeItem("adresseLivraison");
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
