<template>
  <div class="p-6 text-center max-w-xl mx-auto">

    <h1 class="text-3xl font-bold text-green-600 mb-6">
      {{ t("title") }}
    </h1>

    <!-- Loading -->
    <div v-if="loading" class="animate-pulse text-gray-600">
      {{ t("loading") }}
    </div>

    <!-- Success -->
    <div v-if="success" class="space-y-4">
      <p class="text-green-600 font-semibold text-lg">
        {{ t("success") }}
      </p>

      <button
        @click="goHome"
        class="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
      >
        {{ t("backHome") }}
      </button>
    </div>

    <!-- Error -->
    <div v-if="error" class="space-y-4">
      <p class="text-red-600 font-semibold text-lg">
        {{ t("error") }}
      </p>

      <button
        @click="goHome"
        class="bg-gray-600 text-white px-6 py-2 rounded hover:bg-gray-700 transition"
      >
        {{ t("backHome") }}
      </button>
    </div>

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

      // 🔒 Sécurité : utilisateur obligatoire
      if (!this.user || !this.user.email) {
        throw new Error("Utilisateur non connecté");
      }

      // ================= STRIPE =================
      if (sessionId) {
        console.log("Stripe success:", sessionId);

        // ⚠️ Si tu veux confirmer côté backend plus tard
        // await axios.post("/confirm-stripe", { sessionId })

        this.finishSuccess();
        return;
      }

      // ================= PAYPAL =================
      if (paypalToken) {

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

        localStorage.removeItem("adresseLivraison");

        this.finishSuccess();
      }

    } catch (err) {
      console.error("Erreur Success.vue :", err);
      this.error = true;
    } finally {
      this.loading = false;
    }
  },

  methods: {

    finishSuccess() {
      this.success = true;

      // 🛒 Nettoyer panier
      this.$store.dispatch("clearCart");
    },

    goHome() {
      this.$router.push("/");
    },

    t(key) {
      const translations = {
        fr: {
          title: "Paiement réussi ✅",
          loading: "Confirmation du paiement en cours...",
          success: "Votre commande a bien été enregistrée.",
          error: "Une erreur est survenue lors de la confirmation.",
          backHome: "Retour à l'accueil"
        },
        en: {
          title: "Payment Successful ✅",
          loading: "Confirming payment...",
          success: "Your order has been successfully recorded.",
          error: "An error occurred during confirmation.",
          backHome: "Back to home"
        }
      };

      return translations[this.currentLang][key];
    }

  }
};
</script>
