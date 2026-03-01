<template>
  <div class="home max-w-6xl mx-auto p-4">

    <!-- SLIDER -->
    <SliderProducts :produits="produitsSlider" />

    <!-- PRODUITS EN VEDETTE ET PROMOS CÔTE À CÔTE -->
    <div class="flex flex-wrap gap-6 mt-6">
      <!-- Produit Vedette -->
      <div v-if="produitVedette" class="flex-1 min-w-[250px] border p-4 rounded shadow">
        <h2 class="text-xl font-semibold mb-2">Produit en vedette</h2>
        <img :src="produitVedette.image" :alt="produitVedette.nom" class="w-full h-48 object-cover rounded mb-2" />
        <h3 class="font-semibold">{{ produitVedette.nom }}</h3>
        <p>{{ produitVedette.prix }} €</p>
        <p>Vendu : {{ ventes[produitVedette.id] || 0 }} fois</p>
      </div>

      <!-- Produits en promotion -->
      <div v-if="produitsPromo.length" class="flex-1 min-w-[250px] border p-4 rounded shadow">
        <h2 class="text-xl font-semibold mb-2">Promotions</h2>
        <div v-for="p in produitsPromo" :key="p.id" class="mb-4">
          <img :src="p.image" :alt="p.nom" class="w-full h-32 object-cover rounded mb-1" />
          <h3 class="font-semibold">{{ p.nom }}</h3>
          <p><s>{{ p.prix }} €</s> {{ Math.round(p.prix * 0.5) }} €</p>
          <span class="bg-red-500 text-white text-xs px-2 py-1 rounded">Promo 50%</span>
        </div>
      </div>
    </div>

    <!-- POPUP PROMO -->
    <div v-if="showPopup" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white p-6 rounded-lg max-w-sm w-full relative">
        <button @click="closePopup" class="absolute top-2 right-2 text-xl">×</button>
        <h2 class="text-lg font-semibold mb-2">Promotion</h2>
        <img :src="popupProduit.image" :alt="popupProduit.nom" class="w-full h-48 object-cover mb-4" />
        <h3 class="font-semibold">{{ popupProduit.nom }}</h3>
        <p>{{ popupProduit.prix }} €</p>
        <button @click="ajouterAuPanier(popupProduit)" class="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition">
          Ajouter au panier
        </button>
      </div>
    </div>

  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { useStore } from "vuex";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import SliderProducts from "./SliderProducts.vue";

export default {
  name: "Home",
  components: { SliderProducts },
  setup() {
    const store = useStore();

    // Produits et commandes
    const produitsSlider = ref([]);
    const produitVedette = ref(null);
    const produitsPromo = ref([]);
    const ventes = ref({}); // { idProduit: totalQuantity }

    // POPUP
    const showPopup = ref(true);
    const popupProduit = ref({});

    // Récupérer tous les produits
    const fetchProduits = async () => {
      const snapshot = await getDocs(collection(db, "products"));
      snapshot.forEach(doc => {
        const p = doc.data();
        p.id = doc.id; // ajouter id Firestore
        produitsSlider.value.push(p);

        if (p.promo) produitsPromo.value.push(p);
        if (!produitVedette.value) produitVedette.value = p; // premier produit pour vedette
      });

      // Pré-remplir popup avec premier produit promo si existant
      if (produitsPromo.value.length > 0) popupProduit.value = produitsPromo.value[0];
    };

    // Récupérer commandes et calculer ventes par produit
    const fetchCommandes = async () => {
      const snapshot = await getDocs(collection(db, "commandes"));
      snapshot.forEach(doc => {
        const cmd = doc.data();
        if (cmd.items && cmd.items.length) {
          cmd.items.forEach(item => {
            if (!ventes.value[item.id]) ventes.value[item.id] = 0;
            ventes.value[item.id] += item.quantity;
          });
        }
      });
    };

    onMounted(() => {
      fetchProduits();
      fetchCommandes();
    });

    // Ajouter au panier depuis popup
    const ajouterAuPanier = (produit) => {
      store.dispatch("addToCart", { ...produit, quantity: 1 });
      alert(`${produit.nom} ajouté au panier !`);
      showPopup.value = false;
    };

    const closePopup = () => {
      showPopup.value = false;
    };

    return {
      produitsSlider,
      produitVedette,
      produitsPromo,
      ventes,
      showPopup,
      popupProduit,
      ajouterAuPanier,
      closePopup
    };
  }
};
</script>

<style scoped>
/* Styles simples pour cards et popup */
.product-card img {
  border-radius: 0.5rem;
  object-fit: cover;
}
</style>
