<template>
  <div class="max-w-4xl mx-auto p-6">
    <h1 class="text-3xl font-bold mb-8">🛒 Mon Panier</h1>

    <div v-if="cart.length === 0" class="text-gray-600">
      Votre panier est vide.
    </div>

    <div v-else>
      <div
        v-for="item in cart"
        :key="item.id"
        class="bg-white rounded-2xl shadow p-5 mb-6 flex flex-col md:flex-row items-center gap-6"
      >
        <!-- Image -->
        <img
          :src="item.image"
          class="w-24 h-24 object-cover rounded-xl"
        />

        <!-- Infos -->
        <div class="flex-1">
          <h2 class="text-lg font-semibold">{{ item.nom }}</h2>
          <p class="text-gray-600">{{ item.prix }} €</p>

          <!-- Quantité -->
          <div class="mt-3 flex items-center gap-2">
            <label>Qté :</label>
            <input
              type="number"
              min="1"
              v-model.number="item.quantity"
              @change="updateQuantity(item)"
              class="border rounded px-2 py-1 w-20"
            />
          </div>
        </div>

        <!-- Supprimer -->
        <button
          @click="remove(item.id)"
          class="text-red-500 font-semibold hover:text-red-700"
        >
          Supprimer
        </button>
      </div>

      <!-- Total -->
      <div class="text-right mt-8">
        <h2 class="text-2xl font-bold">
          Total : {{ total }} €
        </h2>

        <router-link
          to="/success"
          class="inline-block mt-4 bg-green-500 text-white px-8 py-3 rounded-xl hover:bg-green-600 transition"
        >
          💳 Payer
        </router-link>
      </div>
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
      this.$store.dispatch("updateQuantity", {
        id: item.id,
        quantity: item.quantity
      });
    }
  }
};
</script>
