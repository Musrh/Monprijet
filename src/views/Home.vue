<template>
  <div class="w-full px-4">

    <!-- Slider + Pub -->
    <section class="flex flex-col md:flex-row w-full mt-4">

      <!-- Slider -->
      <div class="md:w-2/3 w-full">
        <SliderProducts :produits="produitsPromos" />
      </div>

      <!-- Pub -->
      <div class="md:w-1/3 w-full">
        <div class="h-full min-h-[320px] bg-yellow-200 flex items-center justify-center">
          Publicité
        </div>
      </div>

    </section>

    <!-- Résultats filtrés ou vitrine -->
    <section class="mt-4">
      <div v-if="showFiltered">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-semibold">
            Résultats pour "{{ filtreCategorie || filtreSearch }}"
          </h2>
          <button
            @click="resetFilters"
            class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Revenir à la vitrine
          </button>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <div v-for="produit in produitsFiltres" :key="produit.id" class="border p-2 rounded shadow">
            <img :src="produit.images[0]" alt="" class="w-full h-40 object-cover mb-2 rounded" />
            <h3 class="font-semibold">{{ produit.nom }}</h3>
            <p class="text-green-700 font-bold">{{ produit.prix }} €</p>
          </div>
        </div>
      </div>

      <!-- Vitrine normale -->
      <Vitrine v-else />
    </section>

  </div>
</template>

<script>
import { ref, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import SliderProducts from "../components/SliderProducts.vue";
import Vitrine from "../components/Vitrine.vue";

export default {
  components: { SliderProducts, Vitrine },

  setup() {
    const produits = ref([]);
    const produitsPromos = ref([]);
    const produitsFiltres = ref([]);
    const showFiltered = ref(false);
    const filtreCategorie = ref("");
    const filtreSearch = ref("");

    const route = useRoute();   // Composable pour récupérer query params
    const router = useRouter(); // Composable pour naviguer / reset

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

    // Surveiller les query params et filtrer
    watch(
      () => route.query,
      (q) => {
        if (q.categorie || q.search) {
          filtreCategorie.value = q.categorie || "";
          filtreSearch.value = q.search || "";
          produitsFiltres.value = produits.value.filter((p) => {
            const matchCat = filtreCategorie.value ? p.categorie === filtreCategorie.value : true;
            const matchSearch = filtreSearch.value
              ? p.nom.toLowerCase().includes(filtreSearch.value.toLowerCase())
              : true;
            return matchCat && matchSearch;
          });
          showFiltered.value = true;
        } else {
          showFiltered.value = false;
        }
      },
      { immediate: true }
    );

    const resetFilters = () => {
      showFiltered.value = false;
      filtreCategorie.value = "";
      filtreSearch.value = "";
      router.push({ path: "/" }); // Supprime les query params
    };

    return {
      produitsPromos,
      produitsFiltres,
      showFiltered,
      filtreCategorie,
      filtreSearch,
      resetFilters,
    };
  },
};
</script>
