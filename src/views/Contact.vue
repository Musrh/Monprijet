<template>
  <div class="p-6 max-w-md mx-auto bg-white rounded-lg shadow-md">
    <h1 class="text-2xl font-bold mb-4 text-center">📬 Contactez-nous</h1>

    <form @submit.prevent="submitForm" class="space-y-4">

      <!-- Nom -->
      <div>
        <label class="block mb-1 font-medium">Nom</label>
        <input
          v-model="form.name"
          type="text"
          placeholder="Votre nom"
          class="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
          required
        />
      </div>

      <!-- Email -->
      <div>
        <label class="block mb-1 font-medium">Email</label>
        <input
          v-model="form.email"
          type="email"
          placeholder="Votre email"
          class="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
          required
        />
      </div>

      <!-- Sujet -->
      <div>
        <label class="block mb-1 font-medium">Sujet</label>
        <input
          v-model="form.subject"
          type="text"
          placeholder="Sujet de votre message"
          class="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
          required
        />
      </div>

      <!-- Message -->
      <div>
        <label class="block mb-1 font-medium">Message</label>
        <textarea
          v-model="form.message"
          placeholder="Votre message"
          rows="5"
          class="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
          required
        ></textarea>
      </div>

      <!-- Bouton -->
      <div class="text-center">
        <button
          type="submit"
          class="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
        >
          Envoyer
        </button>
      </div>

    </form>

    <!-- Message de confirmation -->
    <p v-if="success" class="mt-4 text-green-600 text-center font-semibold">
      ✅ Votre message a été envoyé. Nous vous répondrons bientôt !
    </p>

  </div>
</template>

<script>
export default {
  name: "Contact",
  data() {
    return {
      form: {
        name: "",
        email: "",
        subject: "",
        message: "",
      },
      success: false,
    };
  },
  methods: {
    submitForm() {
      // Ici tu peux envoyer les données via API / Firebase / Email service
      console.log("Formulaire envoyé :", this.form);

      // Pour démo, on simule l'envoi
      this.success = true;

      // Réinitialiser le formulaire
      this.form = { name: "", email: "", subject: "", message: "" };
    },
  },
};
</script>

<style scoped>
/* Optionnel : styles supplémentaires pour mobile et desktop */
</style>
