<template>
  <header class="bg-white border-b">

    <!-- Logo + Panier -->
    <div class="flex items-center justify-between px-4 py-3 max-w-7xl mx-auto">

      <!-- Logo -->
      <div class="flex items-center gap-3">
        <img src="/icons.svg" alt="logo" class="h-10" />
      </div>

      <!-- Panier -->
      <router-link to="/panier" class="flex items-center gap-2 text-purple-700 font-semibold">
        👜
        <span>Mon Panier</span>

        <span
          v-if="cartItemCount > 0"
          class="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full"
        >
          {{ cartItemCount }}
        </span>
      </router-link>

    </div>

    <!-- Barre recherche -->
    <div class="bg-gray-100 py-3">
      <div class="max-w-7xl mx-auto flex items-center gap-2 px-4">

        <!-- Catégories -->
        <select
          v-model="categorie"
          class="border rounded px-3 py-2 bg-white"
        >
          <option value="">Catégories</option>
          <option value="phones">Téléphones</option>
          <option value="pc">PC</option>
          <option value="accessoires">Accessoires</option>
        </select>

        <!-- Recherche -->
        <input
          v-model="search"
          type="text"
          placeholder="Vous cherchez quoi ?..."
          class="flex-1 border rounded px-3 py-2"
        />

        <!-- Bouton -->
        <button
          @click="rechercher"
          class="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
        >
          🔍
        </button>

      </div>
    </div>

  </header>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "HeaderSearch",

  data() {
    return {
      search: "",
      categorie: ""
    };
  },

  computed: {
    ...mapGetters(["cartItemCount"])
  },

  methods: {
    rechercher() {
      this.$router.push({
        path: "/produits",
        query: {
          search: this.search,
          categorie: this.categorie
        }
      });
    }
  }
};
</script>

<style scoped>

header {
  position: relative;
  z-index: 20;
}

</style>
