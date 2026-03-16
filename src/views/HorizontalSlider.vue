<template>
  <div class="slider-container relative w-full">
    <h2 class="text-lg font-bold mb-2">{{ title }}</h2>
    <div class="relative">
      <!-- Flèche gauche -->
      <button
        @click="scrollLeft"
        class="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white/70 p-2 rounded-full shadow z-10"
      >
        ◀
      </button>

      <!-- Conteneur défilable -->
      <div
        ref="scrollRef"
        class="flex overflow-x-auto scrollbar-hide space-x-4 scroll-smooth py-2"
      >
        <div
          v-for="product in products"
          :key="product.id"
          class="flex-shrink-0 w-40 bg-white shadow rounded p-2"
        >
          <!-- Image -->
          <img
            :src="product.thumbnail"
            :alt="product.name"
            class="w-full h-40 object-cover rounded mb-2"
          />

          <!-- Nom -->
          <h3 class="text-sm font-semibold truncate">{{ product.name }}</h3>

          <!-- Prix -->
          <p class="text-red-600 font-bold mt-1">{{ product.price }} €</p>

          <!-- Tailles -->
          <div class="text-xs text-gray-500 flex flex-wrap gap-1 mt-1">
            <span v-for="size in product.availableSizes" :key="size" class="px-1 py-0.5 border rounded">{{ size }}</span>
          </div>

          <!-- Couleurs -->
          <div class="text-xs text-gray-500 flex flex-wrap gap-1 mt-1">
            <span v-for="color in product.availableColors" :key="color" class="px-1 py-0.5 border rounded">{{ color }}</span>
          </div>

          <!-- Ajouter au panier -->
          <button
            @click="$emit('add-to-cart', product)"
            class="mt-2 w-full bg-green-600 text-white py-1 rounded hover:bg-green-700 text-xs"
          >
            Ajouter au panier
          </button>
        </div>
      </div>

      <!-- Flèche droite -->
      <button
        @click="scrollRight"
        class="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white/70 p-2 rounded-full shadow z-10"
      >
        ▶
      </button>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";

export default {
  name: "HorizontalSlider",
  props: {
    products: {
      type: Array,
      required: true,
    },
    title: {
      type: String,
      default: "Produits",
    },
  },
  setup() {
    const scrollRef = ref(null);

    const scrollLeft = () => {
      scrollRef.value.scrollBy({ left: -200, behavior: "smooth" });
    };
    const scrollRight = () => {
      scrollRef.value.scrollBy({ left: 200, behavior: "smooth" });
    };

    return { scrollRef, scrollLeft, scrollRight };
  },
};
</script>

<style scoped>
/* Masquer la scrollbar pour mobile */
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
