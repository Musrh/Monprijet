<template>
  <div class="p-6 max-w-xl mx-auto text-center">
    <h1 class="text-3xl font-bold text-green-600 mb-4">✅ Paiement réussi !</h1>
    <p class="mb-2">Merci pour votre commande.</p>
    <p v-if="sessionId">ID de session : <strong>{{ sessionId }}</strong></p>
    <router-link to="/" class="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
      Retour à l'accueil
    </router-link>
  </div>
</template>

<script>
export default {
  data() {
    return {
      sessionId: null,
    };
  },
  mounted() {
    // Récupère le paramètre session_id depuis l'URL hash
    const query = new URLSearchParams(window.location.hash.split('?')[1]);
    this.sessionId = query.get('session_id');
  },
};
</script>

<style scoped>
p { font-size: 1.1rem; }
</style>
