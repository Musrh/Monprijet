<template>
  <div class="panier">
    <h2>🛒 Mon Panier</h2>

    <div v-if="cart.length === 0">
      <p>Votre panier est vide.</p>
    </div>

    <div v-else>
      <div v-for="item in cart" :key="item.id" class="cart-item">
        <img :src="item.image" width="80"/>
        <div class="info">
          <h3>{{ item.nom }}</h3>
          <p>{{ item.prix }} €</p>
          <input type="number" min="1" v-model.number="item.quantity" @change="updateQuantity(item)"/>
        </div>
        <button @click="remove(item.id)">❌</button>
      </div>

      <h3 class="total">Total : {{ total }} €</h3>

      <button class="pay-btn" @click="payer">💳 Payer</button>
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
      this.$store.dispatch("updateQuantity", { id: item.id, quantity: item.quantity }); 
    },

    async payer() {
      console.log("CLICK PAYER");
      console.log("USER =", this.$store.state.user);
      console.log("CART =", this.cart);

      if (!this.$store.state.user) {
        alert("Veuillez vous connecter avant de payer");
        this.$router.push("/login");
        return;
      }

      if (!this.cart.length) {
        alert("Panier vide");
        return;
      }

      try {
        const response = await fetch(
          "https://stripe-backend-production-2ac4.up.railway.app/create-checkout-session",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ items: this.cart })
          }
        );

        console.log("RESPONSE STATUS =", response.status);
        const data = await response.json();
