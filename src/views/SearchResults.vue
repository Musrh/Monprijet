<template>
  <div class="max-w-6xl mx-auto px-4 py-6">

    <h1 class="text-2xl font-bold mb-6">
      {{ texts.resultsFor }} "{{ searchQuery }}"
    </h1>

    <div v-if="produitsFiltres.length" class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div
        v-for="produit in produitsFiltres"
        :key="produit.id"
        class="bg-white p-4 rounded shadow"
      >
        <img
          :src="produit.images?.[0]"
          class="w-full h-40 object-contain mb-2"
        />
        <h3 class="font-semibold">{{ produit.nom }}</h3>
        <p class="text-green-600 font-bold">{{ produit.prix }} €</p>
      </div>
    </div>

    <p v-else class="text-gray-500">
      {{ texts.noResults }}
    </p>

  </div>
</template>

<script>
export default {
  name: "SearchResults",

  computed: {
    produits() {
      return this.$store.state.produits || [];
    },

    searchQuery() {
      return this.$route.query.search || "";
    },

    produitsFiltres() {
      if (!this.searchQuery) return [];

      return this.produits.filter(p =>
        p.nom.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    },

    currentLang() {
      return this.$store.getters["language/currentLanguage"] || "en";
    },

    texts() {
      const translations = {
        fr: {
          resultsFor: "Résultats pour",
          noResults: "Aucun produit trouvé."
        },
        en: {
          resultsFor: "Results for",
          noResults: "No products found."
        }
      };

      return translations[this.currentLang];
    }
  }
};
</script>
