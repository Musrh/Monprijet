<template>
  <div class="mini-shop p-4">
    <h2 class="text-2xl font-bold mb-4">Mini Shop - Produits Externes</h2>

    <div v-if="produits.length" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      <div v-for="produit in produits" :key="produit.id" class="border rounded shadow p-4 text-center relative">
        <img :src="produit.image" :alt="produit.nom" class="w-full h-48 object-cover rounded mb-2" />
        <h3 class="font-semibold">{{ produit.nom }}</h3>
        <p class="text-lg font-bold">{{ produit.prix }} €</p>
        <button
          @click="ajouterAuPanier(produit)"
          class="mt-2 bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
        >
          Ajouter au panier
        </button>
        <span v-if="produit.source === 'external'" class="absolute top-2 left-2 bg-yellow-400 text-black px-2 py-1 rounded text-xs">Externe</span>
      </div>
    </div>

    <div v-else class="text-gray-500">Aucun produit externe disponible pour l'instant.</div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { useStore } from "vuex";

// Exemple JSON de produits externes (à remplacer par une API réelle si besoin)
const PRODUITS_EXTERNES = [
  {
    id: "ex1",
    nom: "Montre AliExpress",
    prix: 25,
    image: "https://via.placeholder.com/300x200?text=Montre",
    source: "external"
  },
  {
    id: "ex2",
    nom: "Casque Audio",
    prix: 40,
    image: "https://via.placeholder.com/300x200?text=Casque",
    source: "external"
  },
  {
    id: "ex3",
    nom: "Sac à dos",
    prix: 30,
    image: "https://via.placeholder.com/300x200?text=Sac",
    source: "external"
  }
];

export default {
  setup() {
    const store = useStore();
    const produits = ref([]);

    const ajouterAuPanier = (produit) => {
      store.dispatch("addToCart", {
        id: produit.id,
        nom: produit.nom,
        prix: produit.prix,
        image: produit.image,
        source: produit.source, // externe
        quantity: 1
      });
      alert(`${produit.nom} ajouté au panier !`);
    };

    // On "importe" les produits externes (ici JSON local, sinon fetch API)
    onMounted(() => {
      produits.value = PRODUITS_EXTERNES;
    });

    return {
      produits,
      ajouterAuPanier
    };
  }
};
</script>

<style scoped>
.mini-shop img {
  transition: transform 0.2s;
}
.mini-shop img:hover {
  transform: scale(1.05);
}
</style>
