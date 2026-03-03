<template>
  <div class="minishop p-4">
    <h2 class="text-xl font-bold mb-4">Mini Shop - Produits Externes</h2>

    <!-- Loading / vide -->
    <div v-if="loading">Chargement des produits externes...</div>
    <div v-else-if="produits.length === 0">Aucun produit externe pour l'instant.</div>

    <!-- Grille des produits -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      <div v-for="p in produits" :key="p.id" class="border p-4 rounded shadow text-center">
        <a :href="p.url" target="_blank">
          <img :src="p.images" :alt="p.nom" class="w-full h-48 object-cover rounded" />
        </a>
        <h3 class="font-semibold mt-2">{{ p.nom }}</h3>
        <p>{{ p.prix }} $</p>
        <button
          @click="ajouterAuPanier(p)"
          class="mt-2 bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
        >
          Ajouter au panier
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useStore } from "vuex";
import { getDocs, collection } from "firebase/firestore";
import { db } from "../firebase"; // ton fichier firebase.js

const store = useStore();
const produits = ref([]);
const loading = ref(true);

// 🔹 Récupération des produits externes depuis Firestore
const fetchProduitsExternes = async () => {
  loading.value = true;
  try {
    const snapshot = await getDocs(collection(db, "ProductsExternes"));
    produits.value = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (e) {
    console.error("Erreur récupération produits externes :", e);
  } finally {
    loading.value = false;
  }
};

// 🔹 Ajouter au panier
const ajouterAuPanier = (produit) => {
  store.dispatch("addToCart", {
    id: produit.id,
    nom: produit.nom,
    image: produit.images, // lien image
    prix: produit.prix,
    quantity: 1,
  });

  // ✅ Confirmation
  alert(`Produit "${produit.nom}" ajouté au panier !`);
};

onMounted(fetchProduitsExternes);
</script>

<style scoped>
.minishop img { display: block; width: 100%; object-fit: cover; }
</style>
