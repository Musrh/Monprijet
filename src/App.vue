<template>
  <div class="min-h-screen bg-gray-100">

    <!-- Header -->
    <HeaderSearch />

    <!-- Barre mobile : Login/Logout + Email -->
    <div class="md:hidden bg-gray-800 p-2 flex justify-between items-center text-white">
      <div class="flex items-center gap-2">
        <!-- Email affiché si connecté -->
        <span v-if="isAuthenticated" class="mobile-email">{{ userEmail }}</span>

        <!-- Logout -->
        <button v-if="isAuthenticated" @click="logout" class="mobile-auth logout">Logout</button>
        <!-- Premier login supprimé, le deuxième est dans le menu principal -->
      </div>
    </div>

    <!-- Menu principal -->
    <nav class="bg-gray-800 p-2 flex items-center gap-2 flex-nowrap overflow-x-auto">

      <router-link @click="closeMenu" to="/" class="menu-btn">Home</router-link>
      <router-link @click="closeMenu" to="/minishop" class="menu-btn">Minishop</router-link>
      <router-link @click="closeMenu" to="/contact" class="menu-btn">Contact</router-link>

      <!-- Admin menu visible uniquement si admin -->
      <div v-if="isAdmin" class="flex gap-2">
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

      <!-- Login/Logout desktop et mobile (via md:block) -->
      <router-link v-if="!isAuthenticated" @click="closeMenu" to="/login" class="menu-btn md:block">Login</router-link>
      <template v-if="isAuthenticated">
        <span class="user-badge md:block">{{ userEmail }}</span>
        <button @click="logout" class="logout-btn md:block">Logout</button>
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
    closeMenu() {},
    logout() { 
      this.$store.dispatch("logout"); 
      this.$router.push("/"); 
    }
  }
};
</script>

<style scoped>
/* Menu et boutons */
.menu-btn{
  background:#16a34a;
  color:#fff;
  padding:6px 10px;
  border-radius:10px;
  font-size:16px;
  transition:all 0.2s;
  display:inline-flex;
  justify-content:center;
  width:auto;
  white-space:nowrap; /* empêche le retour à la ligne */
}
.menu-btn:hover{ background:#15803d; transform:translateY(-1px); }

/* Badges et boutons utilisateur */
.user-badge{ background:#22c55e; color:#fff; padding:4px 8px; border-radius:6px; font-size:12px; }
.logout-btn{ background:#ef4444; color:#fff; padding:4px 8px; border-radius:6px; font-size:13px; }
.logout-btn:hover{ background:#dc2626; }

/* Mobile */
.mobile-auth{ background:#16a34a; padding:4px 8px; border-radius:6px; font-size:13px; }
.mobile-auth.logout{ background:#ef4444; }
.mobile-email{ background:#22c55e; padding:3px 6px; border-radius:6px; font-size:13px; color:#fff; }

@media (max-width: 768px){
  .md\\:hidden{
    padding-top:4px;   /* réduit l'écart vertical */
    padding-bottom:4px;
  }
  nav{
    flex-wrap: nowrap;  /* tout sur une ligne */
  }
  .menu-btn{
    font-size:14px;
    padding:5px 8px;
  }
  .user-badge{ padding:3px 6px; font-size:12px; }
  .logout-btn{ padding:3px 6px; font-size:13px; }
}
</style>
