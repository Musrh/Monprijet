<template>
  <div class="w-full px-4">

    <!-- Slider + Pub -->
    <section class="flex flex-col md:flex-row w-full my-6">
      <!-- Slider des produits promos -->
      <div class="md:w-2/3 w-full">
        <SliderProducts :produits="produitsPromos" />
      </div>

      <!-- Pub -->
      <div class="md:w-1/3 w-full">
        <div class="h-full min-h-[320px] bg-yellow-200 flex items-center justify-center rounded">
          Publicité
        </div>
      </div>
    </section>

    <!-- Résultats filtrés ou Vitrine -->
    <section class="my-6">
      <div v-if="searchActive">
        <h2 class="text-xl font-bold mb-4">Résultats filtrés</h2>
        <div v-if="filteredProduits.length > 0" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <div
            v-for="produit in filteredProduits"
            :key="produit.id"
            class="border p-4 rounded shadow"
          >
            <img :src="produit.images[0]" class="h-40 w-full object-cover rounded mb-2" />
            <h3 class="font-semibold">{{ produit.nom }}</h3>
            <p class="text-gray-600">{{ produit.description }}</p>
            <p class="font-bold mt-1">{{ produit.prix }} €</p>
          </div>
        </div>
        <div v-else>
          <p>Aucun produit ne correspond à votre recherche.</p>
        </div>
        <button
          @click="clearFilter"
          class="mt-4 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
        >
          Revenir à la page d'accueil
        </button>
      </div>

      <div v-else>
        <Vitrine />
      </div>
    </section>

  </div>
</template>

<script>
import { ref, onMounted, watch } from "vue";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import SliderProducts from "../components/SliderProducts.vue";
import Vitrine from "../components/Vitrine.vue";

export default {
  components: { SliderProducts, Vitrine },
  setup(_, { root }) {
    const produits = ref([]);
    const produitsPromos = ref([]);
    const filteredProduits = ref([]);
    const searchActive = ref(false);

    // Charger tous les produits
    const fetchProduits = async () => {
      const snapshot = await getDocs(collection(db, "products"));
      snapshot.forEach((doc) => {
        const produit = { id: doc.id, ...doc.data() };
        produits.value.push(produit);
        if (produit.promo) produitsPromos.value.push(produit);
      });

      // Après avoir chargé, lancer le filtre si on vient avec query
      applyFilter();
    };

    onMounted(fetchProduits);

    // Fonction pour filtrer selon search et categorie
    const applyFilter = () => {
      const searchText = (root.$route.query.search || "").toLowerCase();
      const categorie = root.$route.query.categorie || "";

      if (searchText || categorie) {
        searchActive.value = true;
        filteredProduits.value = produits.value.filter((p) => {
          const matchesText = searchText
            ? p.nom.toLowerCase().includes(searchText)
            : true;
          const matchesCat = categorie ? p.categorie === categorie : true;
          return matchesText && matchesCat;
        });
      }
    };

    // Re-filtrer si l'URL change (ex: clic sur une catégorie depuis HeaderSearch)
    watch(() => root.$route.query, () => {
      filteredProduits.value = [];
      searchActive.value = false;
      applyFilter();
    });

    const clearFilter = () => {
      searchActive.value = false;
      filteredProduits.value = [];
      root.$router.push("/");
    };

    return {
      produits,
      produitsPromos,
      filteredProduits,
      searchActive,
      clearFilter
    };
  }
};
</script>

<style scoped>
img {
  object-fit: cover;
}
</style>
