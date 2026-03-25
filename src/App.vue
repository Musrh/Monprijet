<template>
  <div class="min-h-screen bg-gray-100">

    <!-- Header avec recherche (logo inclus dans HeaderSearch) -->
    <HeaderSearch v-model:search="globalSearch" />

    <!-- Barre mobile -->
    <div class="md:hidden bg-gray-100 px-2 py-1 flex justify-between items-center text-black">
      <div class="flex items-center gap-1"></div>
    </div>

    <!-- Menu principal -->
    <LanguageSelector />

    <nav class="bg-white px-2 py-1 flex items-center gap-2 flex-nowrap overflow-x-auto">
      <router-link to="/" class="menu-btn">Accueil</router-link>
      <router-link to="/contact" class="menu-btn">Contact</router-link>
      <router-link to="/affiliateproducts" class="menu-btn">Produits partenaires</router-link>

      <!-- Admin menu -->
      <div v-if="isAdmin" class="flex gap-1">
        <router-link to="/admin" class="menu-btn">Admin</router-link>
        <router-link to="/adminproduits" class="menu-btn">Admin-Produits</router-link>
        <router-link to="/admin-commandes" class="menu-btn">Admin-Commandes</router-link>
        <router-link to="/upload" class="menu-btn">UploadProduit</router-link>
        <router-link to="/sendtoprintful" class="menu-btn">Send-to-Printful</router-link>
      </div>

      <!-- Panier -->
      <router-link to="/panier" class="menu-btn relative">
        🛒
        <span v-if="cartItemCount > 0"
              class="absolute -top-2 -right-3 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
          {{ cartItemCount }}
        </span>
      </router-link>

      <!-- Login / Logout -->
      <router-link v-if="!isAuthenticated" to="/login" class="menu-btn">Login</router-link>
      <template v-if="isAuthenticated">
        <span class="user-badge">{{ userEmail }}</span>
        <button @click="logout" class="logout-btn">Logout</button>
      </template>
    </nav>

    <!-- Contenu -->
    <router-view
      :key="$store.getters['language/currentLanguage']"
      :globalSearch="globalSearch"
    />

    <!-- Footer -->
    <Footer />
  </div>
</template>

<script>
import LanguageSelector from "./components/LanguageSelector.vue";
import HeaderSearch from "./components/HeaderSearch.vue";
import Footer from "./components/Footer.vue";
import { mapGetters } from "vuex";

export default {
  components: { HeaderSearch, Footer, LanguageSelector },

  data() {
    return {
      globalSearch: ""
    };
  },

  computed: {
    ...mapGetters([
      "isAuthenticated",
      "userEmail",
      "isAdmin",
      "cartItemCount"
    ]),

    currentLang() {
      return this.$store.getters["language/currentLanguage"];
    }
  },

  methods: {
    logout() {
      this.$store.dispatch("logout");
      this.$router.push("/");
    }
  }
};
</script>
