<template>
  <div class="minishop p-4">
    <h2 class="text-xl font-bold mb-4">Mini Shop - Produits Externes</h2>

    <div v-if="loading">Chargement des produits externes...</div>
    <div v-else-if="produits.length === 0">Aucun produit externe pour l'instant.</div>

    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      <div v-for="p in produits" :key="p.id" class="border p-4 rounded shadow text-center">
        <img :src="p.images" :alt="p.nom" class="w-full h-48 object-cover rounded" />
        <h3 class="font-semibold mt-2">{{ p.nom }}</h3>
        <p>{{ p.prix }} €</p>

        <div class="flex justify-center gap-2 mt-2">
          <button
            @click="ajouterAuPanier(p)"
            class="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
          >
            Ajouter au panier
          </button>

          <a
            :href="p.url"
            target="_blank"
            rel="noopener"
            class="bg-gray-600 text-white px-3 py-1 rounded hover:bg-gray-700"
          >
            Voir sur AliExpress
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useStore } from "vuex";

const store = useStore();
const produits = ref([]);
const loading = ref(true);

const fetchExternalProducts = async () => {
  try {
    const res = await fetch("https://nodejs-railway-production-8dd0.up.railway.app/products-external");
    const data = await res.json();
    produits.value = data;
  } catch (e) {
    console.error("Erreur récupération externe:", e);
  } finally {
    loading.value = false;
  }
};

const ajouterAuPanier = (p) => {
  store.dispatch("addToCart", {
    id: p.id,
    nom: p.nom,
    image: p.images,
    prix: p.prix,
    quantity: 1,
  });
  alert(`Produit "${p.nom}" ajouté au panier !`);
};

onMounted(fetchExternalProducts);
</script>

<style scoped>
.minishop img { display: block; width: 100%; object-fit: cover; }
</style>
