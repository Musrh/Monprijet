<template>
  <div class="min-h-screen bg-gray-100 flex flex-col">

    <!-- 🔹 MENU PRINCIPAL -->
    <nav class="bg-gray-900 px-6 py-3 flex items-center justify-between shadow-md">

      <!-- LEFT -->
      <div class="flex items-center space-x-3">
        <router-link to="/" class="menu-btn">Home</router-link>
        <router-link to="/contact" class="menu-btn">Contact</router-link>
        <router-link to="/produits" class="menu-btn">Produits</router-link>

        <!-- 🔹 ADMIN DROPDOWN -->
        <div v-if="isAdmin" class="relative"
             @mouseenter="adminDropdown=true"
             @mouseleave="adminDropdown=false">

          <button class="menu-btn flex items-center gap-1">
            Admin
            <svg class="w-4 h-4 opacity-70 transition-transform"
                 :class="{ 'rotate-180': adminDropdown }"
                 fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <div v-if="adminDropdown"
               class="absolute left-0 mt-2 w-52 bg-white text-gray-800 rounded-xl shadow-xl border border-gray-200 py-2 z-50">

            <router-link @click="adminDropdown=false" to="/admin" class="dropdown-item">
              Admin (Utilisateurs)
            </router-link>

            <router-link @click="adminDropdown=false" to="/adminproduits" class="dropdown-item">
              Admin-Produits
            </router-link>

            <router-link @click="adminDropdown=false" to="/admin-commandes" class="dropdown-item">
              Admin-Commandes
            </router-link>

            <router-link @click="adminDropdown=false" to="/upload" class="dropdown-item">
              UploadProduit
            </router-link>
          </div>
        </div>
      </div>

      <!-- RIGHT -->
      <div class="flex items-center space-x-3">

        <!-- 🛒 PANIER -->
        <router-link to="/panier" class="menu-btn relative">
          🛒
          <span v-if="cartItemCount > 0"
                class="absolute -top-2 -right-3 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
            {{ cartItemCount }}
          </span>
        </router-link>

        <!-- LOGIN -->
        <router-link
          v-if="!isAuthenticated"
          to="/login"
          class="menu-btn">
          Login
        </router-link>

        <!-- CONNECTÉ -->
        <template v-if="isAuthenticated">
          <span class="user-badge">{{ userEmail }}</span>
          <button @click="logout" class="logout-btn">
            Logout
          </button>
        </template>

        <!-- ✅ THEMESWITCHER TOUJOURS EN DERNIER -->
        <ThemeSwitcher />

      </div>
    </nav>

    <!-- 🔹 CONTENU -->
    <main class="flex-1">
      <router-view />
    </main>

    <!-- 🔹 VITRINE (PLEINE LARGEUR) -->
    <div class="w-full">
      <Vitrine />
    </div>

  </div>
</template>

<script>
import { mapGetters } from "vuex";
import ThemeSwitcher from "./components/ThemeSwitcher.vue";
import Vitrine from "./components/Vitrine.vue";

export default {
  components: { ThemeSwitcher, Vitrine },
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

/* 🔹 Boutons menu professionnels */
.menu-btn {
  background: #16a34a;
  color: white;
  padding: 6px 14px;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.2s ease;
}

.menu-btn:hover {
  background: #15803d;
  transform: translateY(-1px);
}

/* 🔹 Dropdown items */
.dropdown-item {
  display: block;
  padding: 8px 14px;
  font-size: 14px;
}

.dropdown-item:hover {
  background: #f3f4f6;
}

/* 🔹 User badge */
.user-badge {
  background: #22c55e;
  color: white;
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 13px;
}

/* 🔹 Logout */
.logout-btn {
  background: #ef4444;
  color: white;
  padding: 6px 14px;
  border-radius: 8px;
  transition: 0.2s;
}

.logout-btn:hover {
  background: #dc2626;
}

</style>
