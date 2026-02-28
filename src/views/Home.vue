<template>
  <div class="min-h-screen bg-gray-100 p-4">

    <!-- Slider produits -->
    <div class="relative w-full max-w-4xl mx-auto overflow-hidden rounded-xl shadow-lg h-64 mb-6">
      <div class="flex transition-transform duration-500"
           :style="{ transform: `translateX(-${currentIndex * 100}%)` }">
        <div v-for="(p, i) in produits" :key="i" class="w-full flex-shrink-0 relative">
          <img :src="p.image" :alt="p.nom" class="w-full h-64 object-cover rounded-xl">
          <div class="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-4 py-1 rounded">
            <h2 class="font-semibold">{{ p.nom }}</h2>
            <p>{{ p.prix ? `$${p.prix}` : '' }}</p>
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

    <!-- Partie texte Home -->
    <div class="p-4 bg-white rounded-xl shadow max-w-4xl mx-auto">
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
          nom: "Produit 1",
          prix: 49.99,
          image: "https://res.cloudinary.com/dla18l69k/image/upload/v1772243876/produit1.jpg"
        },
        {
          nom: "Produit 2",
          prix: 29.99,
          image: "https://res.cloudinary.com/dla18l69k/image/upload/v1772243876/produit2.jpg"
        },
        {
          nom: "Produit 3",
          prix: 19.99,
          image: "https://res.cloudinary.com/dla18l69k/image/upload/v1772243876/produit3.jpg"
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
