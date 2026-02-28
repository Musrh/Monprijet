<template>
  <div class="min-h-screen bg-gray-100 p-4">

    <!-- Slider Produits -->
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

      <!-- Navigation manuelle -->
      <button
        @click="prev"
        class="absolute top-1/2 left-2 -translate-y-1/2 bg-green-600 text-white rounded-full p-2 hover:bg-green-700 transition">
        ‹
      </button>

      <button
        @click="next"
        class="absolute top-1/2 right-2 -translate-y-1/2 bg-green-600 text-white rounded-full p-2 hover:bg-green-700 transition">
        ›
      </button>

    </div>

    <!-- Partie texte Home -->
    <div class="p-6 bg-white rounded-xl shadow max-w-4xl mx-auto">
      <h1 class="text-2xl font-bold mb-2">Bienvenue sur notre boutique</h1>
      <p>Découvrez nos meilleurs produits disponibles dès maintenant.</p>
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
      currentIndex: 0,
      intervalId: null
    };
  },

  async mounted() {
    try {
      const snapshot = await getDocs(collection(db, "products"));

      this.produits = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      console.log("Produits chargés :", this.produits);

      // 🔹 Lancer autoplay après que le DOM soit prêt
      this.$nextTick(() => {
        if (this.produits.length > 1) {
          this.intervalId = setInterval(() => {
            this.currentIndex =
              (this.currentIndex + 1) % this.produits.length;
          }, 3000);
        }
      });

    } catch (error) {
      console.error("Erreur Firestore :", error);
    }
  },

  beforeUnmount() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  },

  methods: {
    next() {
      if (this.produits.length > 0) {
        this.currentIndex =
          (this.currentIndex + 1) % this.produits.length;
      }
    },
    prev() {
      if (this.produits.length > 0) {
        this.currentIndex =
          (this.currentIndex - 1 + this.produits.length) % this.produits.length;
      }
    }
  }
};
</script>
