<template>
  <div class="min-h-screen bg-gray-100">

    <!-- Menu principal -->
    <nav class="bg-gray-800 p-4 flex items-center justify-between flex-wrap">

      <!-- Left: liens principaux -->
      <div class="flex items-center flex-wrap space-x-2">
        <router-link to="/" class="menu-btn">Home</router-link>
        <router-link to="/contact" class="menu-btn">Contact</router-link>
        <router-link to="/produits" class="menu-btn">Produits</router-link>
        <router-link to="/minishop" class="menu-btn">Minishop</router-link>

        <!-- Admin Dropdown bureau -->
        <div v-if="isAdmin" class="relative hidden md:block"
             @mouseenter="adminDropdown=true" @mouseleave="adminDropdown=false">
          <button class="menu-btn flex items-center gap-1">
            Admin
            <svg class="w-4 h-4 opacity-60 transition-transform"
                 :class="{'rotate-180': adminDropdown}"
                 fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M19 9l-7 7-7-7"></path>
            </svg>
          </button>

          <div v-if="adminDropdown"
               class="absolute left-0 mt-2 w-48 bg-white text-gray-800 rounded-xl shadow-lg border border-gray-200 py-2 z-50">
            <router-link @click="adminDropdown=false" to="/admin" class="block px-4 py-2 hover:bg-gray-100">
              Admin (Utilisateurs)
            </router-link>
            <router-link @click="adminDropdown=false" to="/adminproduits" class="block px-4 py-2 hover:bg-gray-100">
              Admin-Produits
            </router-link>
            <router-link @click="adminDropdown=false" to="/admin-commandes" class="block px-4 py-2 hover:bg-gray-100">
              Admin-Commandes
            </router-link>
            <router-link @click="adminDropdown=false" to="/upload" class="block px-4 py-2 hover:bg-gray-100">
              UploadProduit
            </router-link>
          </div>
        </div>
      </div>

      <!-- Right: Panier + Login/Logout + ThemeSwitcher -->
      <div class="flex items-center space-x-2">

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

      <!-- Mobile menu toggle -->
      <button @click="mobileMenu = !mobileMenu"
              class="md:hidden bg-gray-700 text-white px-3 py-1 rounded ml-2">
        ☰
      </button>
    </nav>

    <!-- Menu mobile -->
    <div v-if="mobileMenu" class="md:hidden px-4 py-2 space-y-2 bg-gray-800 text-white">

      <router-link @click="closeMobile" to="/" class="block py-1">Home</router-link>
      <router-link @click="closeMobile" to="/contact" class="block py-1">Contact</router-link>
      <router-link @click="closeMobile" to="/produits" class="block py-1">Produits</router-link>
      <router-link @click="closeMobile" to="/minishop" class="block py-1">Minishop</router-link>

      <!-- Admin Mobile -->
      <div v-if="isAdmin" class="mt-2">
        <span class="font-semibold block py-1">Admin</span>
        <router-link @click="closeMobile" to="/admin" class="block py-1 pl-4">Utilisateurs</router-link>
        <router-link @click="closeMobile" to="/adminproduits" class="block py-1 pl-4">Produits</router-link>
        <router-link @click="closeMobile" to="/admin-commandes" class="block py-1 pl-4">Commandes</router-link>
        <router-link @click="closeMobile" to="/upload" class="block py-1 pl-4">Upload Produit</router-link>
      </div>

      <!-- Login / Logout mobile -->
      <div class="mt-2">
        <router-link v-if="!isAuthenticated" @click="closeMobile" to="/login" class="block py-1">Login</router-link>
        <div v-else class="flex items-center space-x-2">
          <span class="user-badge">{{ userEmail }}</span>
          <button @click="logout" class="logout-btn">Logout</button>
        </div>
      </div>

    </div>

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
    },
    closeMobile() {
      this.mobileMenu = false;
    }
  }
};
</script>

<style scoped>
.menu-btn {
  background: #16a34a;
  color: #ffffff;
  padding: 6px 14px;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.2s ease;
}
.menu-btn:hover {
  background: #15803d;
  transform: translateY(-1px);
}

.user-badge {
  background: #22c55e;
  color: #ffffff;
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 13px;
}

.logout-btn {
  background: #ef4444;
  color: #ffffff;
  padding: 6px 14px;
  border-radius: 8px;
  transition: 0.2s;
}
.logout-btn:hover {
  background: #dc2626;
}

.mobile-sublink {
  display: block;
  padding: 8px 16px;
  background: #14532d;
  border-radius: 6px;
}
</style>
