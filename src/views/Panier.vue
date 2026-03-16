<template>
  <div class="p-4 max-w-3xl mx-auto">

    <h2 class="text-xl font-bold mb-4">🛒 Mon Panier</h2>

    <div v-if="cart.length === 0">
      <p class="text-gray-500">Votre panier est vide.</p>
    </div>

    <div v-else>
      <div
        v-for="item in cart"
        :key="item.cartId"
        class="flex items-center mb-4 border-b pb-2"
      >
        <img
          :src="item.images?.[0] || '/placeholder.png'"
          :alt="item.nom"
          class="w-20 h-20 object-cover rounded mr-4"
        />

        <div class="flex-1">
          <h3 class="font-semibold">{{ item.nom }}</h3>

          <p v-if="item.taille">📏 Taille : {{ item.taille }}</p>
          <p v-if="item.couleur">🎨 Couleur : {{ item.couleur }}</p>

          <p class="font-bold">{{ item.prix }} €</p>

          <input
            type="number"
            min="1"
            v-model.number="item.quantity"
            @change="updateQuantity(item)"
            class="border w-20 p-1 mt-1"
          />
        </div>

        <button
          @click="remove(item.cartId)"
          class="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded"
        >
          ❌
        </button>
      </div>

      <h3 class="text-lg font-bold mt-4">
        Total : {{ total }} €
      </h3>

    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  computed: {
    ...mapState(["cart"]),

    total() {
      return this.cart
        .reduce((sum, item) => sum + item.prix * item.quantity, 0)
        .toFixed(2);
    }
  },

  methods: {
    remove(cartId) {
      this.$store.dispatch("removeItem", cartId);
    },

    updateQuantity(item) {
      this.$store.dispatch("updateQuantity", {
        cartId: item.cartId,
        quantity: item.quantity
      });
    }
  }
};
</script>
