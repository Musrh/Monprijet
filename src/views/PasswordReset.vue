<template>
  <div class="p-4 max-w-md mx-auto md:mx-0">
    <h2 class="text-2xl font-bold mb-4">Réinitialisation du mot de passe</h2>

    <div class="mb-4">
      <input
        v-model="email"
        type="email"
        placeholder="Votre email"
        class="border p-2 w-full mb-2 rounded"
      />
      <button
        @click="resetPassword"
        class="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded w-full"
      >
        Envoyer lien
      </button>
    </div>

    <!-- Messages -->
    <p v-if="message" class="text-green-600 mt-2">{{ message }}</p>
    <p v-if="error" class="text-red-600 mt-2">{{ error }}</p>

    <!-- Lien retour login -->
    <p class="mt-4 text-sm">
      Retour à la page de 
      <router-link class="text-blue-500 underline" to="/login">connexion</router-link>
    </p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      email: "",
      message: "",
      error: ""
    };
  },
  methods: {
    async resetPassword() {
      this.message = "";
      this.error = "";
      if (!this.email) {
        this.error = "Veuillez entrer votre email.";
        return;
      }
      try {
        // Appel à l'action store pour envoyer email de réinitialisation
        await this.$store.dispatch("resetPassword", this.email);
        this.message = "📧 Lien de réinitialisation envoyé à votre email.";
        this.email = "";
      } catch (err) {
        this.error = err.message;
      }
    }
  }
};
</script>

<style scoped>
input {
  outline: none;
}
button {
  transition: background 0.2s;
}
</style>
