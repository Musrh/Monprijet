<template>
  <div class="min-h-screen bg-gray-100">

    <!-- Header -->
    <HeaderSearch />

    <!-- Navigation -->
    <nav class="bg-gray-800 p-3 flex flex-wrap items-center justify-between gap-2">

      <!-- Menu gauche -->
      <div class="flex flex-wrap gap-2">

        <router-link to="/" class="menu-btn">
          Home
        </router-link>

        <router-link to="/minishop" class="menu-btn">
          Minishop
        </router-link>

        <router-link to="/contact" class="menu-btn">
          Contact
        </router-link>

      </div>

      <!-- Menu droite -->
      <div class="flex items-center gap-3">

        <!-- Admin -->
        <router-link
          v-if="isAdmin"
          to="/admin"
          class="admin-btn"
        >
          Admin
        </router-link>

        <!-- Panier -->
        <router-link to="/panier" class="menu-btn relative">

          🛒

          <span
            v-if="cartItemCount > 0"
            class="absolute -top-2 -right-3 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full"
          >
            {{ cartItemCount }}
          </span>

        </router-link>

        <!-- Login -->
        <router-link
          v-if="!isAuthenticated"
          to="/login"
          class="login-btn"
        >
          Login
        </router-link>

        <!-- Email utilisateur -->
        <span
          v-if="isAuthenticated"
          class="user-badge"
        >
          {{ userEmail }}
        </span>

        <!-- Logout -->
        <button
          v-if="isAuthenticated"
          @click="logout"
          class="logout-btn"
        >
          Logout
        </button>

        <ThemeSwitcher />

      </div>

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

  components: {
    HeaderSearch,
    ThemeSwitcher
  },

  computed: {
    ...mapGetters([
      "isAuthenticated",
      "userEmail",
      "isAdmin",
      "cartItemCount"
    ])
  },

  methods: {

    logout() {
      this.$store.dispatch("logout");
      this.$router.push("/");
    }

  }

};
</script>

<style scoped>

/* boutons menu */

.menu-btn{
  background:#16a34a;
  color:#fff;
  padding:10px 18px;
  border-radius:10px;
  font-size:15px;
  transition:all 0.2s;
}

.menu-btn:hover{
  background:#15803d;
  transform:translateY(-1px);
}

/* login */

.login-btn{
  background:#22c55e;
  color:white;
  padding:10px 18px;
  border-radius:10px;
}

.login-btn:hover{
  background:#16a34a;
}

/* admin */

.admin-btn{
  background:#3b82f6;
  color:white;
  padding:10px 16px;
  border-radius:10px;
}

.admin-btn:hover{
  background:#2563eb;
}

/* badge email */

.user-badge{
  background:#22c55e;
  color:white;
  padding:4px 8px;
  border-radius:6px;
  font-size:12px;
}

/* logout */

.logout-btn{
  background:#ef4444;
  color:white;
  padding:6px 10px;
  border-radius:6px;
}

.logout-btn:hover{
  background:#dc2626;
}

/* mobile */

@media (max-width:768px){

  nav{
    flex-direction:column;
    align-items:flex-start;
  }

}

</style>
