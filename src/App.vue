<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Menu -->
    <nav class="bg-white shadow-md sticky top-0 z-50 backdrop-blur-sm">
      <div class="max-w-7xl mx-auto px-6 py-3 flex flex-wrap items-center justify-between">

        <!-- Left: Liens principaux -->
        <div class="flex flex-wrap items-center space-x-4">
          <router-link to="/" class="nav-link">Home</router-link>
          <router-link to="/contact" class="nav-link">Contact</router-link>
          <router-link to="/produits" class="nav-link">Produits</router-link>

          <router-link v-if="isAdmin" to="/admin" class="nav-link">Admin</router-link>
          <router-link v-if="isAdmin" to="/admin-commandes" class="nav-link">Admin-Commandes</router-link>
          <router-link v-if="isAdmin" to="/upload" class="nav-link">UploadProduit</router-link>
          <router-link v-if="isAdmin" to="/adminproduits" class="nav-link">Admin-Produits</router-link>
        </div>

        <!-- Right: Utilisateur / Panier -->
        <div class="flex items-center space-x-4">

          <router-link to="/panier" class="relative nav-link">
            🛒
            <span
              v-if="cartItemCount > 0"
              class="absolute -top-2 -right-3 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
              {{ cartItemCount }}
            </span>
          </router-link>

          <router-link v-if="!isAuthenticated" to="/login" class="cta-btn">Login</router-link>

          <div v-if="isAuthenticated" class="relative" @mouseenter="dropdown=true" @mouseleave="dropdown=false">
            <button class="nav-link font-medium">{{ userEmail }}</button>

            <div v-if="dropdown" class="absolute right-0 mt-2 w-36 bg-white rounded-xl shadow-lg border border-gray-100 py-2">
              <button @click="logout" class="dropdown-item text-red-500 w-full text-left">Logout</button>
            </div>
          </div>

        </div>

      </div>
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
  data() {
    return {
      dropdown: false
    };
  },
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
      this.dropdown = false;
      this.$store.dispatch("logout");
      this.$router.push("/");
    }
  }
};
</script>

<style>
.nav-link {
  @apply text-gray-600 hover:text-black font-medium transition;
}

.cta-btn {
  @apply px-4 py-2 bg-gradient-to-r from-indigo-600 to-blue-600 
         text-white rounded-lg font-medium shadow-md 
         hover:shadow-lg hover:scale-105 transition-all duration-200;
}

.dropdown-item {
  @apply block px-4 py-2 text-gray-700 hover:bg-gray-50 transition text-sm;
}
</style>
