<template>
  <section class="vitrine  px-4">

    <h2 class="text-2xl font-bold  text-left">Vitrine</h2>

    <div v-if="produits.length" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

      <div
        v-for="p in produits"
        :key="p.id"
        class="border rounded shadow p-4 text-center relative bg-white hover:shadow-lg transition"
      >

        <!-- Badge promo -->
        <span
          v-if="p.promo"
          class="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 text-xs rounded"
        >
          PROMO 50%
        </span>

        <!-- Image produit -->
        <img
          :src="p.images?.[0] || '/placeholder.png'"
          :alt="p.nom"
          class="w-full h-48 object-cover rounded mb-2"
        />

        <!-- Nom produit -->
        <h3 class="font-semibold mb-1">{{ p.nom }}</h3>

        <!-- Prix -->
        <div class="mb-2">
          <span v-if="p.promo" class="text-gray-400 line-through mr-2 text-sm">
            {{ p.prix }} €
          </span>
          <span class="text-green-600 font-bold">
            {{ p.promo ? prixPromo(p.prix) : p.prix }} €
          </span>
        </div>

        <!-- Économie -->
        <div v-if="p.promo" class="text-red-500 text-sm mb-2">
          Économisez {{ p.prix - prixPromo(p.prix) }} €
        </div>

        <!-- Ajouter au panier -->
        <button
          @click="ajouterAuPanier(p)"
          class="mt-2 bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
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

    const prixPromo = (prix) => Math.round(prix * 0.5);

    const ajouterAuPanier = (produit) => {
      const prixFinal = produit.promo ? prixPromo(produit.prix) : produit.prix;

      store.dispatch("addToCart", {
        id: produit.id,
        nom: produit.nom,
        prix: prixFinal,
        images: produit.images,
        quantity: 1,
      });

      alert(`Le produit "${produit.nom}" a été ajouté à votre panier !`);
    };

    const fetchProduits = async () => {
      const snapshot = await getDocs(collection(db, "products"));
      snapshot.forEach((doc) => {
        produits.value.push({ id: doc.id, ...doc.data() });
      });
    };

    onMounted(fetchProduits);

    return { produits, ajouterAuPanier, prixPromo };
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
