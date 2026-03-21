<template>
  <div class="p-8 text-center">
    <h1 class="text-3xl font-bold text-green-600 mb-4">✅ Paiement réussi !</h1>
    <p class="text-gray-700">Merci pour votre commande. Votre paiement a été enregistré.</p>
    <router-link
      to="/produits"
      class="inline-block mt-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
    >
      Retour aux produits
    </router-link>
  </div>
</template>

<script>
export default {
  name: "Success"
};
</script>

<style scoped>
p { font-size: 1.1rem; }
</style>
