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
      if (this.cart.length === 0) {
        alert("Panier vide");
        return;
      }

      try {
        // 🔹 Simulation console pour vérifier ce qu'on envoie
        console.log("Envoi au backend :", this.cart);

        const response = await fetch(
          "https://stripe-backend-production-2ac4
