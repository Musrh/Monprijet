<template>
  <div class="home-page min-h-screen bg-gray-100">

    <!-- Slider des produits internes -->
    <SliderProducts 
      :produits="produitsInternes" 
      :ventes="ventes" 
      :ajouter-au-panier="ajouterAuPanier" 
    />

    <!-- Produit vedette -->
    <div v-if="produitVedette" class="featured-product my-8 text-center">
      <h2 class="text-2xl font-bold mb-4">Produit en vedette</h2>
      <img 
        :src="produitVedette.images?.[0] || produitVedette.image || '/placeholder.png'" 
        alt="Produit vedette" 
        class="w-64 h-64 object-cover mx-auto mb-2 rounded"
      />
      <p class="text-lg font-semibold">{{ produitVedette.nom }}</p>
      <p class="text-green-600 font-bold">{{ produitVedette.prix }} €</p>
      <p class="text-gray-500">Vendus : {{ ventes[produitVedette.id] || 0 }}</p>
      <button 
        @click="ajouterAuPanier(produitVedette)"
        class="bg-green-600 text-white px-4 py-2 rounded mt-2 hover:bg-green-700 transition"
      >
        Ajouter au panier
      </button>
    </div>

    <!-- Produits externes -->
    <div v-if="produitsExternes.length" class="external-products my-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-4">
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

    <!-- Vitrine -->
    <Vitrine />

  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { collection, getDocs } from "firebase/firestore";
import { useStore } from "vuex";
import { db } from "../firebase";

import SliderProducts from "./SliderProducts.vue";
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

    const fetchProduits = async () => {
      // Produits internes
      const snapshotInt = await getDocs(collection(db, "products"));
      snapshotInt.forEach((doc) => {
        const p = { id: doc.id, ...doc.data(), type: "interne" };
        produitsInternes.value.push(p);
      });

      // Produits externes
      const snapshotExt = await getDocs(collection(db, "ProductsExternes"));
      snapshotExt.forEach((doc) => {
        const p = { id: doc.id, ...doc.data(), type: "externe" };
        produitsExternes.value.push(p);
      });
    };

    const fetchCommandes = async () => {
      const snapshot = await getDocs(collection(db, "commandes"));
      snapshot.forEach((doc) => {
        const cmd = doc.data();
        if (cmd.statut !== "payé") return;

        const prodId = cmd.id;
        const qty = cmd.quantity || 0;
        ventes.value[prodId] = (ventes.value[prodId] || 0) + qty;
      });

      // Produit vedette = max ventes
      let max = 0;
      [...produitsInternes.value, ...produitsExternes.value].forEach((p) => {
        const q = ventes.value[p.id] || 0;
        if (q > max) {
          max = q;
          produitVedette.value = { ...p };
        }
      });
    };

    onMounted(async () => {
      await fetchProduits();
      await fetchCommandes();
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
.featured-product img,
.external-products img {
  object-fit: cover;
}
</style>
