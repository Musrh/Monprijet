<template>
  <div
    class="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition duration-300 flex flex-col relative"
  >
    <!-- Badge promo -->
    <span
      v-if="product.promo"
      class="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full z-10"
    >
      -50%
    </span>

    <!-- Image principale -->
    <div class="overflow-hidden h-36">
      <img
        :src="product.images?.[0] || '/placeholder.png'"
        :alt="product.nom"
        class="w-full h-full object-cover group-hover:scale-105 transition duration-300"
      />
    </div>

    <!-- Contenu produit -->
    <div class="p-3 flex flex-col flex-grow">

      <!-- Nom produit -->
      <h3 class="text-sm font-semibold text-gray-800 line-clamp-2 min-h-[40px]">
        {{ product.nom }}
      </h3>

      <!-- Mockups supplémentaires -->
      <div v-if="product.images?.length > 1" class="flex gap-1 mt-1 overflow-x-auto">
        <img
          v-for="(img, idx) in product.images.slice(1, 4)"
          :key="idx"
          :src="img"
          alt="mockup"
          class="w-10 h-10 object-cover rounded"
        />
      </div>

      <!-- Prix -->
      <div class="mt-2 flex items-center gap-2">
        <span v-if="product.promo" class="text-gray-400 line-through text-xs">
          {{ product.prix }} €
        </span>
        <span class="text-lg font-bold text-green-600">
          {{ product.promo ? prixPromo(product.prix) : product.prix }} €
        </span>
      </div>

      <!-- Étoiles fictives -->
      <div class="flex text-yellow-400 text-xs mt-1">
        <span v-for="i in 5" :key="i">
          <i v-if="i <= (product.rating || 4)" class="fas fa-star"></i>
          <i v-else class="far fa-star"></i>
        </span>
      </div>

      <!-- Boutons -->
      <div class="flex mt-2 gap-2">
        <button
          @click="$emit('add-to-cart', product)"
          class="flex-1 bg-black text-white py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition"
        >
          🛒 Ajouter
        </button>

        <button
          @click="favoris = !favoris"
          class="w-10 h-10 flex items-center justify-center border rounded-lg text-gray-600 hover:text-red-500 transition"
        >
          <i :class="favoris ? 'fas fa-heart text-red-500' : 'far fa-heart'"></i>
        </button>
      </div>

    </div>
  </div>
</template>

<script>
export default {
  name: "ProductCard",
  props: ["product"],
  data() {
    return { favoris: false };
  },
  methods: {
    prixPromo(prix) {
      return Math.round(prix * 0.5);
    },
  },
};
</script>

<style scoped>
.group img {
  transition: transform 0.3s;
}
</style>
