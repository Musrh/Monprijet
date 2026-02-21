<template>
  <div class="panier">
    <h2>🛒 Mon Panier</h2>

    <div v-if="cart.length === 0">
      <p>Votre panier est vide.</p>
    </div>

    <div v-else>
      <div v-for="item in cart" :key="item.id" class="cart-item">
        <img :src="item.image" width="80" />
        <div class="info">
          <h3>{{ item.nom }}</h3>
          <p>{{ item.prix }} €</p>
          <input
            type="number"
            min="1"
            v-model.number="item.quantity"
            @change="updateQuantity(item)"
          />
        </div>
        <button type="button" @click="remove(item.id)">❌</button>
      </div>

      <h3 class="total">Total : {{ total }} €</h3>

      <button class="pay-btn" @click="payer">
        💳 Payer
      </button>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  computed: {
    ...mapState(["cart"]),

    total() {
      return this.cart.reduce((sum, item) => sum + item.prix * item.quantity, 0);
    },
  },

  methods: {
    remove(id) {
      // Supprime un produit du panier
      this.$store.dispatch("removeItem", id);
    },

    updateQuantity(item) {
      // Met à jour la quantité dans le store
      this.$store.commit("SET_QUANTITY", {
        id: item.id,
        quantity: item.quantity,
      });
    },

    async payer() {
      if (this.cart.length === 0) {
        alert("Panier vide");
        return;
      }

      try {
        // Envoi du panier au backend Stripe
        const response = await fetch(
          "https://stripe-backend-production-2ac4.up.railway.app/create-checkout-session",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ items: this.cart }), // ⚠️ clé "items"
          }
        );

        const data = await response.json();
        console.log("Réponse backend :", data);

        if (data.url) {
          // Redirection vers Stripe Checkout
          window.location.href = data.url;
        } else {
          alert(data.error || "Erreur Stripe");
        }
      } catch (error) {
        console.error("Erreur paiement :", error);
        alert("Impossible de lancer le paiement");
      }
    },
  },
};
</script>

<style scoped>
.panier {
  max-width: 700px;
  margin: auto;
}

.cart-item {
  display: flex;
  align
