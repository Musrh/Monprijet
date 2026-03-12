<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold mb-4">🚀 Produit en 3D</h1>

    <!-- Affiche l’astronaute -->
    <Product3D :product="astronaut" />
  </div>
</template>

<script>
import Product3D from "../components/Product3D.vue";

export default {
  components: { Product3D },
  data() {
    return {
      astronaut: {
        nom: "Astronaute 3D",
        prix: 49.99,
        modelUrl: "/models/Astronaut.glb"
      }
    };
  }
};
</script>
