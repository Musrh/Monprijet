<template>
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
</template>

<script>
export default {
  name: "SliderProduits",
  props: {
    produits: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      currentIndex: 0,
      intervalId: null
    };
  },
  mounted() {
    if (this.produits.length > 1) {
      this.intervalId = setInterval(() => {
        this.currentIndex = (this.currentIndex + 1) % this.produits.length;
      }, 3000);
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
