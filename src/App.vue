<template>
  <div>
    <nav>
      <router-link to="/">Home</router-link> |
      <router-link to="/contact">Contact</router-link> |
      <router-link to="/produits">Produits</router-link> |

      <!-- Admin panel -->
      <router-link v-if="isAdmin" to="/admin">
        Admin
      </router-link> |

      <!-- Login -->
      <router-link v-if="!isAuthenticated" to="/login">
        Login
      </router-link> |

      <!-- Panier -->
      <router-link to="/panier">
        🛒 ({{ cartItemCount }})
      </router-link> |

      <!-- Admin commandes -->
      <router-link v-if="isAdmin" to="/admin-commandes">
        Admin Commandes
      </router-link>

      <!-- User info -->
      <span v-if="isAuthenticated">
        | {{ userEmail }}
        <button @click="logout">Logout</button>
      </span>
    </nav>

    <router-view />
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
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
      this.$router.push("/"); // ✅ CORRECT
    }
  }
};
</script>

<style>
nav {
  font-weight: bold;
  color: green;
}
</style>
