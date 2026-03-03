<template>
  <div class="home-page min-h-screen bg-gray-100">

    <!-- Slider des produits internes -->
    <SliderProducts 
      :produits="produitsInternes" 
      :ventes="ventes" 
      :ajouter-au-panier="ajouterAuPanier" 
    />

    <!-- Section Produits en vedette -->
    <section v-if="produitVedette" class="featured-section my-8 px-4">
      <h2 class="text-2xl font-bold mb-4 text-center">Produit en vedette</h2>
      <div class="flex flex-col md:flex-row items-center justify-center gap-6 bg-white p-4 rounded shadow">
        <img 
          :src="produitVedette.images?.[0] || produitVedette.image || '/placeholder.png'" 
          alt="Produit vedette" 
          class="w-64 h-64 object-cover rounded"
        />
        <div class="text-center md:text-left">
          <p class="text-xl font-semibold mb-1">{{ produitVedette.nom }}</p>
          <p class="text-green-600 font-bold mb-1">{{ produitVedette.prix }} €</p>
          <p class="text-gray-500 mb-2">Vendus : {{ ventes[produitVedette.id] || 0 }}</p>
          <button 
            @click="ajouterAuPanier(produitVedette)"
            class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
          >
            Ajouter au panier
          </button>
        </div>
      </div>
    </section>

    <!-- Produits externes -->
    <section v-if="produitsExternes.length" class="external-products my-6 px-4">
      <h2 class="text-2xl font-bold mb-4 text-center">Produits externes</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <div v-for="p in produitsExternes" :key="p.id" class="text-center border rounded p-2 bg-white shadow-sm hover:shadow-md transition">
          <img 
            :src="p.image || '/placeholder.png'" 
            alt="Produit externe" 
            class="w-full h-40 object-cover mb-2 rounded"
          />
          <p class="font-semibold">{{ p.nom }}</p>
          <p class="text-green-600 font-bold">{{ p.prix }} €</p>
          <button 
            @click="ajouterAuPanier(p)" 
            class="bg-green-600 text-white px-3 py-1 rounded mt-1 hover:bg-green-700 transition"
          >
            Ajouter au panier
          </button>
        </div>
      </div>
    </section>

    <!-- Vitrine -->
    <Vitrine />

  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { collection, getDocs } from "firebase/firestore";
import { useStore } from "vuex";
import { db } from "../firebase";

import SliderProducts from "../components/SliderProducts.vue";
import Vitrine from "../components/Vitrine.vue";

export default {
  components: { SliderProducts, Vitrine },
  setup() {
    const store = useStore();

    const produitsInternes = ref([]);
    const produitsExternes = ref([]);
    const produitVedette = ref(null);
    const ventes = ref({});

    const ajouterAuPanier = (produit) => {
      store.dispatch("addToCart", {
        ...produit,
        image: produit.images?.[0] || produit.image || '/placeholder.png',
        quantity: 1,
      });
    };

    // 🔹 Charger tous les produits internes et externes
    const fetchProduits = async () => {
      // Produits internes
      const snapshotInt = await getDocs(collection(db, "products"));
      snapshotInt.forEach((doc) => {
        const p = { id: doc.id, ...doc.data() };
        produitsInternes.value.push(p);
      });

      // Produits externes
      const snapshotExt = await getDocs(collection(db, "ProductsExternes"));
      snapshotExt.forEach((doc) => {
        const p = { id: doc.id, ...doc.data() };
        produitsExternes.value.push(p);
      });
    };

    // 🔹 Calculer le produit vedette à partir des commandes payées
    const fetchCommandes = async () => {
      const snapshot = await getDocs(collection(db, "commandes"));

      // Calculer la somme des quantities pour chaque produit interne
      snapshot.forEach((doc) => {
        const cmd = doc.data();
        if (cmd.statut !== "payé") return; // uniquement commandes payées

        // Trouver le produit interne correspondant
        const produit = produitsInternes.value.find(p => p.id === cmd.id);
        if (!produit) return; // ignorer les produits externes

        ventes.value[cmd.id] = (ventes.value[cmd.id] || 0) + (cmd.quantity || 0);
      });

      // Trouver le produit interne avec max ventes
      let max = 0;
      produitsInternes.value.forEach((p) => {
        const q = ventes.value[p.id] || 0;
        if (q > max) {
          max = q;
          produitVedette.value = p;
        }
      });
    };

    onMounted(async () => {
      await fetchProduits();    // d'abord charger les produits
      await fetchCommandes();   // ensuite calculer le produit vedette
    });

    return {
      produitsInternes,
      produitsExternes,
      produitVedette,
      ventes,
      ajouterAuPanier,
    };
  },
};
</script>

<style scoped>
.featured-section img,
.external-products img {
  object-fit: cover;
}
</style>
