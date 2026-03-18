<template>
  <section class="w-full px-4 py-6">
    <h2 class="text-2xl font-bold mb-4">Produits Printful</h2>

    <div v-if="products.length" class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4 w-full">
      <div
        v-for="product in products"
        :key="product.id"
        class="border rounded-lg p-4 bg-white shadow flex flex-col hover:shadow-xl transition transform hover:-translate-y-1"
      >
        <img :src="product.image" alt="product.name" class="h-32 w-full object-cover rounded mb-2" />
        <h3 class="font-semibold text-sm mb-1 truncate">{{ product.name }}</h3>
        <p class="text-green-600 font-bold mb-2 text-sm">{{ product.price }} $</p>
        <button @click="$emit('add-to-cart', product)"
          class="mt-auto bg-green-600 text-white py-1.5 rounded text-sm hover:bg-green-700 transition">
          Ajouter au panier
        </button>
      </div>
    </div>

    <p v-else class="text-gray-500">Aucun produit disponible pour le moment.</p>
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
        // Sécuriser : ne traiter que si c’est un tableau
        products.value = Array.isArray(res.data)
          ? res.data.map(p => ({
              id: p.id,
              name: p.name,
              image: p.image || "https://via.placeholder.com/150",
              price: p.price || 0
            }))
          : [];
      } catch (error) {
        console.error("Erreur Printful:", error);
        products.value = [];
      }
    };

    onMounted(fetchProducts);

    return { products };
  }
};
</script>
