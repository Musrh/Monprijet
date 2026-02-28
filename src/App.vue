<template>
  <div class="min-h-screen bg-gray-100">
    
    <!-- NAVBAR -->
    <nav class="bg-white shadow-md">
      <div class="max-w-7xl mx-auto px-4">
        <div class="flex justify-between items-center h-16">

          <!-- Logo / Left -->
          <div class="flex items-center space-x-6">
            <router-link 
              to="/" 
              class="text-xl font-bold text-gray-800 hover:text-blue-600 transition">
              EasyShopping
            </router-link>

            <router-link to="/produits" class="nav-link">
              Produits
            </router-link>

            <router-link to="/contact" class="nav-link">
              Contact
            </router-link>

            <router-link 
              v-if="isAdmin" 
              to="/admin" 
              class="nav-link text-indigo-600 font-medium">
              Admin
            </router-link>
          </div>

          <!-- Right Section -->
          <div class="flex items-center space-x-4">

            <!-- Panier -->
            <router-link 
              to="/panier" 
              class="relative nav-link">

              🛒
              <span
                v-if="cartItemCount > 0"
                class="absolute -top-2 -right-3 bg-red-500 text-white 
                       text-xs px-2 py-0.5 rounded-full">
                {{ cartItemCount }}
              </span>
            </router-link>

            <!-- Login -->
            <router-link
              v-if="!isAuthenticated"
              to="/login"
              class="btn-primary">
              Login
            </router-link>

            <!-- User -->
            <div 
              v-if="isAuthenticated"
              class="flex items-center space-x-3">

              <span class="text-sm text-gray-600 font-medium">
                {{ userEmail }}
              </span>

              <button
                @click="logout"
                class="btn-danger">
                Logout
              </button>
            </div>

          </div>
        </div>
      </div>
    </nav>

    <!-- Debug (optionnel, plus discret) -->
    <div class="max-w-7xl mx-auto px-4 mt-4 text-xs text-gray-400">
      <p>User: {{ $store.state.user }}</p>
      <p>isAdmin: {{ $store.getters.isAdmin }}</p>
    </div>

    <!-- Router View -->
    <div class="max-w-7xl mx-auto px-4 py-6">
      <router-view />
    </div>

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

<style>
/* Liens navbar */
.nav-link {
  @apply text-gray-600 hover:text-blue-600 transition duration-200 font-medium;
}

/* Bouton principal */
.btn-primary {
  @apply px-4 py-2 bg-blue-600 text-white rounded-lg 
         hover:bg-blue-700 transition duration-200 
         shadow-sm hover:shadow-md;
}

/* Bouton danger */
.btn-danger {
  @apply px-4 py-2 bg-red-500 text-white rounded-lg 
         hover:bg-red-600 transition duration-200 
         shadow-sm hover:shadow-md;
}
</style>
