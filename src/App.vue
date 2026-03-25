<template>
  <div class="min-h-screen bg-gray-100">

    <!-- Header avec recherche -->
    <HeaderSearch v-model:search="globalSearch" />

    <!-- Barre mobile -->
    <div class="md:hidden bg-gray-100 px-2 py-1 flex justify-between items-center text-black">
      <div class="flex items-center gap-1"></div>
    </div>

    <!-- Menu principal -->
    <LanguageSelector />

    <nav class="bg-white px-2 py-1 flex items-center gap-2 flex-nowrap overflow-x-auto">
      <router-link to="/" class="menu-btn">{{ textsMenu.accueil }}</router-link>
      <router-link to="/contact" class="menu-btn">{{ textsMenu.contact }}</router-link>
      <router-link to="/affiliateproducts" class="menu-btn">{{ textsMenu.partenaires }}</router-link>

      <!-- Admin menu -->
      <div v-if="isAdmin" class="flex gap-1">
        <router-link to="/admin" class="menu-btn">{{ textsMenu.admin }}</router-link>
        <router-link to="/adminproduits" class="menu-btn">{{ textsMenu.adminProduits }}</router-link>
        <router-link to="/admin-commandes" class="menu-btn">{{ textsMenu.adminCommandes }}</router-link>
        <router-link to="/upload" class="menu-btn">{{ textsMenu.upload }}</router-link>
        <router-link to="/sendtoprintful" class="menu-btn">{{ textsMenu.sendPrintful }}</router-link>
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
      <router-link v-if="!isAuthenticated" to="/login" class="menu-btn">{{ textsMenu.login }}</router-link>
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
      globalSearch: "" // nécessaire pour v-model
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
      return this.$store.getters["language/currentLanguage"] || "en";
    },

    // 🔹 Texte dynamique du menu
    textsMenu() {
      return {
        fr: {
          accueil: "Accueil",
          contact: "Contact",
          partenaires: "Partenaires",
          login: "Login",
          admin: "Admin",
          adminProduits: "Admin-Produits",
          adminCommandes: "Admin-Commandes",
          upload: "UploadProduit",
          sendPrintful: "Send-to-Printful"
        },
        en: {
          accueil: "Home",
          contact: "Contact",
          partenaires: "Partners",
          login: "Login",
          admin: "Admin",
          adminProduits: "Admin-Products",
          adminCommandes: "Admin-Orders",
          upload: "UploadProduct",
          sendPrintful: "Send-to-Printful"
        }
      }[this.currentLang];
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

<style scoped>
/* Menu */
nav {
  border-bottom: 1px solid #e5e7eb;
}

/* Boutons menu rouge / survol vert */
.menu-btn {
  background: #ffffff;
  color: #dc2626;           
  font-weight: bold;
  text-decoration: underline;
  padding: 5px 10px;
  border-radius: 6px;
  font-size: 16px;
  transition: all 0.2s;
  white-space: nowrap;
}

.menu-btn:hover {
  color: #16a34a; /* vert au survol */
}

/* Lien actif */
.router-link-exact-active {
  color: #16a34a !important;
  font-weight: bold;
}

/* User badge */
.user-badge {
  background: #22c55e;
  color: white;
  padding: 2px 8px;
  border-radius: 6px;
  font-weight: bold;
  margin-left: 8px;
  font-size: 14px;
}

/* Logout bouton */
.logout-btn {
  background: #ef4444;
  color: white;
  border: none;
  padding: 4px 10px;
  border-radius: 6px;
  font-weight: bold;
  margin-left: 5px;
  cursor: pointer;
  font-size: 14px;
}

.logout-btn:hover {
  background: #dc2626;
}
</style>
