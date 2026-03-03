<template>
  <div class="home-page min-h-screen bg-gray-100">

    <!-- Slider des produits internes -->
    <SliderProducts 
      :produits="produitsInternes" 
      :ventes="ventes" 
      :ajouter-au-panier="ajouterAuPanier" 
    />

    <!-- Produits en vedette -->
    <FeaturedProducts />

    <!-- Produits externes -->
    <div v-if="produitsExternes.length" class="external-products my-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-4">
      <div v-for="p in produitsExternes" :key="p.id" class="text-center border rounded p-2 bg-white shadow-sm hover:shadow-md transition">
        <img 
          :src="p.image || '/placeholder.png'" 
          alt="Produit externe" 
          class="w-full h-40 object-cover mb-2 rounded"
        />
        <p class="font-semibold">{{ p.nom }}</p>
        <p class="text-green-600 font-bold">{{ p.prix }} MAD</p>
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
import { getDocs, collection } from "firebase/firestore";
import { useStore } from "vuex";
import { db } from "../firebase";

import SliderProducts from "../components/SliderProducts.vue";
import FeaturedProducts from "../components/FeaturedProducts.vue";
import Vitrine from "../components/Vitrine.vue";

export default {
  components: { SliderProducts, FeaturedProducts, Vitrine },
  setup() {
    const store = useStore();

    const produitsInternes = ref([]);
    const produitsExternes = ref([]);
    const ventes = ref({});

    const ajouterAuPanier = (produit) => {
      store.dispatch("addToCart", {
        ...produit,
        image: produit.images?.[0] || produit.image || "/placeholder.png",
        quantity: 1,
      });
    };

    const fetchProduits = async () => {
      // Produits internes
      const snapshotInt = await getDocs(collection(db, "products"));
      snapshotInt.forEach((doc) => {
        produitsInternes.value.push({ id: doc.id, ...doc.data() });
      });

      // Produits externes
      const snapshotExt = await getDocs(collection(db, "ProductsExternes"));
      snapshotExt.forEach((doc) => {
        produitsExternes.value.push({ id: doc.id, ...doc.data() });
      });
    };

    const fetchVentes = async () => {
      // Calcule les ventes par id produit
      const snapshot = await getDocs(collection(db, "commandes"));
      const compteur = {};
      snapshot.forEach((doc) => {
        const data = doc.data();
        if (!data.id || !data.quantity || data.statut !== "payé") return;
        compteur[data.id] = (compteur[data.id] || 0) + data.quantity;
      });
      ventes.value = compteur;
    };

    onMounted(async () => {
      await fetchProduits();
      await fetchVentes();
    });

    return {
      produitsInternes,
      produitsExternes,
      ventes,
      ajouterAuPanier,
    };
  },
};
</script>

<style scoped>
.external-products img {
  object-fit: cover;
}
</style>
