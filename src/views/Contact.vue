<template>
  <div class="min-h-screen bg-gray-100 py-10">

    <h1 class="text-3xl font-bold text-center mb-8">
      Contact
    </h1>

    <!-- Conteneur -->
    <div class="max-w-6xl mx-auto px-4">

      <!-- Formulaire -->
      <div class="w-full md:w-1/2 md:ml-0 md:mr-auto bg-white p-6 rounded-lg shadow">

        <form @submit.prevent="sendMessage" class="space-y-4">

          <div>
            <label class="block font-semibold mb-1">Nom</label>
            <input
              v-model="form.name"
              type="text"
              class="w-full border rounded px-3 py-2"
              required
            />
          </div>

          <div>
            <label class="block font-semibold mb-1">Email</label>
            <input
              v-model="form.email"
              type="email"
              class="w-full border rounded px-3 py-2"
              required
            />
          </div>

          <div>
            <label class="block font-semibold mb-1">Message</label>
            <textarea
              v-model="form.message"
              rows="4"
              class="w-full border rounded px-3 py-2"
              required
            ></textarea>
          </div>

          <button
            type="submit"
            class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Envoyer
          </button>

        </form>

      </div>

    </div>

  </div>
</template>

<script>
import { db } from "../firebase"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"

export default {
  data() {
    return {
      form: {
        name: "",
        email: "",
        message: ""
      }
    };
  },

  methods: {

    async sendMessage() {

      try {

        await addDoc(collection(db, "contacts"), {
          name: this.form.name,
          email: this.form.email,
          message: this.form.message,
          createdAt: serverTimestamp()
        })

        alert("Message envoyé avec succès !")

        this.form = {
          name: "",
          email: "",
          message: ""
        }

      } catch (error) {

        console.error("Erreur Firestore:", error)
        alert("Erreur lors de l'envoi du message")

      }

    }

  }
}
</script>
