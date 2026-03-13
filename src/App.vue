<template>
  <div class="min-h-screen bg-gray-100">

    <!-- Header -->
    <HeaderSearch />

    <!-- Barre mobile : Login/Logout + Email -->
    <div class="md:hidden bg-gray-100 px-2 py-1 flex justify-between items-center text-black">
      <div class="flex items-center gap-1">
        <!-- Mobile login affichage si nécessaire -->
      </div>
    </div>

    <!-- Menu principal -->
    <nav class="bg-white px-2 py-1 flex items-center gap-2 flex-nowrap overflow-x-auto">
      <router-link @click="closeMenu" to="/" class="menu-btn">Accueil</router-link>
      <router-link @click="closeMenu" to="/contact" class="menu-btn">Contact</router-link>

      <!-- Admin menu visible uniquement si admin -->
      <div v-if="isAdmin" class="flex gap-1">
        <router-link @click="closeMenu" to="/admin" class="menu-btn">Admin</router-link>
        <router-link @click="closeMenu" to="/adminproduits" class="menu-btn">Admin-Produits</router-link>
        <router-link @click="closeMenu" to="/admin-commandes" class="menu-btn">Admin-Commandes</router-link>
        <router-link @click="closeMenu" to="/upload" class="menu-btn">UploadProduit</router-link>
      </div>

      <!-- Panier -->
      <router-link @click="closeMenu" to="/panier" class="menu-btn relative">
        🛒
        <span v-if="cartItemCount > 0" class="absolute -top-2 -right-3 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{{ cartItemCount }}</span>
      </router-link>

      <!-- Login/Logout desktop et mobile -->
      <router-link v-if="!isAuthenticated" @click="closeMenu" to="/login" class="menu-btn md:block">Login</router-link>
      <template v-if="isAuthenticated">
        <span class="user-badge md:block">{{ userEmail }}</span>
        <button @click="logout" class="logout-btn md:block">Logout</button>
      </template>
    </nav>

    <!-- Contenu principal -->
    <router-view />

    <!-- Footer -->
    <Footer />
    
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import HeaderSearch from "./components/HeaderSearch.vue";
import Footer from "./components/Footer.vue";

export default {
  components: { HeaderSearch, Footer },
  computed: { ...mapGetters(["isAuthenticated", "userEmail", "isAdmin", "cartItemCount"]) },
  methods: {
    closeMenu() {},
    logout() { 
      this.$store.dispatch("logout"); 
      this.$router.push("/"); 
    }
  }
};
</script>

<style scoped>
/* Menu principal */
.menu-btn {
  background: #ffffff;       /* fond blanc */
  color: #000000 !important; /* texte noir */
  font-weight: bold;         /* gras */
  text-decoration: underline; /* souligné */
  padding: 5px 10px;
  border-radius: 6px;
  font-size: 16px;
  transition: all 0.2s;
  display: inline-flex;
  justify-content: center;
  white-space: nowrap;
}

/* Hover */
.menu-btn:hover {
  color: #4b5563 !important; /* gris foncé au survol */
  background: #f3f4f6;       /* léger fond gris clair */
}

/* Badge utilisateur */
.user-badge { 
  background: #22c55e; 
  color: #fff; 
  padding: 3px 5px; 
  border-radius: 6px; 
  font-size: 12px; 
}
.logout-btn { 
  background: #ef4444; 
  color: #fff; 
  padding: 3px 5px; 
  border-radius: 6px; 
  font-size: 13px; 
}
.logout-btn:hover { 
  background: #dc2626; 
}

.mobile-auth { 
  background: #16a34a; 
  padding: 3px 5px; 
  border-radius: 6px; 
  font-size: 13px; 
}
.mobile-auth.logout { background: #ef4444; }
.mobile-email { 
  background: #22c55e; 
  padding: 2px 4px; 
  border-radius: 6px; 
  font-size: 12px; 
  color: #fff; 
}

@media (max-width: 768px){
  nav {
    flex-wrap: nowrap;
  }
  .menu-btn {
    font-size: 13px;
    padding: 4px 6px;
  }
  .user-badge { padding: 2px 4px; font-size: 11px; }
  .logout-btn { padding: 2px 4px; font-size: 12px; }
}
</style>
