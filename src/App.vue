<template>
  <div class="min-h-screen bg-gray-100">

    <!-- Header -->
    <HeaderSearch />

    <!-- Barre mobile simplifiée -->
    <div class="md:hidden bg-gray-800 p-4 flex justify-end items-center text-white">
      <!-- Email affiché si connecté -->
      <span v-if="isAuthenticated" class="mobile-email">{{ userEmail }}</span>

      <!-- Login mobile -->
      <router-link v-if="!isAuthenticated" to="/login" class="mobile-auth ml-2">Login</router-link>

      <!-- Logout mobile -->
      <button v-if="isAuthenticated" @click="logout" class="mobile-auth logout ml-2">Logout</button>
    </div>

    <!-- Menu principal -->
    <nav class="bg-gray-800 p-4 flex flex-wrap items-center gap-2">

      <router-link to="/" class="menu-btn">Home</router-link>
      <router-link to="/minishop" class="menu-btn">Minishop</router-link>
      <router-link to="/contact" class="menu-btn">Contact</router-link>

      <!-- Admin dropdown -->
      <div v-if="isAdmin" class="relative">
        <button class="menu-btn flex items-center justify-center gap-1">
          Admin
          <svg class="w-4 h-4 opacity-60 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
          </svg>
        </button>
        <div class="absolute left-0 mt-2 w-48 bg-white text-gray-800 rounded-xl shadow-lg border py-2 z-50">
          <router-link to="/admin" class="block px-4 py-2 hover:bg-gray-100">Admin (Utilisateurs)</router-link>
          <router-link to="/adminproduits" class="block px-4 py-2 hover:bg-gray-100">Admin-Produits</router-link>
          <router-link to="/admin-commandes" class="block px-4 py-2 hover:bg-gray-100">Admin-Commandes</router-link>
          <router-link to="/upload" class="block px-4 py-2 hover:bg-gray-100">UploadProduit</router-link>
        </div>
      </div>

      <!-- Panier -->
      <router-link to="/panier" class="menu-btn relative">
        🛒
        <span v-if="cartItemCount > 0" class="absolute -top-2 -right-3 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{{ cartItemCount }}</span>
      </router-link>

      <!-- Login desktop -->
      <router-link v-if="!isAuthenticated" to="/login" class="menu-btn hidden md:block">Login</router-link>

      <!-- Email et Logout desktop -->
      <template v-if="isAuthenticated">
        <span class="user-badge hidden md:block">{{ userEmail }}</span>
        <button @click="logout" class="logout-btn hidden md:block">Logout</button>
      </template>

    </nav>

    <!-- Contenu principal -->
    <router-view />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import HeaderSearch from "./components/HeaderSearch.vue";

export default {
  components: { HeaderSearch },
  computed: { ...mapGetters(["isAuthenticated", "userEmail", "isAdmin", "cartItemCount"]) },
  methods: {
    logout() { this.$store.dispatch("logout"); this.$router.push("/"); }
  }
};
</script>

<style scoped>
.menu-btn{
  background:#16a34a;
  color:#fff;
  padding:12px 18px;
  border-radius:10px;
  font-size:16px;
  transition:all 0.2s;
  display:inline-flex;
  justify-content:center;
  min-width:100px;
  max-width:140px;
  text-align:center;
}
.menu-btn:hover{ background:#15803d; transform:translateY(-1px); }

.user-badge{ background:#22c55e; color:#fff; padding:4px 8px; border-radius:6px; font-size:12px; }
.logout-btn{ background:#ef4444; color:#fff; padding:4px 8px; border-radius:6px; font-size:13px; }
.logout-btn:hover{ background:#dc2626; }

.mobile-auth{ background:#16a34a; padding:4px 8px; border-radius:6px; font-size:13px; }
.mobile-auth.logout{ background:#ef4444; }
.mobile-email{ background:#22c55e; padding:3px 6px; border-radius:6px; font-size:13px; color:#fff; }

@media (max-width: 768px){
  .menu-btn{
    width:100%;
    padding:10px 12px;
    font-size:15px;
    text-align:center;
  }
  .user-badge{ padding:3px 6px; font-size:12px; }
  .logout-btn{ padding:3px 6px; font-size:13px; }
}
</style>
