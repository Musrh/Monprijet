<template>
  <div class="w-full mt-6">
    <h2 class="text-2xl font-bold mb-4">Produits Printful</h2>

    <!-- Loader -->
    <div v-if="loading" class="text-center text-gray-500">Chargement...</div>

    <!-- Aucun produit -->
    <div v-else-if="products.length === 0" class="text-center text-gray-500">
      Aucun produit trouvé.
    </div>

    <!-- Produits -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      <div
        v-for="product in products"
        :key="product.id"
        class="border rounded-lg p-4 bg-white shadow flex flex-col"
      >
        <!-- Image -->
        <img
          v-if="product.thumbnail_url"
          :src="product.thumbnail_url"
          :alt="product.name"
          class="h-40 w-full object-cover rounded mb-3"
        />

        <!-- Nom -->
        <h3 class="font-bold text-lg mb-1">{{ product.name }}</h3>

        <!-- Description -->
        <p class="text-gray-600 text-sm mb-2">
          {{ product.description || "Pas de description" }}
        </p>

        <!-- Prix -->
        <p class="text-green-600 font-bold text-lg mb-3">
          {{ formatPrice(product.retail_price) }}
        </p>

        <!-- Ajouter au panier -->
        <button
          @click="$emit('add-to-cart', product)"
          class="mt-auto bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Ajouter au panier
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";

export default {
  name: "PrintfulProducts",
  props: {
    apiUrl: {
      type: String,
      required: true, // URL de ton backend Railway
    },
  },
  setup(props, { emit }) {
    const products = ref([]);
    const loading = ref(true);

    const fetchProducts = async () => {
      try {
        const res = await fetch(`${props.apiUrl}/printful/products`);
        const data = await res.json();

        // Vérifie si data.result existe
        products.value = data.result || [];
      } catch (err) {
        console.error("Erreur fetching Printful products:", err);
      } finally {
        loading.value = false;
      }
    };

    const formatPrice = (price) => {
      if (!price) return "-";
      return price.includes("USD") ? price : price + " $";
    };

    onMounted(fetchProducts);

    return { products, loading, formatPrice };
  },
};
</script>

<style scoped>
/* Hover léger sur les images */
img {
  transition: transform 0.2s;
}
img:hover {
  transform: scale(1.05);
}
</style>
