<template>
  <div class="p-4 max-w-3xl mx-auto text-center">
    <h1 class="text-3xl font-bold mb-6">🚀 Produit 3D à tester</h1>

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
        image: "/images/astronaut.png",
        modelUrl: "/models/Astronaut.glb"
      }
    };
  },
};
</script>
