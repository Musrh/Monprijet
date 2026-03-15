<template>
  <div class="printful-products p-4 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
    <div v-for="product in products" :key="product.id" class="border rounded-lg p-4 shadow-md">
      <!-- Image principale -->
      <img
        :src="product.thumbnail || fallbackImage"
        :alt="product.name"
        class="w-full h-64 object-contain mb-4 rounded"
      />

      <!-- Nom -->
      <h2 class="text-xl font-bold mb-2">{{ product.name }}</h2>

      <!-- Description -->
      <p class="text-gray-600 mb-2">{{ product.description }}</p>

      <!-- Variantes -->
      <div v-if="product.variants && product.variants.length" class="mb-2">
        <p class="font-semibold">Variantes :</p>
        <ul>
          <li
            v-for="variant in product.variants"
            :key="variant.id"
            class="mb-1"
          >
            🎨 {{ variant.color }} | 📏 {{ variant.size }} | 💰 {{ variant.price }} €
            <br />
            <img
              v-if="variant.thumbnail"
              :src="variant.thumbnail"
              :alt="variant.color + ' ' + variant.size"
              class="w-32 h-32 object-contain mt-1 border rounded"
            />
          </li>
        </ul>
      </div>

      <!-- Fallback si aucune variante -->
      <div v-else>
        💰 {{ product.price }} €
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
      fallbackImage: "https://via.placeholder.com/300x300?text=No+Image",
    };
  },
  async created() {
    try {
      const res = await axios.get("https://printfulapi-production.up.railway.app/printful/products");
      this.products = res.data.products || [];
    } catch (err) {
      console.error("Erreur récupération produits:", err);
    }
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
