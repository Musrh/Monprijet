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
        <button @click="remove(item.id)">❌</button>
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
      if (this.cart.length === 0) {
        alert("Panier vide");
        return;
      }

      try {
        // 🔹 Envoi du panier au backend
        const response = await fetch("http://localhost:3000/create-checkout-session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ items: this.cart }) // ⚠️ must be 'items'
        });

        const data = await response.json();
        console.log("Réponse backend :", data);

        if (data.url) {
          // 🔹 Redirection vers Stripe Checkout
          window.location.href = data.url;
        } else {
          alert(data.error || "Erreur Stripe");
        }
      } catch (err) {
        console.error(err);
        alert("Impossible de lancer le paiement");
      }
    }
  }
};
</script>

<style scoped>
.cart-item { display:flex; gap:15px; margin-bottom:10px; border-bottom:1px solid #ddd; padding-bottom:10px;}
.info{flex:1;}
.pay-btn{margin-top:20px; padding:12px 25px; background-color:#42b983; color:white; border:none; border-radius:6px; cursor:pointer;}
.pay-btn:hover{background-color:#369870;}
</style>
