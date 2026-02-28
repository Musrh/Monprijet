<template>
  <div class="min-h-screen bg-gray-100 p-4">

    <!-- Slider produits -->
    <div class="relative w-full overflow-hidden rounded-xl shadow-lg h-64 mb-6">
      <div class="flex transition-transform duration-500"
           :style="{ transform: `translateX(-${currentIndex * 100}%)` }">
        <div v-for="(produit, i) in produits" :key="i" class="w-full flex-shrink-0 relative">
          <img :src="produit.image" :alt="produit.nom" class="w-full h-64 object-cover rounded-xl">
          <div class="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-4 py-1 rounded">
            <h2 class="font-semibold">{{ produit.nom }}</h2>
            <p>{{ produit.prix ? `$${produit.prix}` : '' }}</p>
          </div>
        </div>
      </div>

      <!-- Boutons prev / next -->
      <button @click="prev" class="absolute top-1/2 left-2 -translate-y-1/2 bg-green-600 text-white rounded-full p-2 hover:bg-green-700 transition">‹</button>
      <button @click="next" class="absolute top-1/2 right-2 -translate-y-1/2 bg-green-600 text-white rounded-full p-2 hover:bg-green-700 transition">›</button>

      <!-- Pagination -->
      <div class="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2">
        <span v-for="(p, i) in produits" :key="i" 
              @click="goToSlide(i)"
              class="w-3 h-3 rounded-full cursor-pointer"
              :class="i === currentIndex ? 'bg-green-600' : 'bg-gray-400'"></span>
      </div>
    </div>

    <!-- Partie texte -->
    <div class="p-4 bg-white rounded-xl shadow">
      <h1 class="text-2xl font-bold mb-2">Bienvenue sur notre boutique</h1>
      <p>Ici vous trouverez nos meilleurs produits !</p>
    </div>

  </div>
</template>

<script>
export default {
  data() {
    return {
      currentIndex: 0,
      produits: [
        {
          nom: "Produit A",
          prix: 49.99,
          image: "https://res.cloudinary.com/ton-cloud-name/image/upload/v1680000000/produitA.png"
        },
        {
          nom: "Produit B",
          prix: 29.99,
          image: "https://res.cloudinary.com/ton-cloud-name/image/upload/v1680000000/produitB.png"
        },
        {
          nom: "Produit C",
          prix: 19.99,
          image: "https://res.cloudinary.com/ton-cloud-name/image/upload/v1680000000/produitC.png"
        }
      ]
    };
  },
  methods: {
    next() { this.currentIndex = (this.currentIndex + 1) % this.produits.length; },
    prev() { this.currentIndex = (this.currentIndex - 1 + this.produits.length) % this.produits.length; },
    goToSlide(i) { this.currentIndex = i; }
  }
};
</script>
