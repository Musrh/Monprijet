<template>
  <div class="min-h-screen bg-gray-100">

    <!-- Menu principal -->
    <nav class="bg-gray-800 p-4 flex items-center justify-between flex-wrap">

      <!-- Mobile Hamburger -->
      <div class="flex items-center justify-between w-full sm:w-auto">
        <span class="text-white font-bold text-lg">MonProjet</span>

        <button @click="mobileMenu = !mobileMenu" class="sm:hidden text-white focus:outline-none">
          <svg v-if="!mobileMenu" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M4 6h16M4 12h16M4 18h16"/>
          </svg>
          <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>

      <!-- Menu links -->
      <div :class="{'block': mobileMenu, 'hidden': !mobileMenu}" class="w-full sm:flex sm:items-center sm:justify-start sm:w-auto mt-2 sm:mt-0 space-y-2 sm:space-y-0 sm:space-x-2">
        
        <!-- Liens principaux -->
        <router-link to="/" class="menu-btn">Home</router-link>
        <router-link to="/contact" class="menu-btn">Contact</router-link>
        <router-link to="/produits" class="menu-btn">Produits</router-link>
        <router-link to="/minishop" class="menu-btn">Minishop</router-link>

        <!-- Admin Dropdown -->
        <div v-if="isAdmin" class="relative" @mouseenter="adminDropdown=true" @mouseleave="adminDropdown=false">
          <button class="menu-btn flex items-center gap-1">
            Admin
            <svg class="w-4 h-4 opacity-60 transition-transform" :class="{'rotate-180': adminDropdown}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </button>

          <div v-if="adminDropdown" class="absolute left-0 mt-2 w-48 bg-white text-gray-800 rounded-xl shadow-lg border border-gray-200 py-2 z-50">
            <router-link @click="adminDropdown=false" to="/admin" class="block px-4 py-2 hover:bg-gray-100">Utilisateurs</router-link>
            <router-link @click="adminDropdown=false" to="/adminproduits" class="block px-4 py-2 hover:bg-gray-100">Produits</router-link>
            <router-link @click="adminDropdown=false" to="/admin-commandes" class="block px-4 py-2 hover:bg-gray-100">Commandes</router-link>
            <router-link @click="adminDropdown=false" to="/upload" class="block px-4 py-2 hover:bg-gray-100">Upload</router-link>
          </div>
        </div>

        <!-- Panier -->
        <router-link to="/panier" class="menu-btn relative">
          🛒
          <span v-if="cartItemCount > 0" class="absolute -top-2 -right-3 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
            {{ cartItemCount }}
          </span>
        </router-link>

        <!-- Login / Logout -->
        <router-link v-if="!isAuthenticated" to="/login" class="menu-btn">Login</router-link>

        <template v-if="isAuthenticated">
          <span class="user-badge">{{ userEmail }}</span>
          <button @click="logout" class="logout-btn">Logout</button>
        </template>

        <!-- ThemeSwitcher TOUJOURS EN DERNIER -->
        <ThemeSwitcher />

      </div>
    </nav>

    <!-- Contenu principal -->
    <router-view />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import ThemeSwitcher from './components/ThemeSwitcher.vue';

export default {
  components: { ThemeSwitcher },
  data() {
    return {
      adminDropdown: false,
      mobileMenu: false
    };
  },
  computed: {
    ...mapGetters(["isAuthenticated", "userEmail", "isAdmin", "cartItemCount"])
  },
  methods: {
    logout() {
      this.adminDropdown = false;
      this.mobileMenu = false;
      this.$store.dispatch("logout");
      this.$router.push("/");
    }
  }
};
</script>

<style scoped>
.menu-btn {
  background: #16a34a; /* vert */
  color: #ffffff;       /* texte blanc */
  padding: 6px 14px;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.2s ease;
  display: inline-block;
}
.menu-btn:hover {
  background: #15803d;  /* vert foncé au hover */
  transform: translateY(-1px);
}

.user-badge {
  background: #22c55e; /* vert clair */
  color: #ffffff;
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 13px;
}

.logout-btn {
  background: #ef4444; /* rouge */
  color: #ffffff;
  padding: 6px 14px;
  border-radius: 8px;
  transition: 0.2s;
}
.logout-btn:hover {
  background: #dc2626; /* rouge foncé */
}

/* Mobile menu spacing */
@media (max-width: 640px) {
  .menu-btn {
    width: 100%;
    text-align: left;
  }
}
</style>
