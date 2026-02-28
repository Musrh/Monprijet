<template>
  <div class="w-full max-w-3xl mx-auto mt-6">
    <!-- Slider produits -->
    <div class="relative w-full overflow-hidden rounded-xl shadow-lg h-64">
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

      <!-- Boutons -->
      <button @click="prev" class="absolute top-1/2 left-2 -translate-y-1/2 bg-green-600 text-white rounded-full p-2 hover:bg-green-700 transition">‹</button>
      <button @click="next" class="absolute top-1/2 right-2 -translate-y-1/2 bg-green-600 text-white rounded-full p-2 hover:bg-green-700 transition">›</button>
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
          image: "https://res.cloudinary.com/dla18l69k/image/upload/v1689999999/produitA.png"
        },
        {
          nom: "Produit B",
          prix: 29.99,
          image: "https://res.cloudinary.com/dla18l69k/image/upload/v1689999999/produitB.png"
        },
        {
          nom: "Produit C",
          prix: 19.99,
          image: "https://res.cloudinary.com/dla18l69k/image/upload/v1689999999/produitC.png"
        }
      ]
    };
  },
  methods: {
    next() { this.currentIndex = (this.currentIndex + 1) % this.produits.length; },
    prev() { this.currentIndex = (this.currentIndex - 1 + this.produits.length) % this.produits.length; }
  }
};
</script>
