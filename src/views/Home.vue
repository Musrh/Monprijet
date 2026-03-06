<template>
  <div class="w-full px-4">

    <!-- Slider + Pub -->
    <section class="flex flex-col md:flex-row w-full">

      <!-- Slider -->
      <div class="md:w-2/3 w-full">
        <SliderProducts :produits="produitsFiltres" />
      </div>

      <!-- Pub -->
      <div class="md:w-1/3 w-full">
        <div class="h-full min-h-[320px] bg-yellow-200 flex items-center justify-center">
          Publicité
        </div>
      </div>

    </section>

    <!-- Vitrine -->
    <Vitrine v-if="!hasFilter" />

    <!-- Lien pour revenir à l'état initial -->
    <div v-if="hasFilter" class="mt-6">
      <button @click="reinitialiser" class="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">
        Retour à la page d'accueil
      </button>
    </div>

  </div>
</template>

<script>
import { ref, onMounted, computed, watch } from "vue";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import SliderProducts from "../components/SliderProducts.vue";
import Vitrine from "../components/Vitrine.vue";
import { useRoute, useRouter } from "vue-router";

export default {
  components: { SliderProducts, Vitrine },

  setup() {
    const route = useRoute();
    const router = useRouter();

    const produits = ref([]);
    const produitsPromos = ref([]);

    // Charger tous les produits
    const fetchProduits = async () => {
      const snapshot = await getDocs(collection(db, "products"));
      snapshot.forEach((doc) => {
        const produit = { id: doc.id, ...doc.data() };
        produits.value.push(produit);
        if (produit.promo) produitsPromos.value.push(produit);
      });
    };
    onMounted(fetchProduits);

    // Query params
    const routeQuery = computed(() => ({
      search: route.query.search || "",
      categorie: route.query.categorie || ""
    }));

    // Indique s’il y a un filtre appliqué
    const hasFilter = computed(() => routeQuery.value.search || routeQuery.value.categorie);

    // Produits filtrés selon query params
    const produitsFiltres = computed(() => {
      let result = produitsPromos.value;
      if (routeQuery.value.categorie) {
        result = result.filter(p => p.categorie === routeQuery.value.categorie);
      }
      if (routeQuery.value.search) {
        const s = routeQuery.value.search.toLowerCase();
        result = result.filter(p => p.nom.toLowerCase().includes(s));
      }
      return result;
    });

    // Revenir à l'état initial
    const reinitialiser = () => {
      router.replace({ path: "/" });
    };

    return {
      produitsPromos,
      produitsFiltres,
      hasFilter,
      reinitialiser
    };
  }
};
</script>
