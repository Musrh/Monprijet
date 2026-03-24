<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-6">Produits Partenaires</h1>

    <div v-if="products.length" class="grid grid-cols-2 md:grid-cols-4 gap-6">
      <div
        v-for="product in products"
        :key="product.id"
        class="border rounded-xl p-4 shadow hover:shadow-xl transition"
      >
        <!-- 🔹 Galerie Images -->
        <div v-if="product.image && product.image.length">
          <img
            v-for="(img, index) in product.image"
            :key="index"
            :src="img"
            :alt="product.title"
            class="w-full h-40 object-cover mb-2 rounded"
          />
        </div>

        <h2 class="font-semibold mb-2 text-sm line-clamp-3">
          {{ product.title }}
        </h2>

        <!-- 🔹 Prix -->
        <p class="text-orange-600 font-bold mb-3">
          {{ product.price }} €
        </p>

        <!-- 🔹 Bouton affilié -->
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
import { collection, getDocs, query, where } from "firebase/firestore";
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
      // 🔹 Exemple : filtrer catégorie "watch"
      const q = query(
        collection(db, "affiliateProducts"),
        where("category", "==", "watch")
      );

      const snap = await getDocs(q);

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
