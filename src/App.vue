<template>
  <div class="min-h-screen bg-gray-100">

    <!-- Header -->
    <HeaderSearch />

    <!-- Barre mobile : Menu + Login/Logout -->
    <div class="md:hidden bg-gray-800 p-3 flex justify-between items-center text-white">

      <div class="flex items-center gap-3">
        <span class="font-bold text-lg">Menu</span>

        <!-- Login -->
        <router-link
          v-if="!isAuthenticated"
          to="/login"
          class="mobile-auth"
        >
          Login
        </router-link>

        <!-- Logout -->
        <button
          v-if="isAuthenticated"
          @click="logout"
          class="mobile-auth logout"
        >
          Logout
        </button>
      </div>

      <button @click="toggleMenu" class="text-2xl">
        ☰
      </button>

    </div>

    <!-- Menu principal -->
    <nav
      class="bg-gray-800 p-4 flex flex-wrap items-center gap-2"
      :class="{'hidden md:flex': !menuOpen, 'flex flex-col md:flex': menuOpen}"
    >

      <router-link @click="closeMenu" to="/" class="menu-btn">Home</router-link>
      <router-link @click="closeMenu" to="/minishop" class="menu-btn">Minishop</router-link>   
      <router-link @click="closeMenu" to="/contact" class="menu-btn">Contact</router-link>

      <!-- Admin dropdown -->
      <div
        v-if="isAdmin"
        class="relative"
        @mouseenter="adminDropdown=true"
        @mouseleave="adminDropdown=false"
      >
        <button class="menu-btn flex items-center justify-center gap-1">
          Admin
          <svg
            class="w-4 h-4 opacity-60 transition-transform"
            :class="{'rotate-180': adminDropdown}"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        <div
          v-if="adminDropdown"
          class="absolute left-0 mt-2 w-48 bg-white text-gray-800 rounded-xl shadow-lg border py-2 z-50"
        >
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

      <!-- Panier -->
      <router-link @click="closeMenu" to="/panier" class="menu-btn relative">
        🛒
        <span v-if="cartItemCount > 0" class="absolute -top-2 -right-3 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
          {{ cartItemCount }}
        </span>
      </router-link>

      <!-- Login desktop -->
      <router-link v-if="!isAuthenticated" @click="closeMenu" to="/login" class="menu-btn hidden md:block">
        Login
      </router-link>

      <!-- Utilisateur connecté -->
      <template v-if="isAuthenticated">
        <span class="user-badge hidden md:block">{{ userEmail }}</span>
        <button @click="logout" class="logout-btn hidden md:block">Logout</button>
      </template>

      <!-- Theme -->
      <ThemeSwitcher />
    </nav>

    <!-- Contenu -->
    <router-view />

  </div>
</template>

<script>
import { mapGetters } from "vuex";
import HeaderSearch from "./components/HeaderSearch.vue";
import ThemeSwitcher from "./components/ThemeSwitcher.vue";

export default {
  components: { HeaderSearch, ThemeSwitcher },

  data() {
    return {
      adminDropdown: false,
      menuOpen: false
    };
  },

  computed: {
    ...mapGetters(["isAuthenticated", "userEmail", "isAdmin", "cartItemCount"])
  },

  methods: {
    toggleMenu() { this.menuOpen = !this.menuOpen; },
    closeMenu() { this.menuOpen = false; },
    logout() {
      this.adminDropdown = false;
      this.$store.dispatch("logout");
      this.$router.push("/");
    }
  }
};
</script>

<style scoped>
.menu-btn {
  background: #16a34a;
  color: #fff;
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.2s;
  width: 160px;       /* largeur réduite pour desktop */
  text-align: center;
}
.menu-btn:hover {
  background: #15803d;
  transform: translateY(-1px);
}

.user-badge {
  background: #22c55e;
  color: #fff;
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 13px;
}

.logout-btn {
  background: #ef4444;
  color: #fff;
  padding: 6px 12px;
  border-radius: 8px;
}
.logout-btn:hover { background: #dc2626; }

/* Mobile login/logout */
.mobile-auth {
  background: #16a34a;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 13px;
}
.mobile-auth.logout { background: #ef4444; }

/* Mobile adjustments */
@media (max-width: 768px) {
  .menu-btn { width: 100%; text-align: left; padding: 6px 10px; }
  .mobile-auth { padding: 4px 6px; font-size: 12px; }
}
</style>
