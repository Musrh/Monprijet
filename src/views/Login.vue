<template>
  <div class="p-4 max-w-md mx-auto md:mx-0">
    <h2 class="text-2xl font-bold mb-4">Authentication</h2>

    <!-- Message succès et Logout si connecté -->
    <div v-if="isAuthenticated" class="mb-4">
      <p class="text-green-600 font-semibold mb-2">Connexion réussie !</p>
      <span class="mr-2">Connecté en tant que {{ userEmail }}</span>

      <button
        @click="logout"
        class="bg-red-500 text-white px-4 py-2 rounded"
      >
        Logout
      </button>
    </div>

    <!-- Register -->
    <div v-if="!isAuthenticated" class="mb-6">
      <h3 class="text-xl font-semibold mb-2">Register</h3>

      <input
        v-model="regEmail"
        placeholder="Email"
        class="border p-2 w-full mb-2"
      />

      <input
        v-model="regPassword"
        type="password"
        placeholder="Password"
        class="border p-2 w-full mb-2"
      />

      <button
        @click="register"
        class="bg-green-500 text-white px-4 py-2 rounded"
      >
        Register
      </button>
    </div>

    <hr class="my-4" v-if="!isAuthenticated" />

    <!-- Login -->
    <div v-if="!isAuthenticated">
      <h3 class="text-xl font-semibold mb-2">Login</h3>

      <input
        v-model="logEmail"
        placeholder="Email"
        class="border p-2 w-full mb-2"
      />

      <input
        v-model="logPassword"
        type="password"
        placeholder="Password"
        class="border p-2 w-full mb-2"
      />

      <button
        @click="login"
        class="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Login
      </button>

<p class="mt-2">
  Mot de passe oublié ? 
  <router-link class="text-blue-500 underline" to="/password-reset">Cliquez ici</router-link>
</p>

      
    </div>

    <!-- Message info -->
    <p v-if="message" class="text-green-600 mt-2">
      {{ message }}
    </p>

    <!-- Message erreur -->
    <p v-if="error" class="text-red-600 mt-2">
      {{ error }}
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
    ...mapGetters(["isAuthenticated", "userEmail"])
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
          "📧 Un email de vérification a été envoyé. Vérifiez votre boîte mail avant de vous connecter.";

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
