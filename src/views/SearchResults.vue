<template>
  <section class="max-w-7xl mx-auto px-4 py-6">

    <!-- 🔹 Affiche le texte uniquement si l'utilisateur a saisi quelque chose -->
    <h2 v-if="search && search.trim()" class="text-2xl font-bold mb-4">
      {{ texts.resultsFor }} "{{ search }}"
    </h2>

    <div v-if="filteredProducts.length"
         class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">

      <div v-for="product in filteredProducts"
           :key="product.id"
           class="border rounded p-3 hover:shadow-lg transition">

        <img :src="product.images[0]"
             class="w-full h-32 object-cover mb-2 rounded" />

        <h3 class="font-semibold">
          {{ currentLang === 'fr'
              ? product.nom
              : product.name || product.nom }}
        </h3>

        <p class="text-gray-600">{{ product.prix }} €</p>
        <p class="text-sm text-gray-500">{{ product.categorie }}</p>

      </div>
    </div>

    <div v-else-if="search && search.trim()" class="text-gray-500">
      {{ texts.noResults }}
    </div>

  </section>
</template>

<script>
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase"; // 🔹 ton fichier firebase.js
import { useRoute } from "vue-router";

export default {
  name: "SearchResult",

  props: ["globalSearch"],

  data() {
    return {
      search: "",
      products: []
    };
  },

  computed: {
    currentLang() {
      return this.$store.getters["language/currentLanguage"] || "en";
    },

    texts() {
      return {
        fr: { resultsFor: "Résultats pour", noResults: "Aucun produit trouvé" },
        en: { resultsFor: "Results for", noResults: "No products found" }
      }[this.currentLang];
    },

    filteredProducts() {
      // 🔹 Si le champ est vide, ne rien afficher
      if (!this.search || !this.search.trim()) return [];

      const s = this.search.toLowerCase();
      return this.products.filter(p =>
        (p.nom && p.nom.toLowerCase().includes(s)) ||
        (p.name && p.name.toLowerCase().includes(s))
      );
    }
  },

  async mounted() {
    const route = useRoute();

    // 🔹 Charger tous les produits depuis Firestore
    const snapshot = await getDocs(collection(db, "products"));
    this.products = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    // 🔹 Initialiser la recherche
    this.search = route.query.search || this.globalSearch || "";
  },

  watch: {
    globalSearch(val) {
      this.search = val;
    }
  }
};
</script>
