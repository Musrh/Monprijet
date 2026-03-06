<template>
  <div class="w-full px-4">

    <!-- Slider + Pub -->
    <section class="flex flex-col md:flex-row w-full my-6">
      <div class="md:w-2/3 w-full">
        <SliderProducts :produits="produitsPromos" />
      </div>
      <div class="md:w-1/3 w-full">
        <div class="h-full min-h-[320px] bg-yellow-200 flex items-center justify-center rounded">
          Publicité
        </div>
      </div>
    </section>

    <!-- Résultats filtrés ou Vitrine -->
    <section class="my-6">
      <div v-if="filteredProduits.length || hasFilter">
        <h2 class="text-xl font-bold mb-4">Résultats filtrés</h2>

        <div v-if="filteredProduits.length > 0" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <div v-for="p in filteredProduits" :key="p.id" class="border p-4 rounded shadow">
            <img :src="p.images[0]" class="h-40 w-full object-cover rounded mb-2" />
            <h3 class="font-semibold">{{ p.nom }}</h3>
            <p class="text-gray-600">{{ p.description }}</p>
            <p class="font-bold mt-1">{{ p.prix }} €</p>
          </div>
        </div>

        <div v-else>
          <p>Aucun produit ne correspond à votre recherche.</p>
        </div>

        <button @click="resetFilter" class="mt-4 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700">
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
import { ref, onMounted, computed } from "vue";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import SliderProducts from "../components/SliderProducts.vue";
import Vitrine from "../components/Vitrine.vue";

export default {
  components: { SliderProducts, Vitrine },

  setup(_, { root }) {
    const produits = ref([]);
    const produitsPromos = ref([]);

    // Charger tous les produits
    const fetchProduits = async () => {
      const snapshot = await getDocs(collection(db, "products"));
      snapshot.forEach((doc) => {
        const p = { id: doc.id, ...doc.data() };
        produits.value.push(p);
        if (p.promo) produitsPromos.value.push(p);
      });
    };

    onMounted(fetchProduits);

    // Détecter s'il y a un filtre actif dans l'URL
    const hasFilter = computed(() => {
      return !!root.$route.query.search || !!root.$route.query.categorie;
    });

    // Produits filtrés selon search et categorie
    const filteredProduits = computed(() => {
      const searchText = (root.$route.query.search || "").toLowerCase();
      const categorie = root.$route.query.categorie || "";

      return produits.value.filter((p) => {
        const matchesText = searchText ? p.nom.toLowerCase().includes(searchText) : true;
        const matchesCat = categorie ? p.categorie === categorie : true;
        return matchesText && matchesCat;
      });
    });

    // Réinitialiser filtre et revenir à la Vitrine
    const resetFilter = () => {
      root.$router.push("/");
    };

    return {
      produitsPromos,
      filteredProduits,
      hasFilter,
      resetFilter
    };
  }
};
</script>

<style scoped>
img { object-fit: cover; }
</style>
