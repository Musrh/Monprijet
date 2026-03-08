<template>
  <div class="min-h-screen bg-gray-100">

    <!-- Header -->
    <HeaderSearch />

    <!-- Navigation -->
    <nav class="bg-gray-800 p-3 flex items-center justify-center gap-3 overflow-x-auto whitespace-nowrap">

      <router-link to="/" class="menu-btn">
        Home
      </router-link>

      <router-link to="/minishop" class="menu-btn">
        Minishop
      </router-link>

      <router-link to="/contact" class="menu-btn">
        Contact
      </router-link>

      <!-- Admin -->
      <router-link
        v-if="isAdmin"
        to="/admin"
        class="admin-btn"
      >
        Admin
      </router-link>

      <!-- Login -->
      <router-link
        v-if="!isAuthenticated"
        to="/login"
        class="login-btn"
      >
        Login
      </router-link>

      <!-- Email -->
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

    </nav>

    <!-- Contenu -->
    <router-view />

  </div>
</template>

<script>
import { mapGetters } from "vuex";
import HeaderSearch from "./components/HeaderSearch.vue";

export default {

  components: {
    HeaderSearch
  },

  computed: {
    ...mapGetters([
      "isAuthenticated",
      "userEmail",
      "isAdmin"
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
  color:white;
  padding:10px 20px;
  border-radius:10px;
  font-size:15px;
  transition:all 0.2s;
  white-space:nowrap;
}

.menu-btn:hover{
  background:#15803d;
  transform:translateY(-1px);
}

/* login */

.login-btn{
  background:#22c55e;
  color:white;
  padding:10px 20px;
  border-radius:10px;
}

.login-btn:hover{
  background:#16a34a;
}

/* admin */

.admin-btn{
  background:#3b82f6;
  color:white;
  padding:10px 18px;
  border-radius:10px;
}

.admin-btn:hover{
  background:#2563eb;
}

/* email */

.user-badge{
  background:#22c55e;
  color:white;
  padding:6px 10px;
  border-radius:6px;
  font-size:13px;
}

/* logout */

.logout-btn{
  background:#ef4444;
  color:white;
  padding:8px 12px;
  border-radius:8px;
}

.logout-btn:hover{
  background:#dc2626;
}

</style>
