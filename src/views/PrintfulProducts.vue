<!-- PrintfulProducts.vue -->
<template>
  <div class="printful-products p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    <div
      v-for="product in products"
      :key="product.id"
      class="border rounded-lg p-4 flex flex-col items-center shadow hover:shadow-lg transition"
    >
      <!-- Image mockup -->
      <img
        v-if="product.thumbnail"
        :src="product.thumbnail"
        :alt="product.name"
        class="w-full h-64 object-contain mb-4"
      />
      <div v-else class="w-full h-64 bg-gray-100 flex items-center justify-center mb-4">
        <span class="text-gray-400">Pas d'image</span>
      </div>

      <!-- Nom -->
      <h2 class="font-bold text-lg text-center">{{ product.name }}</h2>

      <!-- Description -->
      <p class="text-gray-600 text-sm text-center mt-2">
        {{ product.description }}
      </p>

      <!-- Prix -->
      <p class="mt-3 font-semibold text-green-600">
        {{ product.price }} €
      </p>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "PrintfulProducts",
  data() {
    return {
      products: [],
    };
  },
  mounted() {
    this.fetchProducts();
  },
  methods: {
    async fetchProducts() {
      try {
        const response = await axios.get(
          "https://printfulapi-production.up.railway.app/printful/products"
        );
        this.products = response.data.products || [];
      } catch (err) {
        console.error("Erreur récupération produits Printful:", err);
      }
    },
  },
};
</script>

<style scoped>
.printful-products img {
  transition: transform 0.2s;
}
.printful-products img:hover {
  transform: scale(1.05);
}
</style>
