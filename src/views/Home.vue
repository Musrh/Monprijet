<template>
  <div class="home">
    <!-- Slider des produits -->
    <SliderProducts :produits="produitsSlider" />

    <!-- Section produits vedette et promos côte à côte -->
    <div class="flex flex-wrap gap-6 my-8 justify-center">
      <!-- Produit vedette -->
      <div v-if="produitVedette" class="w-64 p-4 border rounded shadow">
        <h2 class="text-xl font-semibold mb-2">Produit en vedette</h2>
        <img :src="produitVedette.images" :alt="produitVedette.nom" class="w-full h-48 object-cover rounded mb-2" />
        <h3>{{ produitVedette.nom }}</h3>
        <p>{{ produitVedette.prix }} €</p>
        <p>Vendu : {{ ventes[produitVedette.id] || 0 }} fois</p>
      </div>

      <!-- Produits en promotion -->
      <div v-for="p in produitsPromo" :key="p.id" class="w-64 p-4 border rounded shadow relative">
        <h2 class="text-xl font-semibold mb-2">Promotion</h2>
        <img :src="p.images" :alt="p.nom" class="w-full h-48 object-cover rounded mb-2" />
        <h3>{{ p.nom }}</h3>
        <p><s>{{ p.prix }} €</s> {{ Math.round(p.prix * 0.5) }} €</p>
        <span class="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded">Promo 50%</span>
      </div>
    </div>

    <!-- Popup produit promo -->
    <div v-if="showPopup" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white p-6 rounded-lg max-w-sm w-full relative">
        <button @click="closePopup" class="absolute top-2 right-2 text-xl">×</button>
        <h2 class="text-lg font-semibold mb-2">Promotion</h2>
        <img :src="popupProduit.images" :alt="popupProduit.nom" class="w-full h-48 object-cover mb-4" />
        <h3>{{ popupProduit.nom }}</h3>
        <p>{{ popupProduit.prix }} €</p>
        <button @click="ajouterAuPanier(popupProduit)"
                class="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition">
          Ajouter au panier
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { collection, getDocs } from "firebase/firestore";
import { useStore } from "vuex";
import { db } from "../firebase";
import SliderProducts from "./SliderProducts.vue";

export default {
  components: { SliderProducts },
  setup() {
    const store = useStore();

    const produitsSlider = ref([]);
    const produitVedette = ref(null);
    const produitsPromo = ref([]);
    const ventes = ref({});
    const commandes = ref([]);

    const showPopup = ref(true);
    const popupProduit = ref(null);

    // 🔹 Récupérer tous les produits
    const fetchProduits = async () => {
      const snapshot = await getDocs(collection(db, "products"));
      snapshot.forEach(doc => {
        const p = doc.data();
        p.id = doc.id;
        produitsSlider.value.push(p);
        if (p.promo) produitsPromo.value.push(p);
      });
    };

    // 🔹 Récupérer toutes les commandes et calculer ventes
    const fetchCommand
