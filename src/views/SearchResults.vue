<template>
  <div class="p-6 max-w-6xl mx-auto">
    <h1 class="text-2xl font-bold mb-4">
      {{ titles.results }} "{{ searchTerm }}"
    </h1>

    <div v-if="results.length">
      <div
        v-for="product in results"
        :key="product.id"
        class="border p-4 mb-3 rounded shadow"
      >
        <h2 class="font-semibold">{{ product.nom }}</h2>
        <p>{{ product.prix }} €</p>
      </div>
    </div>

    <p v-else class="text-gray-500">
      {{ titles.noResults }}
    </p>
  </div>
</template>

<script>
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

export default {
  data() {
    return {
      results: [],
      searchTerm: ""
    };
  },

  computed: {
    currentLang() {
      return this.$store.getters["language/currentLanguage"] || "fr";
    },

    titles() {
      const translations = {
        fr: {
          results: "Résultats pour",
          noResults: "Aucun produit trouvé."
        },
        en: {
          results: "Results for",
          noResults: "No products found."
        }
      };
      return translations[this.currentLang] || translations.fr;
    }
  },

  async mounted() {
    this.searchTerm = this.$route.query.search || "";

    if (!this.searchTerm) return;

    const snapshot = await getDocs(collection(db, "products"));

    const term = this.searchTerm.toLowerCase();

    this.results = snapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .filter(product =>
        product.nom?.toLowerCase().includes(term)   // 👈 C'EST ICI
      );
  }
};
</script>
