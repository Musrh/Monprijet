<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Menu -->
    <nav class="bg-gray-800 text-white p-4 flex flex-wrap items-center justify-between">

      <!-- Left: Liens principaux -->
      <div class="flex flex-wrap items-center space-x-4">
        <router-link to="/" class="menu-item">Home</router-link>
        <router-link to="/contact" class="menu-item">Contact</router-link>
        <router-link to="/produits" class="menu-item">Produits</router-link>

        <!-- Admin Dropdown -->
        <div v-if="isAdmin" class="relative" @mouseenter="adminDropdown=true" @mouseleave="adminDropdown=false">
          <button class="menu-item flex items-center gap-1">
            Admin
            <svg class="w-4 h-4 opacity-60 transition-transform"
                 :class="{'rotate-180': adminDropdown}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M19 9l-7 7-7-7"></path>
            </svg>
          </button>

          <div v-if="adminDropdown"
               class="absolute left-0 mt-2 w-48 bg-white text-gray-800 rounded-xl shadow-lg border border-gray-200 py-2 z-50">
            <router-link @click="adminDropdown=false" to="/admin" class="dropdown-item">Admin (Utilisateurs)</router-link>
            <router-link @click="adminDropdown=false" to="/adminproduits" class="dropdown-item">Admin-Produits</router-link>
            <router-link @click="adminDropdown=false" to="/admin-commandes" class="dropdown-item">Admin-Commandes</router-link>
            <router-link @click="adminDropdown=false" to="/upload" class="dropdown-item">UploadProduit</router-link>
          </div>
        </div>
      </div>

      <!-- Right: User info + Logout + Panier -->
      <div class="flex items-center space-x-4">

        <!-- Panier -->
        <router-link to="/panier" class="menu-item relative">
          🛒
          <span v-if="cartItemCount > 0"
                class="absolute -top-2 -right-3 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
            {{ cartItemCount }}
          </span>
        </router-link>

        <!-- Login -->
        <router-link v-if="!isAuthenticated" to="/login" class="menu-item">
          Login
        </router-link>

        <!-- Logout + User visible -->
        <template v-if="isAuthenticated">
          <span class="menu-item">{{ userEmail }}</span>
          <button @click="logout" class="menu-item text-red-500">Logout</button>
        </template>

      </div>
    </nav>

    <!-- Vue Router -->
    <router-view />
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  computed: {
    ...mapGetters(["isAuthenticated", "userEmail", "isAdmin", "cartItemCount"])
  },
  data() {
    return {
      adminDropdown: false
    };
  },
  methods: {
    logout() {
      this.adminDropdown = false;
      this.$store.dispatch("logout");
      this.$router.push("/");
    }
  }
};
</script>

<style>
/* Style uniforme pour tous les items du menu (Admin inclus) */
.menu-item {
  @apply text-gray-100 hover:text-yellow-400 font-medium px-3 py-1 rounded transition;
}

/* Dropdown Admin */
.dropdown-item {
  @apply block px-4 py-2 text-gray-800 hover:bg-gray-100 transition text-sm;
}

/* Badge Panier */
.bg-red-500 {
  background-color: #ef4444;
}
.text-red-500 {
  color: #ef4444;
}
.text-red-500:hover {
  color: #dc2626;
}

/* Pour les transitions */
.hover\:text-yellow-400:hover {
  color: #facc15;
}
</style>
