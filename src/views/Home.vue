<template>
  <div class="w-full px-4">

    <!-- Slider + Pub -->
    <section class="flex flex-col md:flex-row w-full my-6">
      <!-- Slider des produits en promo -->
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
      <div v-if="filteredProduits.length > 0">
        <h2 class="text-xl font-bold mb-4">Résultats filtrés</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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
        <button
          @click="clearFilter"
          class="mt-4 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
        >
          Revenir à la page d'accueil
        </button>
      </div>
      <div v-else-if="searchActive">
        <h2 class="text-xl font-bold mb-4">Résultats filtrés</h2>
        <p>Aucun produit ne correspond à votre recherche.</p>
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
import { ref, onMounted } from "vue";
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

    const fetchProduits = async () => {
      const snapshot = await getDocs(collection(db, "products"));
      snapshot.forEach((doc) => {
        const produit = { id: doc.id, ...doc.data() };
        produits.value.push(produit);
        if (produit.promo) produitsPromos.value.push(produit);
      });
    };

    onMounted(fetchProduits);

    // Récupérer les paramètres de recherche depuis l'URL
    const searchParams = root.$route.query;
    const searchText = searchParams.search || "";
    const categorie = searchParams.categorie || "";

    const filterProduits = () => {
      if (searchText || categorie) {
        searchActive.value = true;
        filteredProduits.value = produits.value.filter((p) => {
          const matchesText = searchText
            ? p.nom.toLowerCase().includes(searchText.toLowerCase())
            : true;
          const matchesCat = categorie ? p.categorie === categorie : true;
          return matchesText && matchesCat;
        });
      }
    };

    onMounted(() => {
      // Laisser le temps à produits.value d'être rempli avant filtrage
      setTimeout(filterProduits, 500);
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
      clearFilter,
    };
  },
};
</script>

<style scoped>
/* Ajustement du grid et images */
img {
  object-fit: cover;
}
</style>
