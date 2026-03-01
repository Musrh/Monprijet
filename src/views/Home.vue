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

          <!-- Badges -->
          <div class="absolute top-2 left-2 space-y-1">
            <span v-if="p.isBestSeller"
                  class="bg-yellow-500 text-white px-2 py-1 text-xs rounded">
              Meilleure vente
            </span>
            <span v-if="p.promo"
                  class="bg-red-600 text-white px-2 py-1 text-xs rounded">
              Promo
            </span>
          </div>

          <!-- Image -->
          <img :src="p.images" :alt="p.nom" class="w-full h-64 object-cover rounded-xl" />

          <!-- Nom + prix -->
          <div class="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black bg-opacity-50 text-white px-4 py-1 rounded">
            <h2 class="font-semibold">{{ p.nom }}</h2>
            <p>{{ p.prix }} MAD</p>
          </div>

        </div>
      </div>

      <!-- Navigation manuelle -->
      <button @click="prev"
              class="absolute top-1/2 left-2 -translate-y-1/2 bg-green-600 text-white rounded-full p-2 hover:bg-green-700 transition">
        ‹
      </button>

      <button @click="next"
              class="absolute top-1/2 right-2 -translate-y-1/2 bg-green-600 text-white rounded-full p-2 hover:bg-green-700 transition">
        ›
      </button>
    </div>

  </div>
</template>

<script>
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

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
      // 1️⃣ Récupérer tous les produits
      const prodSnap = await getDocs(collection(db, "products"));
      const produits = prodSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      // 2️⃣ Récupérer toutes les commandes
      const ordersSnap = await getDocs(collection(db, "orders"));
      const ventesParProduit = {};
      ordersSnap.docs.forEach(orderDoc => {
        const order = orderDoc.data();
        order.produits.forEach(p => {
          if (!ventesParProduit[p.id]) ventesParProduit[p.id] = 0;
          ventesParProduit[p.id] += p.quantité;
        });
      });

      // 3️⃣ Ajouter le nombre de ventes à chaque produit et déterminer best-seller
      const maxVentes = Math.max(...produits.map(p => ventesParProduit[p.id] || 0));
      this.produits = produits.map(p => ({
        ...p,
        ventes: ventesParProduit[p.id] || 0,
        isBestSeller: (ventesParProduit[p.id] || 0) === maxVentes
      }));

      // 4️⃣ Lancer autoplay
      this.$nextTick(() => {
        if (this.produits.length > 1) {
          this.intervalId = setInterval(() => {
            this.currentIndex = (this.currentIndex + 1) % this.produits.length;
          }, 3000);
        }
      });
    } catch (err) {
      console.error("Erreur Firestore :", err);
    }
  },
  beforeUnmount() {
    if (this.intervalId) clearInterval(this.intervalId);
  },
  methods: {
    next() {
      if (this.produits.length > 0)
        this.currentIndex = (this.currentIndex + 1) % this.produits.length;
    },
    prev() {
      if (this.produits.length > 0)
        this.currentIndex = (this.currentIndex - 1 + this.produits.length) % this.produits.length;
    }
  }
};
</script>
