<template>
  <div class="p-4 max-w-md mx-auto bg-white rounded-lg shadow-md">
    <h2 class="text-2xl font-bold mb-2">{{ product.nom }}</h2>

    <!-- Image classique -->
    <img
      v-if="product.image"
      :src="product.image"
      :alt="product.nom"
      class="w-full h-64 object-contain mb-4 rounded-lg"
    />

    <!-- Modèle 3D -->
    <model-viewer
      v-if="product.modelUrl"
      :src="product.modelUrl"
      alt="Modèle 3D du produit"
      auto-rotate
      camera-controls
      ar
      ar-modes="webxr scene-viewer quick-look"
      shadow-intensity="1"
      class="w-full h-[400px] bg-gray-200 rounded-lg mb-4"
    ></model-viewer>

    <p class="text-xl font-semibold mb-4">{{ product.prix }} €</p>

    <div class="flex gap-2">
      <button
        @click="addToCart(product)"
        class="flex-1 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
      >
        Ajouter au panier
      </button>
      <button
        @click="buyNow(product)"
        class="flex-1 bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition"
      >
        Acheter maintenant
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "Product3D",
  props: { product: Object },
  methods: {
    addToCart(product) {
      alert(`${product.nom} ajouté au panier !`);
      // ici tu peux faire store.dispatch("addToCart", product)
    },
    buyNow(product) {
      alert(`Achat immédiat de ${product.nom}`);
      // ici tu peux lancer Stripe/PayPal
    },
  },
};
</script>

<style scoped>
model-viewer {
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
}
</style>
