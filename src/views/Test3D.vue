<template>
  <div class="p-4 max-w-3xl mx-auto text-center">
    <h1 class="text-2xl font-bold mb-4">🚀 Test Produit 3D</h1>

    <!-- Appel du composant Product3D -->
    <Product3D :product="astronaut" />
  </div>
</template>

<script>
import Product3D from "../components/Product3D.vue";

export default {
  name: "Test3D",
  components: { Product3D },
  data() {
    return {
      astronaut: {
        nom: "Astronaute 3D",
        prix: 49.99,
        image: "/images/astronaut.png",   // ton image classique
        modelUrl: "/models/Astronaut.glb" // ton modèle 3D
      }
    };
  }
};
</script>
