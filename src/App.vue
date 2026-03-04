<template>
  <div class="min-h-screen bg-gray-100">

    <!-- NAVBAR -->
    <nav class="bg-gray-800 p-4 text-white">
      <div class="flex justify-between items-center">

        <router-link to="/" class="font-bold text-lg">
          MonSite
        </router-link>

        <!-- Hamburger -->
        <button @click="mobileMenu = !mobileMenu"
                class="md:hidden text-2xl">
          ☰
        </button>

        <!-- Desktop Menu -->
        <div class="hidden md:flex items-center space-x-2">

          <router-link to="/" class="menu-btn">Home</router-link>
          <router-link to="/contact" class="menu-btn">Contact</router-link>
          <router-link to="/produits" class="menu-btn">Produits</router-link>
          <router-link to="/minishop" class="menu-btn">Minishop</router-link>

          <!-- Panier -->
          <router-link to="/panier" class="menu-btn relative">
            🛒
            <span v-if="cartItemCount > 0"
                  class="absolute -top-2 -right-3 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
              {{ cartItemCount }}
            </span>
          </router-link>

          <!-- Login / Logout -->
          <router-link v-if="!isAuthenticated"
                       to="/login"
                       class="menu-btn">
            Login
          </router-link>

          <template v-if="isAuthenticated">
            <span class="user-badge">{{ userEmail }}</span>
            <button @click="logout"
                    class="logout-btn">
              Logout
            </button>
          </template>

        </div>
      </div>

      <!-- Mobile Menu -->
      <div v-if="mobileMenu"
           class="md:hidden mt-4 space-y-2">

        <router-link @click="mobileMenu=false"
                     to="/"
                     class="mobile-link">
          Home
        </router-link>

        <router-link @click="mobileMenu=false"
                     to="/minishop"
                     class="mobile-link">
          Minishop
        </router-link>

        <router-link @click="mobileMenu=false"
                     to="/panier"
                     class="mobile-link">
          Panier ({{ cartItemCount }})
        </router-link>

      </div>
    </nav>

    <!-- ROUTER VIEW -->
    <router-view />

  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      mobileMenu: false
    };
  },
  computed: {
    ...mapGetters([
      "isAuthenticated",
      "userEmail",
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
.menu-btn {
  background: #16a34a;
  color: white;
  padding: 6px 14px;
  border-radius: 8px;
  font-size: 14px;
}

.user-badge {
  background: #22c55e;
  padding: 6px 12px;
  border-radius: 8px;
}

.logout-btn {
  background: #ef4444;
  padding: 6px 14px;
  border-radius: 8px;
  color: white;
}

.mobile-link {
  display: block;
  background: #16a34a;
  padding: 10px;
  border-radius: 8px;
}
</style>
