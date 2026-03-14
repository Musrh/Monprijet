<template>
  <div class="printful-products p-4">
    <h1 class="text-2xl font-bold mb-4">Produits Printful</h1>

    <div v-if="loading" class="text-gray-500">Chargement des produits...</div>
    <div v-if="error" class="text-red-500">{{ error }}</div>

    <div v-if="products.length" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      <div
        v-for="product in products"
        :key="product.id"
        class="border rounded-lg overflow-hidden shadow hover:shadow-lg transition"
      >
        <img
          v-if="product.thumbnail"
          :src="product.thumbnail"
          :alt="product.name"
          class="w-full h-48 object-cover"
        />
        <div v-else class="w-full h-48 bg-gray-200 flex items-center justify-center">
          <span class="text-gray-400">Pas d'image</span>
        </div>

        <div class="p-4">
          <h2 class="font-semibold text-lg mb-2">{{ product.name }}</h2>
          <p class="text-gray-600 mb-2">{{ product.description }}</p>
          <p class="font-bold">{{ formatPrice(product.price) }}</p>
        </div>
      </div>
    </div>

    <div v-else class="text-gray-500 mt-4">Aucun produit disponible.</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

const products = ref([]);
const loading = ref(true);
const error = ref(null);

const fetchProducts = async () => {
  loading.value = true;
  error.value = null;

  try {
    // ⚡ Remplace par ton URL backend
    const response = await axios.get("https://printfulapi-production.up.railway.app/printful/products");
    products.value = response.data.products || [];
  } catch (err) {
    console.error("Erreur fetching products:", err);
    error.value = "Impossible de charger les produits.";
  } finally {
    loading.value = false;
  }
};

// Formater le prix en € ou "0 €" si null
const formatPrice = (price) => {
  if (!price || isNaN(price)) return "0 €";
  return parseFloat(price).toLocaleString("fr-FR", {
    style: "currency",
    currency: "EUR",
  });
};

onMounted(fetchProducts);
</script>

<style scoped>
.printful-products img {
  object-fit: cover;
}
</style>
