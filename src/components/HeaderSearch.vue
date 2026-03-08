<!-- /components/HeaderSearch.vue -->
<template>
  <header class="bg-white border-b shadow-md relative z-20">

    <!-- Ligne principale -->
    <div class="flex items-center justify-between px-4 py-3 max-w-7xl mx-auto gap-4">

      <!-- Logo -->
      <div class="flex items-center gap-2 flex-shrink-0">
        <img src="../assets/hero.png" alt="logo" class="h-10" />
        <span class="font-bold text-lg">EasyShoping</span>
      </div>

      <!-- Barre recherche -->
      <div class="flex flex-1 max-w-2xl">

        <!-- Catégories -->
        <select
          v-model="categorie"
          @change="filterCategorie"
          class="border border-r-0 rounded-l px-3 py-2 bg-gray-100"
        >
          <option value="">Toutes</option>
          <option value="phones">Téléphones</option>
          <option value="pc">PC</option>
          <option value="accessoires">Accessoires</option>
        </select>

        <!-- Input -->
        <input
          v-model="search"
          type="text"
          placeholder="Rechercher un produit..."
          class="flex-1 border px-3 py-2 focus:outline-none"
        />

        <!-- Bouton -->
        <button
          @click="rechercher"
          class="bg-purple-600 text-white px-4 rounded-r hover:bg-purple-700"
        >
          🔍
        </button>

      </div>

      <!-- Theme switcher -->
      <div class="flex-shrink-0">
        <ThemeSwitcher />
      </div>

    </div>

  </header>
</template>

<script>
import { useRouter } from "vue-router";
import ThemeSwitcher from "./ThemeSwitcher.vue";

export default {
  name: "HeaderSearch",
  components: { ThemeSwitcher },

  data() {
    return {
      search: "",
      categorie: ""
    };
  },

  setup() {
    const router = useRouter();
    return { router };
  },

  methods: {
    rechercher() {
      this.router.push({
        path: "/",
        query: { search: this.search }
      });
    },

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
