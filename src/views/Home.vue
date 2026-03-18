<template>
  <div class="w-full">

    <!-- Section principale : Slider + Printful + Vitrine -->
    <section v-if="!hasFilter" class="w-full flex flex-col gap-6">

      <!-- Slider -->
      <SliderProducts :produits="produitsPromos" />

      <!-- Printful Products -->
      <PrintfulProducts
        api-url="https://printfulapi-production.up.railway.app"
        @add-to-cart="addToCart"
      />

      <!-- Vitrine / Catégories -->
      <Vitrine />

    </section>

    <!-- Résultats filtrés -->
    <section v-if="hasFilter" class="w-full mt-6">

      <h2 class="text-xl font-bold mb-2">Résultats filtrés</h2>

      <!-- Aucun résultat -->
      <div v-if="filteredProducts.length === 0">
        <p>Aucun produit ne correspond à votre recherche.</p>
        <button
          @click="clearFilter"
          class="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Retour à l'accueil
        </button>
      </div>

      <!-- Résultats -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <div
          v-for="produit in filteredProducts"
          :key="produit.id"
          class="border rounded-lg p-4 bg-white shadow flex flex-col"
        >
          <!-- Image -->
          <img :src="produit.images[0]" class="h-40 w-full object-cover rounded mb-3" />

          <!-- Nom -->
          <h3 class="font-bold text-lg">{{ produit.nom }}</h3>

          <!-- Description -->
          <p class="text-gray-600 text-sm mb-2">{{ produit.description }}</p>

          <!-- Prix -->
          <p class="text-green-600 font-bold text-lg mb-3">{{ produit.prix }} $</p>

          <!-- Bouton panier -->
          <button
            @click="addToCart(produit)"
            class="mt-auto bg-green-600 text-white py-2 rounded hover:bg-green-700"
          >
            Ajouter au panier
          </button>
        </div>
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
import { useStore } from "vuex";

import PrintfulProducts from "./PrintfulProducts.vue";

export default {
  components: { SliderProducts, Vitrine, PrintfulProducts },

  setup() {
    const produits = ref([]);
    const produitsPromos = ref([]);
    const filteredProducts = ref([]);

    const route = useRoute();
    const router = useRouter();
    const store = useStore();

    const hasFilter = computed(() => route.query.search || route.query.categorie);

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
      const categorie = (route.query.categorie || "").toLowerCase();

      filteredProducts.value = produits.value.filter((p) => {
        const nom = (p.nom || "").toLowerCase();
        const description = (p.description || "").toLowerCase();
        const cat = (p.categorie || "").toLowerCase();

        const matchText =
          searchText === "" ||
          nom.includes(searchText) ||
          description.includes(searchText) ||
          cat.includes(searchText);

        const matchCategorie = categorie === "" || cat === categorie;

        return matchText && matchCategorie;
      });
    };

    const clearFilter = () => router.push({ path: "/" });
    const addToCart = (produit) => store.dispatch("addToCart", produit);

    onMounted(async () => {
      await fetchProduits();
      applyFilter();
    });

    watch(() => route.query, applyFilter);

    return { produitsPromos, filteredProducts, hasFilter, clearFilter, addToCart };
  },
};
</script>

<style scoped>
/* Espace vertical léger entre sections */
section + section {
  margin-top: 1rem;
}
</style>
