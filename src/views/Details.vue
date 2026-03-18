<template>
  <div class="w-full px-4 mt-6">
    <h2 class="text-2xl font-bold mb-4">Catégorie : {{ categoryName }}</h2>

    <div v-if="products.length" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      <div
        v-for="produit in products"
        :key="produit.id"
        class="border rounded-lg p-4 bg-white shadow flex flex-col"
      >
        <img :src="produit.images[0]" class="h-40 w-full object-cover rounded mb-3" />
        <h3 class="font-bold text-lg">{{ produit.nom }}</h3>
        <p class="text-gray-600 text-sm mb-2">{{ produit.description }}</p>
        <p class="text-green-600 font-bold text-lg mb-3">{{ produit.prix }} $</p>
        <button
          @click="addToCart(produit)"
          class="mt-auto bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          Ajouter au panier
        </button>
      </div>
    </div>

    <div v-else class="text-gray-500">Aucun produit disponible pour cette catégorie.</div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";

export default {
  name: "Details",
  setup() {
    const route = useRoute();
    const store = useStore();
    const categorySlug = route.params.slug;
    const categoryName = ref(categorySlug);
    const products = ref([]);

    const fetchProducts = async () => {
      const q = query(collection(db, "products"), where("categorie", "==", categorySlug));
      const snapshot = await getDocs(q);
      snapshot.forEach((doc) => {
        products.value.push({ id: doc.id, ...doc.data() });
      });
    };

    const addToCart = (produit) => {
      store.dispatch("addToCart", produit);
      alert(`Produit "${produit.nom}" ajouté au panier !`);
    };

    onMounted(fetchProducts);

    return { products, categoryName, addToCart };
  },
};
</script>

<style scoped>
/* Styles optionnels */
</style>
