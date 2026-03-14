<!-- src/views/PrintfulProducts.vue -->
<template>
  <div class="printful-products p-4">
    <h1 class="text-2xl font-bold mb-4">Produits Printful</h1>

    <div v-if="loading" class="text-gray-500">Chargement des produits...</div>
    <div v-else-if="products.length === 0" class="text-red-500">Aucun produit trouvé.</div>

    <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div
        v-for="product in products"
        :key="product.id"
        class="border rounded-lg p-4 flex flex-col items-center shadow-sm"
      >
        <img
          v-if="product.thumbnail"
          :src="product.thumbnail"
          :alt="product.name"
          class="w-full h-48 object-cover mb-4 rounded"
        />
        <div v-else class="w-full h-48 bg-gray-200 flex items-center justify-center mb-4">
          Image non disponible
        </div>

        <h2 class="text-lg font-semibold mb-2 text-center">{{ product.name }}</h2>
        <p class="text-gray-600 mb-2 text-center">{{ product.description }}</p>
        <p class="font-bold text-center">{{ formatPrice(product.price) }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

const products = ref([]);
const loading = ref(true);

// Fonction pour formater le prix en €
function formatPrice(price) {
  if (!price || price === 0) return "0 €";
  return `${price} €`;
}

async function fetchProducts() {
  loading.value = true;
  try {
    const response = await axios.get(
      "https://printfulapi-production.up.railway.app/printful/products"
    );
    products.value = response.data.products || [];
  } catch (err) {
    console.error("Erreur fetching Printful products:", err.message);
    products.value = [];
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  fetchProducts();
});
</script>

<style scoped>

.printful-products img{
  width:100%;
  height:250px;
  object-fit:contain;
  background:#f8f8f8;
  border-radius:8px;
  transition: transform 0.2s;
}

.printful-products img:hover{
  transform:scale(1.05);
}

</style>
