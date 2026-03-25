<template>
  <div class="p-6 max-w-6xl mx-auto">

    <h1 class="text-2xl font-bold mb-6">
      {{ texts.title }} "{{ searchQuery }}"
    </h1>

    <!-- Loading -->
    <p v-if="loading" class="text-gray-500 animate-pulse">
      {{ texts.loading }}
    </p>

    <!-- Aucun résultat -->
    <p v-if="!loading && results.length === 0" class="text-gray-500">
      {{ texts.noResults }}
    </p>

    <!-- Résultats -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div
        v-for="product in results"
        :key="product.id"
        class="bg-white p-4 rounded shadow hover:shadow-lg transition"
      >
        <img
          :src="product.images?.[0]"
          class="h-40 w-full object-contain mb-2"
        />

        <h3 class="font-semibold">{{ product.nom }}</h3>

        <p class="text-green-600 font-bold">
          {{ product.prix }} €
        </p>

        <p class="text-xs text-gray-400 mt-1">
          {{ product.source }}
        </p>
      </div>
    </div>

  </div>
</template>

<script>
import { ref, computed, watch, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

export default {
  name: "SearchResults",

  setup() {
    const route = useRoute();
    const store = useStore();

    const loading = ref(false);
    const results = ref([]);

    const searchQuery = computed(() =>
      route.query.search?.toLowerCase() || ""
    );

    const currentLang = computed(() =>
      store.getters["language/currentLanguage"] || "en"
    );

    const texts = computed(() => {
      const translations = {
        fr: {
          title: "Résultats pour",
          noResults: "Aucun produit trouvé.",
          loading: "Recherche en cours..."
        },
        en: {
          title: "Results for",
          noResults: "No products found.",
          loading: "Searching..."
        }
      };
      return translations[currentLang.value];
    });

    // 🔥 Recherche générique Firestore
    const fetchResults = async () => {
      if (!searchQuery.value) return;

      loading.value = true;
      results.value = [];

      try {
        // 🔹 Collection products
        const productsSnap = await getDocs(collection(db, "products"));
        const products = productsSnap.docs
          .map(doc => ({
            id: doc.id,
            ...doc.data(),
            source: "Store"
          }))
          .filter(p =>
            p.nom?.toLowerCase().includes(searchQuery.value)
          );

        // 🔹 Collection affiliateProducts
        const affiliateSnap = await getDocs(collection(db, "affiliateProducts"));
        const affiliate = affiliateSnap.docs
          .map(doc => ({
            id: doc.id,
            ...doc.data(),
            source: "Affiliate"
          }))
          .filter(p =>
            p.nom?.toLowerCase().includes(searchQuery.value)
          );

        results.value = [...products, ...affiliate];

      } catch (error) {
        console.error("Erreur recherche:", error);
      } finally {
        loading.value = false;
      }
    };

    onMounted(fetchResults);
    watch(searchQuery, fetchResults);

    return {
      results,
      searchQuery,
      loading,
      texts
    };
  }
};
</script>
