<template>
  <div style="padding:20px">

    <h2>Produit en 3D</h2>

    <model-viewer
      src="/models/astronaut.glb"
      auto-rotate
      camera-controls
      style="width:100%; height:400px;">
    </model-viewer>

  </div>
</template>

<script>
export default {
  name: "Test3D"
}
</script>
