<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-6">Produits Partenaires</h1>

    <div v-if="products.length" class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div
        v-for="product in products"
        :key="product.id"
        class="border rounded p-4 shadow hover:shadow-lg transition"
      >
        <!-- Image du produit -->
        <img
          v-if="product.image"
          :src="product.image"
          :alt="product.title"
          class="w-full h-40 object-cover mb-2 rounded"
        />

        <h2 class="font-semibold mb-2 line-clamp-3">{{ product.title }}</h2>

        <a
          :href="product.affiliateUrl"
          target="_blank"
          class="bg-orange-500 text-white px-3 py-2 rounded inline-block"
        >
          Voir le produit
        </a>
      </div>
    </div>

    <p v-else>Aucun produit partenaire disponible.</p>
  </div>
</template>

<script>
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

export default {
  name: "AffiliateProducts",

  data() {
    return {
      products: []
    };
  },

  async mounted() {
    try {
      const snap = await getDocs(collection(db, "affiliateProducts"));

      this.products = snap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      console.log("Produits affiliés chargés:", this.products);
    } catch (error) {
      console.error("Erreur chargement affiliate:", error);
    }
  }
};
</script>
