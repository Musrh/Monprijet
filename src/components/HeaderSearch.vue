<template>
  <header class="bg-white border-b shadow-md relative z-20">

    <!-- Logo + Panier -->
    <div class="flex items-center justify-between px-4 py-3 max-w-7xl mx-auto">
      <div class="flex items-center gap-3">
        <img src="../assets/hero.png" alt="logo" class="h-10" />
        <span class="font-bold text-lg">Mon Site</span>
      </div>

      <!-- Panier -->
      <router-link to="/panier" class="flex items-center gap-2 text-purple-700 font-semibold">
        🛒
        <span>Mon Panier</span>
        <span v-if="cartItemCount > 0" class="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
          {{ cartItemCount }}
        </span>
      </router-link>
    </div>

    <!-- Barre de recherche -->
    <div class="bg-gray-100 py-3">
      <div class="max-w-7xl mx-auto flex flex-wrap md:flex-nowrap items-center gap-2 px-4">

        <!-- Catégories -->
        <select v-model="categorie" @change="filterCategorie" class="border rounded px-3 py-2 bg-white flex-shrink-0">
          <option value="">Toutes catégories</option>
          <option value="phones">Téléphones</option>
          <option value="pc">PC</option>
          <option value="accessoires">Accessoires</option>
        </select>

        <!-- Champ de recherche -->
        <input
          v-model="search"
          type="text"
          placeholder="Vous cherchez quoi ?..."
          class="flex-1 min-w-0 border rounded px-3 py-2"
        />

        <!-- Bouton recherche -->
        <button @click="rechercher" class="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 flex-shrink-0">
          🔍
        </button>

        <!-- ThemeSwitcher -->
        <div class="ml-2 flex-shrink-0">
          <ThemeSwitcher />
        </div>

      </div>
    </div>

  </header>
</template>

<script>
import { mapGetters } from "vuex";
import { useRouter, useRoute } from "vue-router";
import ThemeSwitcher from './ThemeSwitcher.vue';

export default {
  name: "HeaderSearch",
  components: { ThemeSwitcher },
  data() {
    return {
      search: "",
      categorie: ""
    };
  },
  computed: {
    ...mapGetters(["cartItemCount"])
  },
  setup() {
    const router = useRouter();
    const route = useRoute();
    return { router, route };
  },
  methods: {
    // Bouton Recherche → texte seulement
    rechercher() {
      this.router.push({
        path: "/",
        query: { search: this.search }
      });
    },
    // Changement de catégorie → filtre automatiquement
    filterCategorie() {
      this.router.push({
        path: "/",
        query: {
          categorie: this.categorie,
          search: this.search
        }
      });
    }
  }
};
</script>

<style scoped>
input {
  min-width: 0; /* important pour flex-grow en mobile */
}
.flex-shrink-0 {
  flex-shrink: 0;
}
</style>
