<template>
  <div class="p-4 max-w-md mx-auto text-center">
    <h1 class="text-2xl mb-4 text-green-600">Paiement réussi ✅</h1>
    <p v-if="sessionId">
      Merci pour votre commande !<br>
      ID de session Stripe : <strong>{{ sessionId }}</strong>
    </p>
    <p v-else class="text-red-500">
      Aucun identifiant de session trouvé.
    </p>

    <router-link to="/" class="mt-6 inline-block text-blue-500 hover:underline">
      ← Retour à l’accueil
    </router-link>
  </div>
</template>

<script>
export default {
  computed: {
    sessionId() {
      return this.$route.query.session_id || null;
    }
  }
}
</script>

<style scoped>
p { font-size: 1.1rem; margin-top: 1rem; }
</style>
