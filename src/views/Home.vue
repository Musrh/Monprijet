<template>
  <div class="w-full px-4">

    <!-- Slider + Pub -->
    <section class="flex flex-col md:flex-row w-full mb-4">

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
    <section class="mb-8">
      <div v-if="filteredProducts.length > 0">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-semibold">Résultats pour :
            <span class="text-purple-700">{{ currentCategorie || "Tous" }}</span>
            <span v-if="searchTerm">avec "{{ searchTerm }}"</span>
          </h2>
          <button
            @click="resetFilter"
            class="bg-gray-300 px-3 py-1 rounded hover:bg-gray-400"
          >
            Revenir à l'accueil
          </button>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div v-for="produit in filteredProducts" :key="produit.id" class="border rounded p-3 shadow">
            <img :src="produit.images[0]" alt="" class="w-full h-48 object-cover mb-2" />
            <h3 class="font-semibold">{{ produit.nom }}</h3>
            <p class="text-green-700 font-bold">{{ produit.prix }} €</p>
            <p v-if="produit.promo" class="text-red-500 font-semibold">Promo</p>
          </div>
        </div>
      </div>

      <!-- Si aucun filtre ou réinitialisé -->
      <Vitrine v-else />
    </section>

  </div>
</template>

<script>
import { ref, onMounted, computed } from "vue";
import { collection, getDocs } from "firebase/firestore";
import { useRoute, useRouter } from "vue-router";
import { db } from "../firebase";
import SliderProducts from "../components/SliderProducts.vue";
import Vitrine from "../components/Vitrine.vue";

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
        const produit = { id: doc.id, ...doc.data() };
        produits.value.push(produit);
        if (produit.promo) produitsPromos.value.push(produit);
      });
    };

    onMounted(fetchProduits);

    // Lecture des query params
    const currentCategorie = ref(route.query.categorie || "");
    const searchTerm = ref(route.query.search || "");

    const filteredProducts = computed(() => {
      return produits.value.filter((p) => {
        const matchCat = currentCategorie.value ? p.categorie === currentCategorie.value : true;
        const matchSearch = searchTerm.value
          ? p.nom.toLowerCase().includes(searchTerm.value.toLowerCase())
          : true;
        return matchCat && matchSearch;
      });
    });

    const resetFilter = () => {
      currentCategorie.value = "";
      searchTerm.value = "";
      router.push({ path: "/" });
    };

    return {
      produitsPromos,
      filteredProducts,
      currentCategorie,
      searchTerm,
      resetFilter
    };
  }
};
</script>
