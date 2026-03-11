<template>
  <div class="p-4 max-w-md mx-auto md:mx-0">
    <h2 class="text-2xl font-bold mb-4">Réinitialisation du mot de passe</h2>

    <p class="mb-4">
      Entrez votre email pour recevoir un lien permettant de réinitialiser votre mot de passe.
    </p>

    <input
      v-model="email"
      type="email"
      placeholder="Votre email"
      class="border p-2 w-full mb-4"
    />

    <button
      @click="sendResetEmail"
      class="bg-blue-500 text-white px-4 py-2 rounded w-full"
      :disabled="loading"
    >
      {{ loading ? "Envoi..." : "Envoyer le lien" }}
    </button>

    <p v-if="message" class="text-green-600 mt-2">{{ message }}</p>
    <p v-if="error" class="text-red-600 mt-2">{{ error }}</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      email: "",
      message: "",
      error: "",
      loading: false
    };
  },
  methods: {
    async sendResetEmail() {
      this.message = "";
      this.error = "";
      this.loading = true;

      try {
        await this.$store.dispatch("resetPassword", this.email);
        this.message = "📧 Un email a été envoyé. Vérifiez votre boîte de réception.";
        this.email = "";
      } catch (err) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>

<style scoped>
/* Optionnel : centrer le formulaire en mode desktop */
@media (min-width: 768px) {
  div {
    margin-left: 0;
  }
}
</style>
