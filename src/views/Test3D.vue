<template>
  <div class="p-4 max-w-3xl mx-auto text-center">
    <h2 class="text-2xl font-bold mb-4">🚀 Produit en 3D</h2>

    <model-viewer
      src="/models/Astronaut.glb"
      alt="Astronaute 3D"
      auto-rotate
      camera-controls
      ar
      ar-modes="webxr scene-viewer quick-look"
      shadow-intensity="1"
      class="w-full h-[50vh] sm:h-[500px] bg-gray-200 rounded-lg"
    >
    </model-viewer>

    <p class="mt-4 text-gray-600 text-sm sm:text-base">
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
/* Ombre et léger effet sur le modèle */
model-viewer {
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  border-radius: 12px;
}

/* Pour s'assurer que ça reste responsive sur mobile */
@media (max-width: 640px) {
  model-viewer {
    height: 60vh;
  }
}
</style>
