<template>
  <section class="vitrine my-8">
    <h2 class="text-2xl font-bold mb-4 text-left">Vitrine</h2>
    
    <div v-if="produits.length" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      <div
        v-for="p in produits"
        :key="p.id"
        class="border rounded shadow p-4 text-center relative"
      >
        <img :src="p.images?.[0] || '/placeholder.png'" :alt="p.nom" class="w-full h-48 object-cover rounded mb-2" />

        <h3 class="font-semibold text-left">{{ p.nom }}</h3>

        <!-- Prix et promo -->
        <div class="text-left">
          <span v-if="p.promo" class="text-gray-400 line-through mr-2">
            {{ p.prix }} €
          </span>
          <span class="text-green-600 font-bold">
            {{ p.promo ? calculatePromoPrice(p.prix) : p.prix }} €
          </span>
        </div>

        <!-- Bouton Ajouter au panier -->
        <button
          @click="ajouterAuPanier(p)"
          class="mt-2 bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
        >
          Ajouter au panier
        </button>

        <!-- Étiquette promo -->
        <span
          v-if="p.promo"
          class="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded"
        >
          PROMO
        </span>
      </div>
    </div>

    <div v-else class="text-gray-500 text-center">Aucun produit à afficher.</div>
  </section>
</template>

<script>
import { ref, onMounted } from "vue";
import { collection, getDocs } from "firebase/firestore";
import { useStore } from "vuex";
import { db } from "../firebase";

export default {
  name: "Vitrine",
  setup() {
    const store = useStore();
    const produits = ref([]);

    const ajouterAuPanier = (produit) => {
      store.dispatch("addToCart", {
        ...produit,
        image: produit.images,
        quantity: 1
      });
      alert(`Produit "${produit.nom}" ajouté au panier !`);
    };

    const fetchProduits = async () => {
      const snapshot = await getDocs(collection(db, "products"));
      snapshot.forEach((doc) => {
        produits.value.push({ id: doc.id, ...doc.data() });
      });
    };

    // Calcule le prix réduit pour les promos
    const calculatePromoPrice = (prix) => {
      return Math.round(prix * 0.5); // réduction 50%
    };

    onMounted(() => {
      fetchProduits();
    });

    return {
      produits,
      ajouterAuPanier,
      calculatePromoPrice
    };
  }
};
</script>

<style scoped>
.vitrine img {
  display: block;
  width: 100%;
  object-fit: cover;
}

.vitrine button {
  transition: background-color 0.2s;
}
</style>
