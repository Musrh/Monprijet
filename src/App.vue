<template>
  <div class="min-h-screen bg-gray-100">

    <!-- Menu principal -->
    <nav class="bg-gray-800 p-4 flex items-center justify-between">
      
      <!-- Left: liens principaux -->
      <div class="flex items-center space-x-2">
        <router-link to="/" class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition">Home</router-link>
        <router-link to="/contact" class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition">Contact</router-link>
        <router-link to="/produits" class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition">Produits</router-link>

        <!-- Admin Dropdown -->
        <div v-if="isAdmin" class="relative" @mouseenter="adminDropdown=true" @mouseleave="adminDropdown=false">
          <button class="bg-green-600 text-white px-4 py-2 rounded flex items-center gap-1 hover:bg-green-700 transition">
            Admin
            <svg class="w-4 h-4 opacity-60 transition-transform" :class="{'rotate-180': adminDropdown}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </button>

          <div v-if="adminDropdown" class="absolute left-0 mt-2 w-48 bg-white text-gray-800 rounded-xl shadow-lg border border-gray-200 py-2 z-50">
            <router-link @click="adminDropdown=false" to="/admin" class="block px-4 py-2 hover:bg-gray-100">Admin (Utilisateurs)</router-link>
            <router-link @click="adminDropdown=false" to="/adminproduits" class="block px-4 py-2 hover:bg-gray-100">Admin-Produits</router-link>
            <router-link @click="adminDropdown=false" to="/admin-commandes" class="block px-4 py-2 hover:bg-gray-100">Admin-Commandes</router-link>
            <router-link @click="adminDropdown=false" to="/upload" class="block px-4 py-2 hover:bg-gray-100">UploadProduit</router-link>
          </div>
        </div>
      </div>

      <!-- Right: ThemeSwitcher + Panier + Login/Logout -->
      <div class="flex items-center space-x-2">
        <!-- ThemeSwitcher Dropdown -->
        <ThemeSwitcher />

        <!-- Panier -->
        <router-link to="/panier" class="bg-green-600 text-white px-4 py-2 rounded relative hover:bg-green-700 transition">
          🛒
          <span v-if="cartItemCount > 0" class="absolute -top-2 -right-3 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
            {{ cartItemCount }}
          </span>
        </router-link>

        <!-- Login / Logout -->
        <router-link v-if="!isAuthenticated" to="/login" class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition">
          Login
        </router-link>

        <template v-if="isAuthenticated">
          <span class="bg-green-600 text-white px-4 py-2 rounded transition">{{ userEmail }}</span>
          <button @click="logout" class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition">Logout</button>
        </template>
      </div>
    </nav>

    <!-- Contenu principal -->
    <router-view />

    <!-- Optionnel : Vitrine sans image -->
    <!-- <Vitrine /> --> 

  </div>
</template>

<script>
import { mapGetters } from "vuex";
import ThemeSwitcher from './components/ThemeSwitcher.vue';
// import Vitrine from './components/Vitrine.vue'; // Plus besoin si pas d'image

export default {
  components: { ThemeSwitcher },
  data() {
    return {
      adminDropdown: false
    };
  },
  computed: {
    ...mapGetters(["isAuthenticated", "userEmail", "isAdmin", "cartItemCount"])
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

<style scoped>
/* Ajuster les styles si nécessaire */
</style>
