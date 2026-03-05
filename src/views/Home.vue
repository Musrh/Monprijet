<template>
  <div class="home-page min-h-screen bg-gray-100 p-4">

    <!-- 🔹 Slider produits internes (75% bureau, 100% mobile) -->
    <SliderProducts 
      :produits="produitsInternes" 
      :ventes="ventes" 
      :ajouter-au-panier="ajouterAuPanier" 
      class="w-full md:w-3/4"
    />

    <!-- 🏪 Vitrine -->
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
    const ventes = ref({});

    const ajouterAuPanier = (produit) => {
      store.dispatch("addToCart", {
        id: produit.id,
        nom: produit.nom,
        prix: produit.prix,
        images: produit.images,
        quantity: 1
      });
    };

    const fetchProduits = async () => {
      const snapshot = await getDocs(collection(db, "products"));
      snapshot.forEach(doc => {
        const p = { id: doc.id, ...doc.data() };
        produitsInternes.value.push(p);
      });
    };

    onMounted(async () => {
      await fetchProduits();
    });

    return {
      produitsInternes,
      ventes,
      ajouterAuPanier
    };
  }
};
</script>

<style scoped>
/* Slider aligné à gauche */
.home-page .w-3\/4 {
  margin-left: 0;
}
</style>
