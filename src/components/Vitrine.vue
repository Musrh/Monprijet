<template>
  <section class="vitrine my-8">
    <h2 class="text-2xl font-bold mb-4 text-center">Vitrine</h2>
    
    <div v-if="produits.length" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      <div
        v-for="p in produits"
        :key="p.id"
        class="border rounded shadow p-4 text-center relative"
      >
        <!-- Étiquette Promo -->
        <span
          v-if="p.promo"
          class="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs"
        >
          PROMO
        </span>

        <img
          :src="p.images?.[0] || '/placeholder.png'"
          :alt="p.nom"
          class="w-full h-48 object-cover rounded mb-2"
        />

        <h3 class="font-semibold">{{ p.nom }}</h3>
        
        <!-- Prix réduit si promo -->
        <p class="text-green-600 font-bold">
          {{ p.promo ? Math.round(p.prix * 0.5) : p.prix }} €
        </p>

        <button
          @click="ajouterAuPanier(p)"
          class="mt-2 bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
        >
          Ajouter au panier
        </button>
      </div>
    </div>

    <div v-else class="text-gray-500 text-center">
      Aucun produit à afficher.
    </div>
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

    // 🔹 Ajouter au panier avec message alert
    const ajouterAuPanier = (produit) => {
      store.dispatch("addToCart", {
        id: produit.id,
        nom: produit.nom,
        prix: produit.prix,
        images: produit.images,
        quantity: 1,
      });

      // Message d'alerte que l'utilisateur doit fermer
      alert(`Le produit "${produit.nom}" a été ajouté à votre panier !`);
    };

    // 🔹 Récupération des produits depuis Firestore
    const fetchProduits = async () => {
      const snapshot = await getDocs(collection(db, "products"));
      snapshot.forEach((doc) => {
        produits.value.push({ id: doc.id, ...doc.data() });
      });
    };

    onMounted(() => {
      fetchProduits();
    });

    return {
      produits,
      ajouterAuPanier,
    };
  },
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
