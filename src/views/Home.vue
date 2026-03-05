<template>
  <div class="w-full px-4">

    <!-- Slider + Pub -->
    <section class="flex flex-col md:flex-row w-full mb-8">
      <!-- Slider -->
      <div class="md:w-2/3 w-full">
        <SliderProducts :produits="produitsAffiches" />
      </div>

      <!-- Pub -->
      <div class="md:w-1/3 w-full">
        <div class="h-full min-h-[320px] bg-yellow-200 flex items-center justify-center rounded shadow">
          Publicité
        </div>
      </div>
    </section>

    <!-- Résultats filtrés -->
    <div v-if="hasFilter" class="mb-8">
      <h2 class="text-lg font-bold mb-4">
        Résultats pour
        <span v-if="categorie">Catégorie: {{ categorie }}</span>
        <span v-if="search"> | Recherche: "{{ search }}"</span>
      </h2>

      <div v-if="produitsFiltres.length > 0" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <div v-for="p in produitsFiltres" :key="p.id" class="border p-4 rounded shadow">
          <img :src="p.image" alt="Produit" class="h-40 w-full object-cover mb-2" />
          <h3 class="font-semibold">{{ p.nom }}</h3>
          <p>{{ p.categorie }}</p>
          <p v-if="p.promo" class="text-red-500 font-bold">En promo !</p>
        </div>
      </div>

      <div v-else>
        <p>Aucun produit trouvé.</p>
      </div>

      <button @click="resetFilters" class="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
        Retour à la vitrine
      </button>
    </div>

    <!-- Vitrine (quand aucun filtre actif) -->
    <Vitrine v-else />

  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from "vue";
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

    const fetchProduits = async () => {
      const snapshot = await getDocs(collection(db, "products"));
      snapshot.forEach((doc) => {
        const p = { id: doc.id, ...doc.data() };
        produits.value.push(p);
        if (p.promo) produitsPromos.value.push(p);
      });
    };

    onMounted(fetchProduits);

    // 🔹 Variables pour filtrage
    const categorie = ref(route.query.categorie || "");
    const search = ref(route.query.search || "");

    // 🔹 Détecter changement de query params
    watch(
      () => route.query,
      (newQuery) => {
        categorie.value = newQuery.categorie || "";
        search.value = newQuery.search || "";
      }
    );

    // 🔹 Filtrage des produits
    const produitsFiltres = computed(() => {
      return produits.value.filter((p) => {
        const matchCat = categorie.value ? p.categorie === categorie.value : true;
        const matchSearch = search.value
          ? p.nom.toLowerCase().includes(search.value.toLowerCase())
          : true;
        return matchCat && matchSearch;
      });
    });

    const hasFilter = computed(() => categorie.value || search.value);

    const resetFilters = () => {
      router.push({ path: "/", query: {} });
    };

    const produitsAffiches = computed(() => produitsPromos.value);

    return {
      produitsPromos,
      produitsAffiches,
      produitsFiltres,
      categorie,
      search,
      hasFilter,
      resetFilters,
    };
  },
};
</script>

<style scoped>
/* Optionnel : retirer l'espace vertical entre slider et vitrine */
section + div {
  margin-top: 0;
}
</style>
