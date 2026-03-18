<template>
  <section class="w-full">
    <h2 class="text-2xl font-bold mb-4">Produits Printful</h2>

    <div v-if="products.length" class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4 w-full"
      
      <div v-for="product in products" :key="product.id" class="border rounded-lg p-4 bg-white shadow flex flex-col">
        
        <!-- Image -->
        <img :src="product.image" class="h-40 w-full object-cover rounded mb-3" />

        <!-- Nom -->
        <h3 class="font-semibold text-lg mb-1">{{ product.name }}</h3>

        <!-- Prix -->
        <p class="text-green-600 font-bold mb-3">{{ product.price }} $</p>

        <!-- Ajouter au panier -->
        <button
          @click="$emit('add-to-cart', product)"
          class="mt-auto bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          Ajouter au panier
        </button>

      </div>
    </div>

    <p v-else>Aucun produit disponible pour le moment.</p>
  </section>
</template>

<script>
import { ref, onMounted } from "vue";
import axios from "axios";

export default {
  props: ["apiUrl"],
  setup(props) {
    const products = ref([]);

    const fetchProducts = async () => {
      try {
        const res = await axios.get(props.apiUrl);
        // Adapter selon la structure de ton API
        products.value = res.data.map(p => ({
          id: p.id,
          name: p.name,
          image: p.image || p.thumbnail,
          price: p.price
        }));
      } catch (error) {
        console.error("Erreur Printful:", error);
      }
    };

    onMounted(fetchProducts);

    return { products };
  }
};
</script>

<style scoped>
/* Petite animation au hover */
div > div:hover {
  transform: translateY(-3px);
  transition: all 0.2s;
}
</style>
