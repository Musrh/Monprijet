<template>
  <div class="p-6">
    <h2 class="text-2xl font-bold mb-6">Nos Produits</h2>

    <div v-if="loading">Chargement...</div>

    <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div
        v-for="produit in produits"
        :key="produit.id"
        class="border p-4 rounded shadow"
      >
        <img
          :src="produit.images?.[0]"
          class="w-full h-40 object-cover rounded mb-2"
        />

        <h3 class="font-bold text-lg">{{ produit.nom }}</h3>

        <p class="text-sm text-gray-600 mb-2">{{ produit.description }}</p>

        <p class="font-semibold mb-2">{{ produit.prix }} €</p>

        <button
          @click="ajouterAuPanier(produit)"
          class="bg-blue-600 text-white px-3 py-2 rounded w-full"
        >
          Ajouter au panier
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { useStore } from "vuex";

const db = getFirestore();
const store = useStore();

const produits = ref([]);
const loading = ref(true);

const fetchProduits = async () => {
  const snapshot = await getDocs(collection(db, "products"));
  produits.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  loading.value = false;
};

const ajouterAuPanier = (produit) => {
  // On ajoute la première image pour le panier
  store.commit("ADD_TO_CART", {
    id: produit.id,
    nom: produit.nom,
    prix: produit.prix,
    description: produit.description,
    image: produit.images?.[0] || "",
    quantity: 1
  });
  alert("Produit ajouté au panier");
};

onMounted(fetchProduits);
</script>
