<template>
  <div class="home-page min-h-screen bg-gray-100 px-4 md:px-8">

    <!-- 🔹 Slider produits internes aligné à gauche -->
    <div class="w-full md:w-3/4 mb-8">
      <SliderProducts 
        :produits="produitsInternes" 
        :ventes="ventes" 
        :ajouter-au-panier="ajouterAuPanier" 
      />
    </div>

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
      const prixFinal = produit.promo ? Math.round(produit.prix * 0.5) : produit.prix;

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
        const p = { id: doc.id, ...doc.data() };
        produitsInternes.value.push(p);
      });
    };

    const fetchCommandes = async () => {
      const snapshot = await getDocs(collection(db, "commandes"));
      snapshot.forEach((doc) => {
        const cmd = doc.data();
        if (cmd.statut !== "payé") return;

        cmd.items?.forEach(item => {
          const prodId = item.id;
          const qty = item.quantity || 1;
          ventes.value[prodId] = (ventes.value[prodId] || 0) + qty;
        });
      });
    };

    onMounted(async () => {
      await fetchProduits();
      await fetchCommandes();
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
.home-page {
  /* Optionnel : ajouter un padding vertical */
  padding-top: 1rem;
  padding-bottom: 1rem;
}
</style>
