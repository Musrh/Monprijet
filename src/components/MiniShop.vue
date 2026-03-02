<template>
  <div class="mini-shop p-4">
    <h2 class="text-2xl font-bold mb-4">Mini Shop - Produits Externes</h2>

    <div v-if="produitsExternes.length" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      <div v-for="p in produitsExternes" :key="p.id" class="border rounded shadow p-4 flex flex-col items-center">
        <img :src="p.images" :alt="p.nom" class="w-full h-48 object-cover rounded" />
        <h3 class="font-semibold mt-2">{{ p.nom }}</h3>
        <p class="mt-1 text-lg font-bold">{{ p.prix }} €</p>
        <a :href="p.url" target="_blank" class="mt-1 text-sm text-blue-600 underline">Voir sur AliExpress</a>
        <button
          @click="ajouterAuPanier(p)"
          class="mt-2 bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
        >
          Ajouter au panier
        </button>
      </div>
    </div>

    <div v-else class="text-gray-500">Aucun produit externe pour l'instant.</div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { useStore } from "vuex";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

export default {
  name: "MiniShop",
  setup() {
    const store = useStore();
    const produitsExternes = ref([]);

    // 🔹 Ajouter au panier
    const ajouterAuPanier = (produit) => {
      store.dispatch("addToCart", {
        ...produit,
        image: produit.images,
        quantity: 1
      });
    };

    // 🔹 Charger produits externes depuis Firestore
    const fetchProduitsExternes = async () => {
      const snapshot = await getDocs(collection(db, "ProductsExternes"));
      produitsExternes.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    };

    onMounted(async () => {
      await fetchProduitsExternes();
    });

    return {
      produitsExternes,
      ajouterAuPanier
    };
  }
};
</script>

<style scoped>
.mini-shop img {
  display: block;
}
</style>
