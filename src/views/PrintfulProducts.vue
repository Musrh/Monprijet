<template>
  <div class="printful-slider overflow-x-auto py-2">
    <div class="flex gap-4 flex-wrap">
      <div
        v-for="product in products"
        :key="product.id"
        class="product-card flex-shrink-0 w-[220px]"
      >
        <!-- Image principale -->
        <img
          v-if="product.thumbnail"
          :src="product.thumbnail"
          :alt="product.name"
          class="w-full h-40 object-cover rounded mb-2"
        />
        <h3 class="font-bold text-lg">{{ product.name }}</h3>
        <p class="text-gray-600 text-sm mb-1">{{ product.description }}</p>
        <p class="text-green-600 font-bold mb-2">{{ product.price }} €</p>

        <!-- Tailles -->
        <div v-if="product.availableSizes.length" class="flex flex-wrap gap-1 mb-1">
          <span
            v-for="size in product.availableSizes"
            :key="size"
            class="px-2 py-1 border rounded bg-gray-100 text-xs"
          >
            {{ size }}
          </span>
        </div>

        <!-- Couleurs -->
        <div v-if="product.availableColors.length" class="flex flex-wrap gap-1 mb-2">
          <span
            v-for="color in product.availableColors"
            :key="color"
            class="px-2 py-1 border rounded bg-gray-100 text-xs"
          >
            {{ color }}
          </span>
        </div>

        <!-- Ajouter au panier -->
        <button
          @click="$emit('add-to-cart', product)"
          class="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          Ajouter au panier
        </button>
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
    };
  },
  async mounted() {
    try {
      const res = await axios.get(
        "https://printfulapi-production.up.railway.app/printful/products"
      );
      this.products = res.data.products || [];
    } catch (err) {
      console.error("Erreur fetching Printful products:", err);
    }
  },
};
</script>

<style scoped>
.printful-slider {
  display: flex;
  overflow-x: auto;
  gap: 1rem;
}

.product-card {
  display: flex;
  flex-direction: column;
}
</style>
