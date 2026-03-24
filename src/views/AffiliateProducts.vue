<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-6">
      {{ currentLang === "fr" ? "Produits Partenaires" : "Affiliate Products" }}
    </h1>

    <div
      v-if="filteredProducts.length"
      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
    >
      <div
        v-for="product in filteredProducts"
        :key="product.id"
        class="border rounded p-4 shadow hover:shadow-lg transition bg-white"
      >
        <!-- Images -->
        <div v-if="product.image.length" class="grid grid-cols-2 gap-2 mb-3">
          <img
            v-for="(img, index) in product.image"
            :key="index"
            :src="img"
            :alt="product.title"
            class="w-full h-24 object-cover rounded"
          />
        </div>

        <!-- Titre -->
        <h2 class="font-semibold mb-2 line-clamp-2">
          {{ product.title }}
        </h2>

        <!-- Prix -->
        <p v-if="product.price" class="text-lg font-bold text-green-600 mb-3">
          {{ product.price }} €
        </p>

        <!-- Bouton affilié -->
        <a
          :href="product.affiliateUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="bg-orange-500 hover:bg-orange-600 text-white px-3 py-2 rounded inline-block w-full text-center transition"
        >
          {{ currentLang === "fr" ? "Voir le produit" : "View Product" }}
        </a>
      </div>
    </div>

    <p v-else class="text-gray-500">
      {{ currentLang === "fr"
        ? "Aucun produit partenaire disponible."
        : "No affiliate products available." }}
    </p>
  </div>
</template>

<script>
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { mapGetters } from "vuex";

export default {
  name: "AffiliateProducts",

  data() {
    return {
      products: [],
    };
  },

  computed: {
    ...mapGetters({
      currentLang: "language/currentLanguage"
    }),

    // 🔹 Filtre par catégorie si route contient ?category=watch
    filteredProducts() {
      const category = this.$route.query.category;
      if (!category) return this.products;

      return this.products.filter(p => p.category === category);
    }
  },

  async mounted() {
    try {
      const snap = await getDocs(collection(db, "affiliateProducts"));

      this.products = snap.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          title: data.title || "",
          affiliateUrl: data.affiliateUrl || "#",
          image: Array.isArray(data.image) ? data.image : [],
          price: data.price || null,
          category: data.category || null
        };
      });
    } catch (error) {
      console.error("Erreur chargement affiliate:", error);
    }
  },
};
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
