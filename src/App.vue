<template>
  <div class="min-h-screen bg-gray-100">

    <!-- Header -->
    <HeaderSearch />

    <!-- Barre mobile : Login/Logout + Email -->
    <div class="md:hidden bg-gray-800 p-4 flex justify-between items-center text-white">
      <div class="flex items-center gap-3">
        <!-- Email affiché si connecté -->
        <span v-if="isAuthenticated" class="mobile-email">{{ userEmail }}</span>

        <!-- Login / Logout -->
        <router-link v-if="!isAuthenticated" to="/login" class="mobile-auth">Login</router-link>
        <button v-if="isAuthenticated" @click="logout" class="mobile-auth logout">Logout</button>
      </div>
    </div>

    <!-- Menu principal plat -->
    <nav class="bg-gray-800 p-4 flex flex-wrap items-center gap-2 justify-start">
      <router-link to="/" class="menu-btn">Home</router-link>
      <router-link to="/minishop" class="menu-btn">Minishop</router-link>
      <router-link to="/contact" class="menu-btn">Contact</router-link>

      <!-- Admin liens visibles directement si admin -->
      <router-link v-if="isAdmin" to="/admin" class="menu-btn">Admin (Utilisateurs)</router-link>
      <router-link v-if="isAdmin" to="/adminproduits" class="menu-btn">Admin-Produits</router-link>
      <router-link v-if="isAdmin" to="/admin-commandes" class="menu-btn">Admin-Commandes</router-link>
      <router-link v-if="isAdmin" to="/upload" class="menu-btn">UploadProduit</router-link>

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
    logout() { 
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
  padding: 8px 14px;
  border-radius: 10px;
  font-size: 16px;
  transition: all 0.2s;
  display: inline-flex;
  justify-content: center;
  text-align: center;
  white-space: nowrap;
}
.menu-btn:hover { background: #15803d; transform: translateY(-1px); }

.user-badge {
  background: #22c55e;
  color: #fff;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 12px;
}

.logout-btn {
  background: #ef4444;
  color: #fff;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 13px;
}
.logout-btn:hover { background: #dc2626; }

.mobile-auth {
  background: #16a34a;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 13px;
}
.mobile-auth.logout { background: #ef4444; }

.mobile-email {
  background: #22c55e;
  padding: 3px 6px;
  border-radius: 6px;
  font-size: 13px;
  color: #fff;
}

@media (max-width: 768px) {
  .menu-btn {
    padding: 6px 10px;
    font-size: 14px;
  }
  .user-badge { padding: 3px 6px; font-size: 12px; }
  .logout-btn { padding: 3px 6px; font-size: 12px; }
}
</style>
