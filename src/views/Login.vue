<template>
  <div class="p-4 max-w-md mx-auto md:mx-0 bg-white shadow rounded-xl">
    
    <h2 class="text-2xl font-bold mb-6 text-center">
      {{ currentLang === "fr" ? "Authentification" : "Authentication" }}
    </h2>

    <!-- CONNECTÉ -->
    <div v-if="isAuthenticated" class="mb-4 text-center">
      <p class="text-green-600 font-semibold mb-2">
        {{ currentLang === "fr" ? "Connexion réussie !" : "Login successful!" }}
      </p>

      <p class="mb-3">
        {{ currentLang === "fr" ? "Connecté en tant que" : "Logged in as" }}
        <span class="font-semibold">{{ userEmail }}</span>
      </p>

      <button
        @click="logout"
        class="bg-red-500 hover:bg-red-600 transition text-white px-4 py-2 rounded w-full"
      >
        {{ currentLang === "fr" ? "Se déconnecter" : "Logout" }}
      </button>
    </div>

    <!-- REGISTER -->
    <div v-if="!isAuthenticated" class="mb-6">
      <h3 class="text-xl font-semibold mb-3">
        {{ currentLang === "fr" ? "Créer un compte" : "Register" }}
      </h3>

      <input
        v-model="regEmail"
        type="email"
        :placeholder="currentLang === 'fr' ? 'Email' : 'Email'"
        class="border p-2 w-full mb-3 rounded"
      />

      <input
        v-model="regPassword"
        type="password"
        :placeholder="currentLang === 'fr' ? 'Mot de passe' : 'Password'"
        class="border p-2 w-full mb-3 rounded"
      />

      <button
        @click="register"
        class="bg-green-500 hover:bg-green-600 transition text-white px-4 py-2 rounded w-full"
      >
        {{ currentLang === "fr" ? "S'inscrire" : "Register" }}
      </button>
    </div>

    <hr class="my-4" v-if="!isAuthenticated" />

    <!-- LOGIN -->
    <div v-if="!isAuthenticated">
      <h3 class="text-xl font-semibold mb-3">
        {{ currentLang === "fr" ? "Connexion" : "Login" }}
      </h3>

      <input
        v-model="logEmail"
        type="email"
        :placeholder="currentLang === 'fr' ? 'Email' : 'Email'"
        class="border p-2 w-full mb-3 rounded"
      />

      <input
        v-model="logPassword"
        type="password"
        :placeholder="currentLang === 'fr' ? 'Mot de passe' : 'Password'"
        class="border p-2 w-full mb-3 rounded"
      />

      <button
        @click="login"
        class="bg-blue-500 hover:bg-blue-600 transition text-white px-4 py-2 rounded w-full"
      >
        {{ currentLang === "fr" ? "Se connecter" : "Login" }}
      </button>

      <p class="mt-3 text-sm text-center">
        {{ currentLang === "fr" ? "Mot de passe oublié ?" : "Forgot password?" }}
        <router-link
          class="text-blue-500 underline ml-1"
          to="/password-reset"
        >
          {{ currentLang === "fr" ? "Cliquez ici" : "Click here" }}
        </router-link>
      </p>
    </div>

    <!-- MESSAGE SUCCESS -->
    <p v-if="message" class="text-green-600 mt-4 text-center">
      {{ message }}
    </p>

    <!-- MESSAGE ERREUR -->
    <p v-if="error" class="text-red-600 mt-4 text-center">
      {{ formattedError }}
    </p>

  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      regEmail: "",
      regPassword: "",
      logEmail: "",
      logPassword: "",
      error: "",
      message: ""
    };
  },

  computed: {
    ...mapGetters(["isAuthenticated", "userEmail"]),
    
    currentLang() {
      return this.$store.getters["language/currentLanguage"];
    },

    // 🔥 Nettoyage des erreurs Firebase
    formattedError() {
      if (!this.error) return "";

      if (this.error.includes("auth/email-already-in-use"))
        return this.currentLang === "fr"
          ? "Cet email est déjà utilisé."
          : "Email already in use.";

      if (this.error.includes("auth/invalid-credential"))
        return this.currentLang === "fr"
          ? "Email ou mot de passe incorrect."
          : "Invalid email or password.";

      return this.error;
    }
  },

  methods: {
    async register() {
      this.error = "";
      this.message = "";

      try {
        await this.$store.dispatch("register", {
          email: this.regEmail,
          password: this.regPassword
        });

        this.message =
          this.currentLang === "fr"
            ? "📧 Email de vérification envoyé. Vérifiez votre boîte mail."
            : "📧 Verification email sent. Check your inbox.";

        this.regEmail = "";
        this.regPassword = "";

      } catch (err) {
        this.error = err.message;
      }
    },

    async login() {
      this.error = "";
      this.message = "";

      try {
        await this.$store.dispatch("login", {
          email: this.logEmail,
          password: this.logPassword
        });

      } catch (err) {
        this.error = err.message;
      }
    },

    logout() {
      this.$store.dispatch("logout");
    }
  }
};
</script>
