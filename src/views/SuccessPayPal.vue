<template>
  <div class="p-6 text-center max-w-xl mx-auto">

    <h1 class="text-3xl font-bold text-green-600 mb-6">
      {{ t("title") }}
    </h1>

    <!-- Loading -->
    <div v-if="loading" class="text-gray-600 animate-pulse">
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

    // 🔹 Récupérer la langue courante depuis Vuex
    currentLang() {
      return this.$store.getters["language/currentLanguage"];
    },
  },

  async mounted() {
    const paypalToken = this.$route.query.token;

    if (!paypalToken) {
      this.error = true;
      this.loading = false;
      return;
    }

    // 🔒 Sécurité utilisateur
    if (!this.user || !this.user.email) {
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
          items: this.cart || [],
          adresseLivraison: this.paypalAdresseLivraison || "",
        }
      );

      this.success = true;

      // 🛒 Nettoyage propre
      this.$store.dispatch("clearCart");
      this.$store.dispatch("setPaypalAdresse", "");

    } catch (err) {
      console.error("Erreur PayPal capture:", err);
      this.error = true;
    } finally {
      this.loading = false;
    }
  },

  methods: {
    goHome() {
      this.$router.push("/");
    },

    // 🔹 Fonction de traduction simple
    t(key) {
      const translations = {
        fr: {
          title: "Paiement PayPal réussi ✅",
          loading: "Confirmation du paiement en cours...",
          success: "Votre commande a bien été enregistrée.",
          error: "Une erreur est survenue lors de la confirmation.",
          backHome: "Retour à l'accueil"
        },
        en: {
          title: "PayPal Payment Successful ✅",
          loading: "Confirming PayPal payment...",
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

<style scoped>
h1 {
  color: green;
}
</style>
