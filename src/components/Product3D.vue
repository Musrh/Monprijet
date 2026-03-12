<template>
  <div class="p-4 max-w-md mx-auto bg-white rounded-lg shadow-lg">
    <h2 class="text-xl font-bold mb-2">{{ product.nom }}</h2>
    <p class="text-gray-700 mb-4">Prix : €{{ product.prix }}</p>

    <!-- Modèle 3D -->
    <model-viewer
      :src="product.modelUrl"
      alt="Produit 3D"
      auto-rotate
      camera-controls
      ar
      ar-modes="webxr scene-viewer quick-look"
      shadow-intensity="1"
      class="w-full h-[400px] mb-4 bg-gray-200 rounded-lg"
    ></model-viewer>

    <!-- Boutons -->
    <div class="flex justify-between">
      <button
        @click="addToCart(product)"
        class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Ajouter au panier
      </button>
      <button
        @click="checkout(product)"
        class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
      >
        Acheter maintenant
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "Product3D",
  data() {
    return {
      product: {
        nom: "Astronaute 3D",
        prix: 49.99,
        modelUrl: "/models/Astronaut.glb", // chemin dans public/
      },
    };
  },
  methods: {
    addToCart(product) {
      console.log("Produit ajouté au panier:", product.nom);
      // Ici tu peux appeler ton store Vuex pour gérer le panier
    },
    async checkout(product) {
      console.log("Checkout Stripe ou PayPal pour:", product.nom);
      // Ici tu peux appeler ton backend pour créer une session Stripe ou PayPal
    },
  },
};
</script>

<style scoped>
model-viewer {
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
}
</style>
