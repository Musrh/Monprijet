
<template>
  <button @click="testClick">Payer avec Stripe</button>
</template>

<script>
export default {
  methods: {
    testClick() {
      alert("Bouton fonctionne !");
      console.log("Click OK");
    }
  }
}
</script>
