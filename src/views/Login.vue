<template>
  <div class="p-4 max-w-md mx-auto">
    <h2 class="text-2xl font-bold mb-4">Authentication</h2>

    <!-- Register -->
    <div class="mb-6">
      <h3 class="text-xl font-semibold mb-2">Register</h3>
      <input v-model="regEmail" placeholder="Email" class="border p-2 w-full mb-2 rounded" />
      <input v-model="regPassword" type="password" placeholder="Password" class="border p-2 w-full mb-2 rounded" />
      <button @click="register" class="bg-green-500 text-white px-4 py-2 rounded">Register</button>
    </div>

    <hr class="my-6" />

    <!-- Login -->
    <div>
      <h3 class="text-xl font-semibold mb-2">Login</h3>
      <input v-model="logEmail" placeholder="Email" class="border p-2 w-full mb-2 rounded" />
      <input v-model="logPassword" type="password" placeholder="Password" class="border p-2 w-full mb-2 rounded" />
      <button @click="login" class="bg-blue-500 text-white px-4 py-2 rounded">Login</button>
    </div>

    <p v-if="error" class="text-red-600 mt-4">{{ error }}</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      regEmail: "",
      regPassword: "",
      logEmail: "",
      logPassword: "",
      error: ""
    };
  },
  methods: {
    async register() {
      this.error = "";
      try {
        await this.$store.dispatch("register", {
          email: this.regEmail,
          password: this.regPassword
        });
        this.$router.push("/dashboard");
      } catch (err) {
        this.error = err.message;
      }
    },

    async login() {
      this.error = "";
      try {
        const { role, isActive } = await this.$store.dispatch("login", {
          email: this.logEmail,
          password: this.logPassword
        });

        if (!isActive) {
          this.error = "Votre compte est désactivé ❌";
          return;
        }

        // Redirection selon rôle
        if (role === "admin") {
          this.$router.push("/admin");
        } else {
          this.$router.push("/dashboard");
        }
      } catch (err) {
        this.error = err.message;
      }
    }
  }
};
</script>

<style scoped>
input {
  display: block;
}
button:hover {
  opacity: 0.8;
  cursor: pointer;
}
</style>
