<template>
  <div class="max-w-6xl mx-auto p-6">

    <h1 class="text-2xl font-bold mb-6">
      {{ texts.title }}: {{ $route.params.slug }}
    </h1>

    <div v-if="loading" class="text-gray-500">
      {{ texts.loading }}
    </div>

    <div v-else-if="products.length === 0" class="text-red-500">
      {{ texts.noResults }}
    </div>

    <div v-else class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div
        v-for="product in products"
        :key="product.id"
        class="bg-white p-4 rounded shadow"
      >
        <img
          :src="product.images?.[0]"
          class="w-full h-40 object-contain mb-2"
        />

        <h3 class="font-semibold">{{ product.nom }}</h3>

        <p class="text-green-600 font-bold">
          {{ product.prix }} €
        </p>

        <button
          @click="addToCart(product)"
          class="mt-2 bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
        >
          {{ texts.addToCart }}
        </button>
      </div>
    </div>

  </div>
</template>

<script>
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      products: [],
      loading: true
    };
  },

  computed: {
    ...mapGetters({
      currentLang: "language/currentLanguage"
    }),

    texts() {
      const translations = {
        fr: {
          title: "Résultats pour",
          loading: "Chargement...",
          noResults: "Aucun produit trouvé",
          addToCart: "Ajouter au panier"
        },
        en: {
          title: "Results for",
          loading: "Loading...",
          noResults: "No products found",
          addToCart: "Add to Cart"
        }
      };

      return translations[this.currentLang] || translations.en;
    }
  },

  async mounted() {
    const slug = this.$route.params.slug;

    const snapshot = await getDocs(collection(db, "products"));

    this.products = snapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .filter(product => product.categorie === slug);

    this.loading = false;
  },

  methods: {
    addToCart(product) {
      this.$store.dispatch("addToCart", {
        ...product,
        quantity: 1
      });
    }
  }
};
</script>
