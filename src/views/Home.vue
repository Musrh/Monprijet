<template>
  <div class="min-h-screen bg-gray-100">

    <!-- Slider des produits -->
    <div class="relative w-full overflow-hidden bg-white shadow-md rounded-xl mt-6">
      <!-- Slide container -->
      <div class="flex transition-transform duration-500"
           :style="{ transform: `translateX(-${currentIndex * 100}%)` }">
        <div v-for="(produit, index) in produits" :key="index" class="w-full flex-shrink-0">
          <img :src="produit.image" :alt="produit.nom" class="w-full h-64 object-cover rounded-t-xl">
          <div class="p-4 text-center">
            <h2 class="text-xl font-semibold">{{ produit.nom }}</h2>
            <p class="text-gray-600">{{ produit.prix ? `$${produit.prix}` : '' }}</p>
          </div>
        </div>
      </div>

      <!-- Contrôles -->
      <button @click="prev" class="absolute top-1/2 left-2 -translate-y-1/2 bg-green-600 text-white rounded-full p-2 hover:bg-green-700 transition">
        ‹
      </button>
      <button @click="next" class="absolute top-1/2 right-2 -translate-y-1/2 bg-green-600 text-white rounded-full p-2 hover:bg-green-700 transition">
        ›
      </button>

      <!-- Pagination -->
      <div class="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2">
        <span v-for="(p, i) in produits" :key="i"
              @click="goToSlide(i)"
              class="w-3 h-3 rounded-full cursor-pointer"
              :class="i === currentIndex ? 'bg-green-600' : 'bg-gray-400'"></span>
      </div>
    </div>

    <!-- Partie texte / contenu de Home -->
    <div class="p-6">
      <h1 class="text-2xl font-bold mb-4">Bienvenue sur notre boutique</h1>
      <p class="text-gray-700">
        Ici vous trouverez nos meilleurs produits !
      </p>
    </div>

  </div>
</template>

<script>
export default {
  data() {
    return {
      currentIndex: 0,
      produits: [
        { nom: "Produit A", image: require("../assets/hero.png"), prix: 49.99 },
        { nom: "Produit B", image: require("../assets/hero.png"), prix: 29.99 },
        { nom: "Produit C", image: require("../assets/hero.png"), prix: 19.99 },
      ]
    };
  },
  methods: {
    next() {
      this.currentIndex = (this.currentIndex + 1) % this.produits.length;
    },
    prev() {
      this.currentIndex = (this.currentIndex - 1 + this.produits.length) % this.produits.length;
    },
    goToSlide(index) {
      this.currentIndex = index;
    }
  }
};
</script>

<style>
/* Masquer scrollbar si nécessaire */
</style>
