<template>
  <div>
    <nav>
      <router-link to="/">Home</router-link> |
      <router-link to="/contact">Contact</router-link> |
      <router-link to="/produits">Produits</router-link> |

      <router-link v-if="isAdmin" to="/AdminPanel">
        Admin
      </router-link> |

      <router-link v-if="!isAuthenticated" to="/login">
        Login
      </router-link> |

      <router-link to="/panier">
        🛒 ({{ cartItemCount }})
      </router-link> |

      <router-link v-if="isAdmin" to="/admin-commandes">
        Admin Commandes
      </router-link>

      <span v-if="isAuthenticated">
        | {{ userEmail }}
        <button @click="logout">Logout</button>
      </span>
    </nav>

<p>User: {{ $store.state.user }}</p>
<p>isAdmin: {{ $store.getters.isAdmin }}</p>
    
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
      this.$router.push("/");
    }
  }
};
</script>
