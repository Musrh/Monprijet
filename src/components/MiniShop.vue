<template>
  <div class="minishop p-4">
    <h2 class="text-2xl font-bold mb-4">Mini Shop - Produits Externes</h2>

    <div v-if="produits.length === 0" class="text-gray-500">
      Aucun produit externe pour l'instant.
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      <div
        v-for="p in produits"
        :key="p.itemId"
        class="border rounded p-2 flex flex-col items-center shadow hover:shadow-lg transition"
      >
        <img
          v-if="p.images && p.images.length"
          :src="p.images[0]"
          :alt="p.title"
          class="w-full h-40 object-cover rounded"
        />
        <h3 class="mt-2 font-semibold text-center">{{ p.title }}</h3>
        <p class="text-lg font-bold mt-1">{{ p.price }} €</p>
        <button
          @click="ajouterAuPanier(p)"
          class="mt-2 bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
        >
          Ajouter au panier
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { collection, getDocs } from "firebase/firestore";
import { useStore } from "vuex";
import { db } from "../firebase";

export default {
  setup() {
    const store = useStore();
    const produits = ref([]);

    // 🔹 Charger les produits externes
    const fetchProduitsExternes = async () => {
      const snapshot = await getDocs(collection(db, "ProductsExternes"));
      produits.value = snapshot.docs.map((doc) => doc.data());
    };

    // 🔹 Ajouter au panier
    const ajouterAuPanier = (produit) => {
      store.dispatch("addToCart", {
        id: produit.itemId,
        nom: produit.title,
        image: produit.images[0],
        prix: produit.price,
        quantity: 1,
      });

      // 🔹 Notification simple
      alert(`✅ Produit "${produit.title}" ajouté au panier !`);
    };

    onMounted(fetchProduitsExternes);

    return {
      produits,
      ajouterAuPanier,
    };
  },
};
</script>

<style scoped>
.minishop img {
  display: block;
}
</style>
