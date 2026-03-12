<template>
  <div class="p-4 max-w-3xl mx-auto text-center">
    <h2 class="text-2xl font-bold mb-4">🚀 Produit en 3D</h2>

    <model-viewer
      src="/models/astronaut.glb"
      alt="Astronaute 3D"
      auto-rotate
      camera-controls
      ar
      ar-modes="webxr scene-viewer quick-look"
      shadow-intensity="1"
      class="w-full h-[500px] bg-gray-200 rounded-lg"
    >
    </model-viewer>

    <p class="mt-4 text-gray-600">
      Utilisez votre souris ou vos doigts pour faire pivoter et zoomer sur le modèle.
    </p>
  </div>
</template>

<script>
export default {
  name: "Test3D",
};
</script>

<style scoped>
/* Optionnel : ajoute une ombre autour du modèle */
model-viewer {
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
}
</style>
