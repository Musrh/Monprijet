<template>
  <div class="p-4 max-w-xl mx-auto text-center">
    <h1 class="text-2xl font-bold text-green-600 mb-4">Paiement réussi ✅</h1>
    <p>Merci pour votre commande !</p>
    <router-link to="/" class="mt-4 inline-block text-blue-600 hover:underline">
      Retour à l'accueil
    </router-link>
  </div>
</template>

<script>
export default {
  name: "Success",
};
</script>

<style scoped>
/* Optionnel : styles simples */
</style>
