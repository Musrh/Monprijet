<template>
  <section class="px-4 mt-6">
    <h1 class="text-2xl font-bold mb-4">
      Produits Partenaires
    </h1>

    <div v-if="loading" class="text-center py-10">
      Chargement...
    </div>

    <div
      v-else
      class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"
    >
      <div
        v-for="product in products"
        :key="product.slug"
        class="bg-white shadow rounded-xl p-3 hover:shadow-lg transition"
      >
        <img
          :src="product.image"
          class="w-full h-40 object-cover rounded mb-2"
        />

        <h2 class="font-semibold text-sm mb-1">
          {{ product.title }}
        </h2>

        <p class="text-green-600 font-bold mb-2">
          {{ product.price }} €
        </p>

        <button
          @click="goToAffiliate(product.slug)"
          class="w-full bg-yellow-500 hover:bg-yellow-600 text-black py-2 rounded-lg text-sm font-semibold"
        >
          Voir sur AliExpress
        </button>
      </div>
    </div>
  </section>
</template>

<script>
import axios from "axios";

export default {
  name: "AffiliateProducts",
  data() {
    return {
      products: [],
      loading: true,
    };
  },
  methods: {
    async fetchProducts() {
      try {
        const res = await axios.get(
          "https://ton-backend.com/affiliate-products"
        );
        this.products = res.data;
      } catch (error) {
        console.error("Erreur chargement produits affiliés", error);
      } finally {
        this.loading = false;
      }
    },
    goToAffiliate(slug) {
      window.open(
        `https://ton-backend.com/go/${slug}`,
        "_blank"
      );
    },
  },
  mounted() {
    this.fetchProducts();
  },
};
</script>
