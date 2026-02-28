<template>
  <div class="min-h-screen bg-gray-100">

    <!-- NAVBAR -->
    <nav class="bg-white shadow-md">
      <div class="max-w-7xl mx-auto px-4">
        <div class="flex justify-between items-center h-16">

          <!-- Logo -->
          <router-link 
            to="/" 
            class="text-xl font-bold text-gray-800 hover:text-blue-600 transition">
            EasyShopping
          </router-link>

          <!-- Desktop Menu -->
          <div class="hidden md:flex items-center space-x-6">

            <router-link to="/produits" class="nav-link">Produits</router-link>
            <router-link to="/contact" class="nav-link">Contact</router-link>

            <router-link v-if="isAdmin" to="/admin" class="nav-link">
              Admin
            </router-link>

            <!-- Panier -->
            <router-link to="/panier" class="relative nav-link">
              🛒
              <span
                v-if="cartItemCount > 0"
                class="absolute -top-2 -right-3 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
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
            <div v-if="isAuthenticated" class="flex items-center space-x-3">
              <span class="text-sm text-gray-600">
                {{ userEmail }}
              </span>
              <button @click="logout" class="btn-danger">
                Logout
              </button>
            </div>
          </div>

          <!-- Hamburger Button -->
          <button
            @click="mobileOpen = !mobileOpen"
            class="md:hidden text-gray-700 focus:outline-none">

            <svg
              v-if="!mobileOpen"
              class="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16" />
            </svg>

            <svg
              v-else
              class="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M6 18L18 6M6 6l12 12" />
            </svg>

          </button>

        </div>
      </div>

      <!-- Mobile Menu -->
      <div v-if="mobileOpen" class="md:hidden bg-white border-t">

        <div class="px-4 py-4 space-y-3">

          <router-link @click="mobileOpen=false" to="/produits" class="mobile-link">
            Produits
          </router-link>

          <router-link @click="mobileOpen=false" to="/contact" class="mobile-link">
            Contact
          </router-link>

          <router-link
            v-if="isAdmin"
            @click="mobileOpen=false"
            to="/admin"
            class="mobile-link">
            Admin
          </router-link>

          <router-link
            @click="mobileOpen=false"
            to="/panier"
            class="mobile-link">
            Panier ({{ cartItemCount }})
          </router-link>

          <router-link
            v-if="!isAuthenticated"
            @click="mobileOpen=false"
            to="/login"
            class="btn-primary w-full text-center">
            Login
          </router-link>

          <div v-if="isAuthenticated" class="space-y-2">
            <p class="text-sm text-gray-500">
              {{ userEmail }}
            </p>
            <button
              @click="logout"
              class="btn-danger w-full">
              Logout
            </button>
          </div>

        </div>
      </div>
    </nav>

    <router-view />
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      mobileOpen: false
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
      this.mobileOpen = false;
      this.$store.dispatch("logout");
      this.$router.push("/");
    }
  }
};
</script>

<style>
.nav-link {
  @apply text-gray-600 hover:text-blue-600 transition font-medium;
}

.mobile-link {
  @apply block text-gray-700 font-medium hover:text-blue-600 transition;
}

.btn-primary {
  @apply px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition;
}

.btn-danger {
  @apply px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition;
}
</style>
