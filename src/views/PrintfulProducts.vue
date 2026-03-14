<template>
  <div class="max-w-6xl mx-auto py-6">
    <h1 class="text-3xl font-bold mb-6">Produits Printful</h1>
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      <div v-for="product in products" :key="product.id" class="border p-4 rounded shadow">
        <img :src="product.sync_variants[0].files[0]?.preview_url || ''" class="w-full h-48 object-cover rounded mb-2" />
        <h2 class="font-bold">{{ product.name }}</h2>
        <p class="text-green-600 font-semibold">{{ product.sync_variants[0].retail_price }} $</p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";

export default {
  setup() {
    const products = ref([]);

    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products"); // notre backend Node.js
        const data = await res.json();
        products.value = data.result || [];
      } catch (err) {
        console.error("Erreur :", err);
      }
    };

    onMounted(fetchProducts);

    return { products };
  },
};
</script>
