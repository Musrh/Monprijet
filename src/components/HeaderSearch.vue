<template>
  <header class="bg-white border-b shadow-md relative z-20">
    <div class="flex items-center justify-between px-4 py-3 max-w-7xl mx-auto">
      <div class="flex items-center gap-3">
        <img src="../assets/hero.png" alt="logo" class="h-10" />
        <span class="font-bold text-lg">Mon Site</span>
      </div>

      <router-link to="/panier" class="flex items-center gap-2 text-purple-700 font-semibold">
        🛒
        <span>Mon Panier</span>
        <span v-if="cartItemCount > 0" class="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
          {{ cartItemCount }}
        </span>
      </router-link>
    </div>

    <div class="bg-gray-100 py-3">
      <div class="max-w-7xl mx-auto flex items-center gap-2 px-4">

        <select v-model="categorie" @change="filtrerCategorie" class="border rounded px-3 py-2 bg-white">
          <option value="">Toutes catégories</option>
          <option value="phones">Téléphones</option>
          <option value="pc">PC</option>
          <option value="accessoires">Accessoires</option>
        </select>

        <input
          v-model="search"
          type="text"
          placeholder="Vous cherchez quoi ?..."
          class="flex-1 border rounded px-3 py-2"
        />

        <button @click="rechercher" class="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">
          🔍
        </button>

      </div>
    </div>
  </header>
</template>

<script>
export default {
  name: "HeaderSearch",
  data() {
    return {
      search: "",
      categorie: ""
    };
  },
  computed: {
    cartItemCount() {
      return this.$store.getters.cartItemCount;
    }
  },
  methods: {
    // Clique sur le bouton texte
    rechercher() {
      this.$emit("filter-changed", { search: this.search, categorie: "" });
    },
    // Changement de catégorie
    filtrerCategorie() {
      this.$emit("filter-changed", { search: "", categorie: this.categorie });
    }
  }
};
</script>
