<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-6">Produits Partenaires</h1>

    <div v-if="products.length" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      <div
        v-for="product in products"
        :key="product.slug"
        class="border rounded p-4 shadow hover:shadow-lg transition"
      >
        <!-- Afficher toutes les images -->
        <div v-if="product.image && product.image.length" class="mb-3">
          <img
            v-for="(img, index) in product.image"
            :key="index"
            :src="img"
            :alt="product.title"
            class="w-full h-40 object-cover mb-2 rounded"
          />
        </div>

        <!-- Titre du produit -->
        <h2 class="font-semibold mb-2 line-clamp-3">{{ product.title }}</h2>

        <!-- Prix -->
        <p class="text-lg font-bold text-green-600 mb-3">{{ product.price }} €</p>

        <!-- Bouton vers lien affilié -->
        <a
          :href="product.affiliateUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="bg-orange-500 text-white px-3 py-2 rounded inline-block w-full text-center"
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
      products: [],
    };
  },
  async mounted() {
    try {
      const snap = await getDocs(collection(db, "affiliateProducts"));

      // S'assurer que le champ image est un tableau
      this.products = snap.docs.map(doc => {
        const data = doc.data();
        return {
          slug: data.slug,
          title: data.title,
          price: data.price,
          affiliateUrl: data.affiliateUrl,
          image: Array.isArray(data.image) ? data.image : [],
        };
      });

      console.log("Produits affiliés chargés:", this.products);
    } catch (error) {
      console.error("Erreur chargement affiliate:", error);
    }
  },
};
</script>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;  
  overflow: hidden;
}
</style>
