<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Menu -->
    <nav class="bg-gray-800 text-white p-4 flex flex-wrap items-center justify-between">

      <!-- Left: Liens principaux -->
      <div class="flex flex-wrap items-center space-x-4">
        <router-link to="/" class="hover:text-yellow-400">Home</router-link>
        <router-link to="/contact" class="hover:text-yellow-400">Contact</router-link>
        <router-link to="/produits" class="hover:text-yellow-400">Produits</router-link>

        <!-- Admin Dropdown -->
        <div v-if="isAdmin" class="relative" @mouseenter="adminDropdown=true" @mouseleave="adminDropdown=false">
          <button class="hover:text-yellow-400 font-medium flex items-center gap-1">
            Admin
            <svg class="w-4 h-4 opacity-60 transition-transform"
                 :class="{'rotate-180': adminDropdown}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M19 9l-7 7-7-7"></path>
            </svg>
          </button>

          <div v-if="adminDropdown"
               class="absolute left-0 mt-2 w-48 bg-white text-gray-800 rounded-xl shadow-lg border border-gray-200 py-2 z-50">
            <!-- Page principale Admin -->
            <router-link @click="adminDropdown=false" to="/admin" class="dropdown-item">Admin (Utilisateurs)</router-link>
            <!-- Sous-pages -->
            <router-link @click="adminDropdown=false" to="/adminproduits" class="dropdown-item">Admin-Produits</router-link>
            <router-link @click="adminDropdown=false" to="/admin-commandes" class="dropdown-item">Admin-Commandes</router-link>
            <router-link @click="adminDropdown=false" to="/upload" class="dropdown-item">UploadProduit</router-link>
          </div>
        </div>

      </div>

      <!-- Right: Utilisateur / Panier -->
      <div class="flex items-center space-x-4">
        <router-link to="/panier" class="relative hover:text-yellow-400">
          🛒
          <span v-if="cartItemCount > 0"
                class="absolute -top-2 -right-3 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
            {{ cartItemCount }}
          </span>
        </router-link>

        <router-link v-if="!isAuthenticated" to="/login" class="cta-btn">Login</router-link>

        <div v-if="isAuthenticated" class="relative" @mouseenter="dropdown=true" @mouseleave="dropdown=false">
          <button class="hover:text-yellow-400 font-medium">{{ userEmail }}</button>

          <div v-if="dropdown"
               class="absolute right-0 mt-2 w-36 bg-white text-gray-800 rounded-xl shadow-lg border border-gray-200 py-2">
            <button @click="logout" class="dropdown-item text-red-500 w-full text-left">Logout</button>
          </div>
        </div>
      </div>
    </nav>

    <!-- Vue Router -->
    <router-view />
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      dropdown: false,
      adminDropdown: false
    };
  },
  computed: {
    ...mapGetters(["isAuthenticated", "userEmail", "isAdmin", "cartItemCount"])
  },
  methods: {
    logout() {
      this.dropdown = false;
      this.adminDropdown = false;
      this.$store.dispatch("logout");
      this
