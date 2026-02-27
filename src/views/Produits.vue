<template>
  <div class="max-w-6xl mx-auto p-6">
    <h1 class="text-3xl font-bold mb-8 text-center">
      🛍️ Nos Produits
    </h1>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      <div
        v-for="produit in produits"
        :key="produit.id"
        class="bg-white rounded-2xl shadow-md hover:shadow-xl transition p-5 flex flex-col"
      >
        <!-- Image -->
        <img
          :src="produit.image"
          class="rounded-xl mb-4 object-cover h-48 w-full"
        />

        <!-- Infos -->
        <h2 class="text-xl font-semibold mb-2">
          {{ produit.nom }}
        </h2>

        <p class="text-gray-600 mb-4 flex-grow">
          {{ produit.description }}
        </p>

        <!-- Prix + bouton -->
        <div class="flex justify-between items-center mt-4">
          <span class="text-lg font-bold text-green-600">
            {{ produit.prix }} €
          </span>

          <button
            @click="addToCart(produit)"
            class="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
          >
            Ajouter
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  computed: {
    ...mapState(["produits"]) // 🔹 utilise tes produits du store
  },
  methods: {
    addToCart(produit) {
      this.$store.dispatch("addToCart", produit);
    }
  }
};
</script>
