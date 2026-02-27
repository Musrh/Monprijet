<template>
  <div class="p-6 max-w-3xl mx-auto">
    <h2 class="text-2xl font-bold mb-4">🛒 Mon Panier</h2>

    <div v-if="cart.length === 0">
      <p>Votre panier est vide.</p>
    </div>

    <div v-else>
      <div v-for="item in cart" :key="item.id" class="flex items-center gap-4 mb-4 bg-white p-4 rounded-xl shadow">
        <img :src="item.image" width="80" />
        <div class="flex-1">
          <h3 class="font-semibold">{{ item.nom }}</h3>
          <p>{{ item.prix }} €</p>
          <input type="number" min="1" v-model.number="item.quantity" @change="updateQuantity(item)" class="border rounded px-2 py-1 w-20"/>
        </div>
        <button @click="remove(item.id)" class="text-red-600 font-bold">❌</button>
      </div>

      <h3 class="text-xl font-bold mt-4">Total : {{ total }} €</h3>
      <button class="bg-green-500 text-white px-6 py-2 rounded-lg mt-4 hover:bg-green-700" @click="payer">
        💳 Payer
      </button>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  computed: {
    ...mapState(['cart']),
    total() {
      return this.cart.reduce((sum, item) => sum + item.prix * item.quantity, 0);
    }
  },
  methods: {
    remove(id) { this.$store.dispatch("removeItem", id); },
    updateQuantity(item) { this.$store.dispatch("updateQuantity", { id: item.id, quantity: item.quantity }); },
    payer() { alert("Paiement simulé pour le test"); }
  }
}
</script>
