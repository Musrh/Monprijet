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
        <img :src="product.image" alt="" class="w-full h-32 object-cover mb-2 rounded" />
        <h3 class="font-semibold">{{ product.nom || product.name }}</h3>
        <p class="text-gray-600">{{ product.price }} €</p>
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
        // Exemple de produits, à remplacer par ta liste réelle
        { id: 1, nom: "Chaussures", name: "Shoes", price: 50, image: "/images/shoes.jpg" },
        { id: 2, nom: "Sac à dos", name: "Backpack", price: 35, image: "/images/backpack.jpg" },
        { id: 3, nom: "Montre", name: "Watch", price: 80, image: "/images/watch.jpg" },
        { id: 4, nom: "Lunettes", name: "Glasses", price: 20, image: "/images/glasses.jpg" }
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
        fr: {
          resultsFor: "Résultats pour",
          noResults: "Aucun produit trouvé"
        },
        en: {
          resultsFor: "Results for",
          noResults: "No products found"
        }
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
