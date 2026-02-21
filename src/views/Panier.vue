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
          <input type="number" min="1" v-model.number="item.quantity" @change="updateQuantity(item)" />
        </div>
        <button @click="remove(item.id)">❌</button>
      </div>

      <h3>Total : {{ total }} €</h3>
      <button class="pay-btn" @click="payer">💳 Payer</button>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";

export default {
  computed: {
    ...mapState(["cart"]),
    ...mapGetters(["cartTotal"]),
    total() {
      return this.cartTotal;
    },
  },
  methods: {
    remove(id) {
      this.$store.dispatch("removeItem", id);
    },
    updateQuantity(item) {
      if (item.quantity < 1) item.quantity = 1;
      this.$store.dispatch("updateQuantity", { id: item.id, quantity: item.quantity });
    },
    payer() {
      if (this.cart.length === 0) {
        alert("Panier vide");
        return;
      }
      alert("Simuler paiement → console.log du panier");
      console.log("Panier actuel :", this.cart);
    },
  },
};
</script>

<style scoped>
.panier { max-width: 700px; margin: auto; }
.cart-item { display: flex; align-items: center; gap: 15px; margin-bottom: 15px; border-bottom: 1px solid #ddd; padding-bottom: 10px; }
.info { flex: 1; }
.pay-btn { margin-top: 20px; padding: 12px 25px; background-color: #42b983; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 16px; }
.pay-btn:hover { background-color: #369870; }
</style>
