<!-- src/views/PrintfulProducts.vue -->
<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">Produits Printful</h1>

    <div v-if="loading" class="text-center">Chargement des produits...</div>
    <div v-else-if="products.length === 0" class="text-center">Aucun produit disponible.</div>

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      <div
        v-for="product in products"
        :key="product.id"
        class="border rounded-lg p-4 shadow hover:shadow-lg transition"
      >
        <img
          v-if="product.thumbnail"
          :src="product.thumbnail"
          :alt="product.name"
          class="w-full h-48 object-cover mb-2 rounded"
        />
        <div v-else class="w-full h-48 bg-gray-200 mb-2 rounded flex items-center justify-center text-gray-500">
          Pas d'image
        </div>
        <h2 class="font-semibold text-lg mb-1">{{ product.name }}</h2>
        <p class="text-gray-600 mb-2">{{ product.description }}</p>
        <p class="font-bold text-gray-800">{{ formatPrice(product.price) }}</p>
      </div>
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
      loading: true,
    };
  },
  methods: {
    async fetchProducts() {
      this.loading = true;
      try {
        const response = await axios.get("https://printfulapi-production.up.railway.app/printful/products");
        this.products = response.data.products || [];
      } catch (err) {
        console.error("Erreur fetching products:", err);
        this.products = [];
      } finally {
        this.loading = false;
      }
    },
    formatPrice(price) {
      if (!price) return "0 €";
      return parseFloat(price).toFixed(2) + " €";
    },
  },
  mounted() {
    this.fetchProducts();
  },
};
</script>

<style scoped>
.container {
  max-width: 1200px;
}
</style>
