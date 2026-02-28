<template>
  <div class="p-4 max-w-5xl mx-auto">
    <h1 class="text-2xl font-bold mb-6">Nos Produits</h1>

    <div v-if="loading" class="text-gray-500">Chargement des produits...</div>
    <div v-else-if="products.length === 0" class="text-gray-500">Aucun produit trouvé.</div>

    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      <div v-for="prod in products" :key="prod.id" class="border rounded p-4 bg-white shadow">
        <img
          v-if="prod.image"
          :src="prod.image"
          :alt="prod.nom"
          class="w-full h-48 object-cover rounded mb-2"
        />
        <h2 class="text-lg font-semibold">{{ prod.nom }}</h2>
        <p class="text-gray-700 mb-2">{{ prod.prix }} €</p>
        <button
          @click="addToCart(prod)"
          class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
        >
          Ajouter au panier
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import { useStore } from "vuex";

const products = ref([]);
const loading = ref(true);
const store = useStore();

const fetchProducts = async () => {
  loading.value = true;
  try {
    const snapshot = await getDocs(collection(db, "products")); // 🔹 Nom exact de ta collection
    products.value = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (err) {
    console.error("Erreur fetch products:", err);
  } finally {
    loading.value = false;
  }
};

const addToCart = (prod) => {
  store.dispatch("addItem", { ...prod, quantity: 1 });
  alert(`Produit ajouté au panier : ${prod.nom}`);
};

onMounted(() => {
  fetchProducts();
});
</script>
