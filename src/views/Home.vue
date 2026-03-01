<template>
  <div class="min-h-screen bg-gray-100 p-4">

    <!-- 1️⃣ Slider en haut -->
    <div v-if="produits.length" class="relative w-full max-w-5xl mx-auto overflow-hidden rounded-xl shadow-lg h-64 mb-8">
      <div class="flex transition-transform duration-500" :style="{ transform: `translateX(-${currentIndex * 100}%)` }">
        <div v-for="p in produits" :key="p.id" class="w-full flex-shrink-0 relative">
          <img :src="p.images" :alt="p.nom" class="w-full h-64 object-cover rounded-xl" />
          <div class="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black bg-opacity-50 text-white px-4 py-1 rounded">
            <h2 class="font-semibold">{{ p.nom }}</h2>
            <p>{{ p.prix }} MAD</p>
          </div>
        </div>
      </div>
      <button @click="prev" class="absolute top-1/2 left-2 -translate-y-1/2 bg-green-600 text-white rounded-full p-2 hover:bg-green-700 transition">‹</button>
      <button @click="next" class="absolute top-1/2 right-2 -translate-y-1/2 bg-green-600 text-white rounded-full p-2 hover:bg-green-700 transition">›</button>
    </div>

    <!-- 2️⃣ Produits en vedette -->
    <div v-if="produitsVedettes.length" class="max-w-5xl mx-auto mb-8">
      <h2 class="text-xl font-bold mb-4">Produits en vedette</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <div v-for="p in produitsVedettes" :key="p.id" class="bg-white rounded shadow p-4 relative">
          <img :src="p.images" :alt="p.nom" class="w-full h-40 object-cover rounded mb-2" />
          <h3 class="font-semibold">{{ p.nom }}</h3>
          <p class="text-green-600 font-bold">{{ p.prix }} MAD</p>
          <span v-if="p.isBestSeller" class="absolute top-2 left-2 bg-yellow-500 text-white px-2 py-1 text-xs rounded">Meilleure vente</span>
        </div>
      </div>
    </div>

    <!-- 3️⃣ Promos -->
    <div v-if="produitsPromo.length" class="max-w-5xl mx-auto mb-8">
      <h2 class="text-xl font-bold mb-4">Promotions</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <div v-for="p in produitsPromo" :key="p.id" class="bg-white rounded shadow p-4 relative">
          <img :src="p.images" :alt="p.nom" class="w-full h-40 object-cover rounded mb-2" />
          <h3 class="font-semibold">{{ p.nom }}</h3>
          <p class="text-red-600 font-bold">{{ p.prix }} MAD</p>
          <span v-if="p.promo" class="absolute top-2 left-2 bg-red-600 text-white px-2 py-1 text-xs rounded">Promo</span>
        </div>
      </div>
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
      produitsVedettes: [],
      produitsPromo: [],
      currentIndex: 0,
      intervalId: null,
      bestSellerThreshold: 1 // tu peux ajuster le minimum de ventes pour être vedette
    };
  },
  async mounted() {
    try {
      // 1️⃣ Récupérer tous les produits
      const prodSnap = await getDocs(collection(db, "products"));
      const produits = prodSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      // 2️⃣ Récupérer toutes les commandes
      const commandesSnap = await getDocs(collection(db, "commandes"));
      const ventesParProduit = {};
      commandesSnap.docs.forEach(cmdDoc => {
        const cmd = cmdDoc.data();
        cmd.produits.forEach(p => {
          if (!ventesParProduit[p.id]) ventesParProduit[p.id] = 0;
          ventesParProduit[p.id] += p.quantité;
        });
      });

      // 3️⃣ Calculer best-seller
      const maxVentes = Math.max(...produits.map(p => ventesParProduit[p.id] || 0));
      const produitsAvecVentes = produits.map(p => ({
        ...p,
        ventes: ventesParProduit[p.id] || 0,
        isBestSeller: (ventesParProduit[p.id] || 0) === maxVentes
      }));

      this.produits = produitsAvecVentes; // slider en haut avec tous les produits
      this.produitsVedettes = produitsAvecVentes.filter(p => p.isBestSeller);
      this.produitsPromo = produitsAvecVentes.filter(p => p.promo);

      // 4️⃣ Lancer autoplay
      if (this.produits.length > 1) {
        this.intervalId = setInterval(() => {
          this.currentIndex = (this.currentIndex + 1) % this.produits.length;
        }, 3000);
      }

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
