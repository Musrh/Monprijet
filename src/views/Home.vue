<template>
  <div class="min-h-screen bg-gray-100 p-4">

    <!-- Si aucun produit -->
    <div v-if="!produits.length" class="text-center text-gray-500">
      Chargement des produits...
    </div>

    <!-- Slider -->
    <div v-if="produits.length"
         class="relative w-full max-w-4xl mx-auto overflow-hidden rounded-xl shadow-lg h-64 mb-6">

      <div class="flex transition-transform duration-500"
           :style="{ transform: `translateX(-${currentIndex * 100}%)` }">

        <div v-for="(p, i) in produits"
             :key="p.id"
             class="w-full flex-shrink-0 relative">

          <!-- IMAGE -->
          <img
            v-if="p.images"
            :src="p.images"
            :alt="p.nom"
            class="w-full h-64 object-cover rounded-xl"
          />

          <div class="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black bg-opacity-50 text-white px-4 py-1 rounded">
            <h2 class="font-semibold">{{ p.nom }}</h2>
            <p>{{ p.prix }} MAD</p>
          </div>

        </div>

      </div>

      <!-- Navigation -->
      <button
        @click="prev"
        class="absolute top-1/2 left-2 -translate-y-1/2 bg-green-600 text-white rounded-full p-2 hover:bg-green-700">
        ‹
      </button>

      <button
        @click="next"
        class="absolute top-1/2 right-2 -translate-y-1/2 bg-green-600 text-white rounded-full p-2 hover:bg-green-700">
        ›
      </button>

    </div>

  </div>
</template>

<script>
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase";

export default {
  data() {
    return {
      produits: [],
      currentIndex: 0
    };
  },

  async mounted() {
    try {
      const snapshot = await getDocs(collection(db, "products"));

      this.produits = snapshot.docs.map(doc => {
        const data = doc.data();
        console.log("Produit Firestore:", data); // 🔍 DEBUG

        return {
          id: doc.id,
          nom: data.nom,
          prix: data.prix,
          images: data.images
        };
      });

    } catch (error) {
      console.error("Erreur Firestore :", error);
    }
  },

  methods: {
    next() {
      this.currentIndex =
        (this.currentIndex + 1) % this.produits.length;
    },

    prev() {
      this.currentIndex =
        (this.currentIndex - 1 + this.produits.length) % this.produits.length;
    }
  }
};
</script>
