<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Menu -->
    <nav class="bg-gray-800 p-4 flex flex-wrap items-center justify-between">

      <!-- Left: Liens principaux -->
      <div class="flex flex-wrap items-center space-x-2">
        <router-link to="/" class="menu-btn">Home</router-link>
        <router-link to="/contact" class="menu-btn">Contact</router-link>
        <router-link to="/produits" class="menu-btn">Produits</router-link>

        <!-- Admin Dropdown -->
        <div v-if="isAdmin" class="relative" @mouseenter="adminDropdown=true" @mouseleave="adminDropdown=false">
          <button class="menu-btn flex items-center gap-1">
            Admin
            <svg class="w-4 h-4 opacity-60 transition-transform" :class="{'rotate-180': adminDropdown}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
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

      <!-- Right: Panier + Login / Logout + User -->
      <div class="flex items-center space-x-2">
        <router-link to="/panier" class="menu-btn relative">
          🛒
          <span v-if="cartItemCount > 0" class="absolute -top-2 -right-3 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
            {{ cartItemCount }}
          </span>
        </router-link>

        <!-- Login -->
        <router-link v-if="!isAuthenticated" to="/login" class="menu-btn">
          Login
        </router-link>

        <!-- Logout + User visible -->
        <template v-if="isAuthenticated">
          <span class="menu-btn">{{ userEmail }}</span>
          <button @click="logout" class="menu-btn bg-red-500 hover:bg-red-600">Logout</button>
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
/* Boutons verts avec texte blanc, arrondi et hover */
.menu-btn {
  background-color: #16a34a; /* vert */
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-weight: 500;
  transition: background-color 0.2s, transform 0.2s;
}
.menu-btn:hover {
  background-color: #15803d; /* vert plus foncé au hover */
  transform: scale(1.05);
}

/* Dropdown Admin */
.dropdown-item {
  display: block;
  padding: 0.5rem 1rem;
  color: #1f2937;
  transition: background-color 0.2s;
}
.dropdown-item:hover {
  background-color: #f3f4f6;
}

/* Badge Panier */
.bg-red-500 {
  background-color: #ef4444;
}
</style>
