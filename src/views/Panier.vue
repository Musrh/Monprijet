<template>
  <div class="panier">
    <h2>🛒 Mon Panier</h2>

    <!-- Panier vide -->
    <div v-if="cart.length === 0">
      <p>Votre panier est vide.</p>
    </div>

    <!-- Panier avec produits -->
    <div v-else>
      <div v-for="item in cart" :key="item.id" class="cart-item">
        <img :src="item.image" width="80" />
        <div class="info">
          <h3>{{ item.nom }}</h3>
          <p>{{ item.prix }} €</p>

          <!-- Modifier la quantité -->
          <input
            type="number"
            min="1"
            v-model.number="item.quantity"
            @change="updateQuantity(item)"
          />
        </div>

        <!-- Supprimer produit -->
        <button type="button" @click="remove(item.id)">❌</button>
      </div>

      <!-- Total -->
      <h3 class="total">Total : {{ total }} €</h3>

      <!-- Bouton payer -->
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
      return this.cart.reduce(
        (sum, item) => sum + item.prix * item.quantity,
        0
      );
    }
  },
  methods: {
    remove(id) {
      this.$store.dispatch("removeItem", id);
    },
    updateQuantity(item) {
      if (item.quantity < 1) item.quantity = 1;
      this.$store.dispatch("updateQuantity", {
        id: item.id,
        quantity: item.quantity
      });
    },
    async payer() {
      if (!this.cart || this.cart.length === 0) {
        alert("Panier vide");
        return;
      }

      try {
        const response = await fetch(
          "https://stripe-backend-production-2ac4.up.railway.app/create-checkout-session",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ items: this.cart }) // 🔹 Important : items
          }
        );

        const data = await response.json();
        console.log("Réponse backend :", data);

        if (data.url) {
          window.location.href = data.url;
        } else {
          alert(data.error || "Erreur Stripe");
        }
      } catch (error) {
        console.error("Erreur paiement :", error);
        alert("Impossible de lancer le paiement");
      }
    }
  }
};
</script>

<style scoped>
.panier {
  max-width: 700px;
  margin: auto;
}

.cart-item {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 15px;
  border-bottom: 1px solid #ddd;
  padding-bottom: 10px;
}

.info {
  flex: 1;
}

.total {
  margin-top: 20px;
}

.pay-btn {
  margin-top: 20px;
  padding: 12px 25px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
}

.pay-btn:hover {
  background-color: #369870;
}
</style>
