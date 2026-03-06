<template>
  <div class="w-full px-4">

    <!-- Slider + Pub -->
    <section class="flex flex-col md:flex-row w-full gap-0">

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

    <!-- Résultats filtrés ou Vitrine -->
    <section class="mt-6 w-full">
      <div v-if="hasFilter">
        <h2 class="text-xl font-bold mb-4">Résultats filtrés</h2>

        <div v-if="filteredProducts.length === 0">
          <p>Aucun produit ne correspond à votre recherche.</p>
          <button
            @click="clearFilter"
            class="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Retour à l'accueil
          </button>
        </div>

        <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div
            v-for="produit in filteredProducts"
            :key="produit.id"
            class="border rounded p-4"
          >
            <img :src="produit.images[0]" alt="" class="h-32 w-full object-cover mb-2 rounded"/>
            <h3 class="font-bold">{{ produit.nom }}</h3>
            <p>{{ produit.description }}</p>
            <p class="font-semibold">{{ produit.prix }} $</p>
          </div>
        </div>
      </div>

      <div v-else>
        <!-- Vitrine normale si aucun filtre -->
        <Vitrine />
      </div>
    </section>

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
    const produits = ref([]);
    const produitsPromos = ref([]);
    const filteredProducts = ref([]);

    const route = useRoute();
    const router = useRouter();

    const hasFilter = computed(() => {
      return route.query.search || route.query.categorie;
    });

    const fetchProduits = async () => {
      const snapshot = await getDocs(collection(db, "products"));

      snapshot.forEach((doc) => {
        const produit = { id: doc.id, ...doc.data() };
        produits.value.push(produit);
        if (produit.promo) produitsPromos.value.push(produit);
      });
    };

    const applyFilter = () => {
      const searchText = (route.query.search || "").toLowerCase();
      const categorie = route.query.categorie || "";

      filteredProducts.value = produits.value.filter((p) => {
        const matchesText = searchText
          ? p.nom.toLowerCase().includes(searchText)
          : true;
        const matchesCategorie = categorie
          ? p.categorie === categorie
          : true;
        return matchesText && matchesCategorie;
      });
    };

    const clearFilter = () => {
      router.push({ path: "/" });
    };

    onMounted(async () => {
      await fetchProduits();
      applyFilter();
    });

    // Re-appliquer le filtre si query change
    watch(() => route.query, applyFilter);

    return {
      produitsPromos,
      filteredProducts,
      hasFilter,
      clearFilter
    };
  }
};
</script>

<style scoped>
/* Optionnel : un petit espace vertical réduit entre slider et vitrine */
section + section {
  margin-top: 1rem;
}
</style>
