<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Menu -->
    <nav class="bg-gray-800 text-white p-4 flex flex-wrap items-center space-x-4">
      <router-link to="/" class="hover:text-yellow-400">Home</router-link>
      <router-link to="/contact" class="hover:text-yellow-400">Contact</router-link>
      <router-link to="/produits" class="hover:text-yellow-400">Produits</router-link>

      <router-link v-if="isAdmin" to="/admin" class="hover:text-yellow-400">Admin</router-link>
      <router-link v-if="!isAuthenticated" to="/login" class="hover:text-yellow-400">Login</router-link>

      <router-link to="/panier" class="hover:text-yellow-400">🛒 ({{ cartItemCount }})</router-link>
      <router-link v-if="isAdmin" to="/admin-commandes" class="hover:text-yellow-400">Admin Commandes</router-link>

      <router-link v-if="isAdmin" to="/upload" class="hover:text-yellow-400">
  Upload Produit
</router-link>

      
      <!-- Utilisateur connecté à droite -->
      <span v-if="isAuthenticated" class="ml-auto flex items-center space-x-2">
        <span>{{ userEmail }}</span>
        <button @click="logout" class="bg-red-500 hover:bg-red-600 px-2 py-1 rounded text-white">Logout</button>
      </span>
    </nav>

    <!-- Debug info (optionnel) -->
    <div class="p-4 text-sm text-gray-700">
      <p>User: {{ $store.state.user }}</p>
      <p>isAdmin: {{ $store.getters.isAdmin }}</p>
    </div>

    <!-- Vue Router -->
    <router-view />
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  computed: {
    ...mapGetters([
      "isAuthenticated",
      "userEmail",
      "isAdmin",
      "cartItemCount"
    ])
  },
  methods: {
    logout() {
      this.$store.dispatch("logout");
      this.$router.push("/");
    }
  }
};
</script>
