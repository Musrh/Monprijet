<template>
  <div class="home">
    <!-- Slider -->
    <SliderProducts :produits="sliderProduits" />

    <!-- Produits vedettes et promos côte à côte -->
    <div class="flex gap-8 my-8">
      <!-- Produit vedette -->
      <div v-if="produitVedette" class="product-card">
        <img :src="produitVedette.image" :alt="produitVedette.nom" />
        <h3>{{ produitVedette.nom }}</h3>
        <p>{{ produitVedette.prix }} €</p>
        <p>Vendu : {{ ventes[produitVedette.id] || 0 }} fois</p>
      </div>

      <!-- Produits en promo -->
      <div v-if="produitsPromo.length" class="grid grid-cols-2 gap-4">
        <div v-for="p in produitsPromo" :key="p.id" class="product-card">
          <img :src="p.image" :alt="p.nom" />
          <h3>{{ p.nom }}</h3>
          <p><s>{{ p.prix }} €</s> {{ Math.round(p.prix * 0.5) }} €</p>
          <span class="badge">Promo 50%</span>
        </div>
      </div>
    </div>

    <!-- Popup promotion -->
    <div v-if="showPopup" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white p-6 rounded-lg max-w-sm w-full relative">
        <button @click="closePopup" class="absolute top-2 right-2 text-xl">×</button>
        <h2 class="text-lg font-semibold mb-2">Promotion</h2>
        <img :src="popupProduit.image" :alt="popupProduit.nom" class="w-full h-48 object-cover mb-4" />
        <h3>{{ popupProduit.nom }}</h3>
        <p><s>{{ popupProduit.prix }} €</s> {{ Math.round(popupProduit.prix * 0.5) }} €</p>
        <button
          @click="ajouterAuPanier(popupProduit)"
          class="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
        >
          Ajouter au panier
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { useStore } from "vuex";
import SliderProducts from "./SliderProducts.vue";

export default {
  components: { SliderProducts },
  setup() {
    const store = useStore();

    const sliderProduits = ref([]);
    const commandes = ref([]);
    const produitsPromo = ref([]);
    const produitVedette = ref(null);
    const ventes = ref({});
    const showPopup = ref(true); // popup au démarrage
    const popupProduit = ref(null);

    // 🔹 Récupération produits pour slider
    const fetchSlider = async () => {
      const snapshot = await getDocs(collection(db, "products"));
      snapshot.forEach(doc => {
        const p = doc.data();
        if (p.image) sliderProduits.value.push(p);
      });
    };

    // 🔹 Récupération commandes et calcul ventes
    const fetchCommandes = async () => {
      const snapshot = await getDocs(collection(db, "commandes"));
      snapshot.forEach(doc => {
        commandes.value.push(doc.data());
      });

      // Calcul des ventes
      commandes.value.forEach(cmd => {
        if (cmd.items && cmd.items.length) {
          cmd.items.forEach(item => {
            if (!ventes.value[item.id]) ventes.value[item.id] = 0;
            ventes.value[item.id] += item.quantity;
          });
        }
      });
    };

    // 🔹 Produit vedette = le plus vendu
    const selectProduitVedette = () => {
      const ids = Object.keys(ventes.value);
      if (ids.length) {
        const maxId = ids.reduce((a, b) => (ventes.value[a] > ventes.value[b] ? a : b));
        produitVedette.value = sliderProduits.value.find(p => p.id === maxId);
      }
    };

    // 🔹 Produits en promo
    const selectProduitsPromo = () => {
      produitsPromo.value = sliderProduits.value.filter(p => p.promo);
      if (produitsPromo.value.length) popupProduit.value = produitsPromo.value[0];
    };

    // 🔹 Ajouter au panier via Vuex
    const ajouterAuPanier = (produit) => {
      store.dispatch("addToCart", { ...produit, quantity: 1 });
      alert(`${produit.nom} ajouté au panier !`);
      closePopup();
    };

    const closePopup = () => { showPopup.value = false; };

    onMounted(async () => {
      await fetchSlider();
      await fetchCommandes();
      selectProduitVedette();
      selectProduitsPromo();
    });

    return {
      sliderProduits,
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

<style>
.product-card img {
  width: 100%;
  height: 200px;
  object-fit: cover;
}
.badge {
  background-color: red;
  color: white;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.75rem;
}
</style>
