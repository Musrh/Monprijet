<template>
  <div class="p-4 max-w-3xl mx-auto text-center">

    <!-- Message Paiement réussi -->
    <div v-if="paymentSuccess" class="mt-6 p-6 bg-green-100 text-green-800 border border-green-300 rounded text-center font-semibold text-xl">
      ✅ Paiement réussi !
    </div>

    <!-- Choix paiement avant succès -->
    <div v-else>
      <h2 class="text-xl font-bold mb-4">🛒 Mon Panier</h2>
      <p class="text-gray-500 mb-4">Votre panier est prêt pour le paiement.</p>

      <!-- Mode paiement unique pour simplifier -->
      <button
        @click="payer"
        class="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded font-semibold"
      >
        Payer
      </button>
    </div>

  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  data() {
    return {
      paymentSuccess: false
    };
  },
  computed: {
    ...mapState(["cart", "user"])
  },
  methods: {
    // Simule un paiement réussi
    payer() {
      if (!this.user) {
        alert("Veuillez vous connecter avant de payer");
        this.$router.push("/login");
        return;
      }
      if (!this.cart.length) {
        alert("Panier vide");
        return;
      }

      // Ici on simule le succès (Stripe ou PayPal)
      this.paymentSuccess = true;
      this.$store.dispatch("clearCart");
    }
  }
};
</script>

<style scoped>
button {
  transition: all 0.2s;
}
button:hover {
  transform: translateY(-1px);
}
</style>
