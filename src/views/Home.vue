<template>
  <div class="w-full px-4">
    <HeaderSearch @filter-changed="appliquerFiltre" />

    <!-- Slider + Pub -->
    <section class="flex flex-col md:flex-row w-full">
      <div class="md:w-2/3 w-full">
        <SliderProducts :produits="produitsFiltres" />
      </div>
      <div class="md:w-1/3 w-full">
        <div class="h-full min-h-[320px] bg-yellow-200 flex items-center justify-center">
          Publicité
        </div>
      </div>
    </section>

    <!-- Vitrine -->
    <Vitrine v-if="!hasFilter" />

    <div v-if="hasFilter" class="mt-6">
      <button @click="reinitialiser" class="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">
        Retour à la page d'accueil
      </button>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from "vue";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import SliderProducts from "../components/SliderProducts.vue";
import Vitrine from "../components/Vitrine.vue";

export default {
  components: { SliderProducts, Vitrine },

  setup() {
    const produits = ref([]);
    const produitsPromos = ref([]);
    const search = ref("");
    const categorie = ref("");

    const fetchProduits = async () => {
      const snapshot = await getDocs(collection(db, "products"));
      snapshot.forEach(doc => {
        const produit = { id: doc.id, ...doc.data() };
        produits.value.push(produit);
        if (produit.promo) produitsPromos.value.push(produit);
      });
    };
    onMounted(fetchProduits);

    const hasFilter = computed(() => search.value || categorie.value);

    const produitsFiltres = computed(() => {
      let result = produitsPromos.value;
      if (categorie.value) {
        result = result.filter(p => p.categorie === categorie.value);
      }
      if (search.value) {
        const s = search.value.toLowerCase();
        result = result.filter(p => p.nom.toLowerCase().includes(s));
      }
      return result;
    });

    const appliquerFiltre = ({ search: s, categorie: c }) => {
      search.value = s;
      categorie.value = c;
    };

    const reinitialiser = () => {
      search.value = "";
      categorie.value = "";
    };

    return {
      produitsPromos,
      produitsFiltres,
      search,
      categorie,
      hasFilter,
      appliquerFiltre,
      reinitialiser
    };
  }
};
</script>
