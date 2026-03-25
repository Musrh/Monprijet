<template>
  <section class="max-w-7xl mx-auto px-4 py-6">

    <h2 class="text-2xl font-bold mb-4">
      {{ texts.resultsFor }} "{{ search }}"
    </h2>

    <div v-if="filteredProducts.length" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      <div
        v-for="product in filteredProducts"
        :key="product.id"
        class="border rounded p-3 hover:shadow-lg transition"
      >
        <img :src="product.images[0]" alt="" class="w-full h-32 object-cover mb-2 rounded" />
        <h3 class="font-semibold">
          {{ currentLang === 'fr' ? product.nom : product.name || product.nom }}
        </h3>
        <p class="text-gray-600">{{ product.prix }} €</p>
        <p class="text-sm text-gray-500">{{ product.categorie }}</p>
      </div>
    </div>

    <div v-else class="text-gray-500">
      {{ texts.noResults }}
    </div>

  </section>
</template>

<script>
import { useRoute } from "vue-router";

export default {
  name: "SearchResult",

  data() {
    return {
      search: "",
      products: [
        {
          id: 1,
          nom: "t-shirt-can-maroc-rouge",
          name: "can-maroc-red-tshirt",
          prix: 20,
          categorie: "t-shirts",
          images: ["https://res.cloudinary.com/dla18l69k/image/upload/v1773831629/y9mtfcojvm1wbyngkgs7.jpg"]
        },
        {
          id: 2,
          nom: "t-shirt-france-bleu",
          name: "france-blue-tshirt",
          prix: 22,
          categorie: "t-shirts",
          images: ["https://res.cloudinary.com/dla18l69k/image/upload/v1773831629/example2.jpg"]
        },
        {
          id: 3,
          nom: "casquette-maroc-noire",
          name: "maroc-black-cap",
          prix: 15,
          categorie: "casquettes",
          images: ["https://res.cloudinary.com/dla18l69k/image/upload/v1773831629/example3.jpg"]
        }
      ]
    };
  },

  computed: {
    filteredProducts() {
      if (!this.search) return this.products;

      const searchLower = this.search.toLowerCase();

      return this.products.filter(p =>
        (p.nom && p.nom.toLowerCase().includes(searchLower)) ||
        (p.name && p.name.toLowerCase().includes(searchLower))
      );
    },

    currentLang() {
      return this.$store.getters["language/currentLanguage"] || "en";
    },

    texts() {
      const translations = {
        fr: { resultsFor: "Résultats pour", noResults: "Aucun produit trouvé" },
        en: { resultsFor: "Results for", noResults: "No products found" }
      };
      return translations[this.currentLang] || translations.en;
    }
  },

  mounted() {
    const route = useRoute();
    this.search = route.query.search || "";
  }
};
</script>

<style scoped>
img {
  object-fit: cover;
}
</style>
