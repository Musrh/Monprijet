<template>
  <div class="min-h-screen bg-gray-100 py-10">

    <h1 class="text-3xl font-bold text-center mb-8">
      {{ titles.contact }}
    </h1>

    <!-- Conteneur -->
    <div class="max-w-6xl mx-auto px-4">

      <!-- Formulaire -->
      <div class="w-full md:w-1/2 md:ml-0 md:mr-auto bg-white p-6 rounded-lg shadow">

        <form @submit.prevent="sendMessage" class="space-y-4">

          <div>
            <label class="block font-semibold mb-1">{{ titles.name }}</label>
            <input
              v-model="form.name"
              type="text"
              class="w-full border rounded px-3 py-2"
              required
            />
          </div>

          <div>
            <label class="block font-semibold mb-1">{{ titles.email }}</label>
            <input
              v-model="form.email"
              type="email"
              class="w-full border rounded px-3 py-2"
              required
            />
          </div>

          <div>
            <label class="block font-semibold mb-1">{{ titles.message }}</label>
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
            {{ titles.send }}
          </button>

        </form>

      </div>

    </div>

  </div>
</template>

<script>
import { db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

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

  computed: {
    // 🔹 Obtenir la langue courante depuis Vuex
    currentLang() {
      return this.$store.getters["language/currentLanguage"];
    },

    // 🔹 Titres et labels selon la langue
    titles() {
      const translations = {
        fr: {
          contact: "Contact",
          name: "Nom",
          email: "Email",
          message: "Message",
          send: "Envoyer"
        },
        en: {
          contact: "Contact",
          name: "Name",
          email: "Email",
          message: "Message",
          send: "Send"
        }
      };
      return translations[this.currentLang] || translations.fr;
    }
  },

  methods: {
    async sendMessage() {
      try {
        await addDoc(collection(db, "contacts"), {
          name: this.form.name,
          email: this.form.email,
          message: this.form.message,
          createdAt: serverTimestamp()
        });

        alert(this.currentLang === "fr" ? "Message envoyé avec succès !" : "Message sent successfully!");

        this.form = {
          name: "",
          email: "",
          message: ""
        };
      } catch (error) {
        console.error("Erreur Firestore:", error);
        alert(this.currentLang === "fr" ? "Erreur lors de l'envoi du message" : "Error sending message");
      }
    }
  }
};
</script>
