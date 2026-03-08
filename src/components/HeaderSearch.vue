//HeaderSearch bon
<template>
  <header class="bg-white border-b shadow-md relative z-20">

    <!-- Logo + ThemeSwitcher -->
    <div class="flex items-center justify-between px-4 py-3 max-w-7xl mx-auto">
      <div class="flex items-center gap-3">
        <img src="../assets/hero.png" alt="logo" class="h-10" />
        <span class="font-bold text-lg">EasyShoping</span>
      </div>

      <!-- ThemeSwitcher -->
      <div>
        <ThemeSwitcher />
      </div>
    </div>

    <!-- Barre catégories + recherche -->
    <div class="bg-gray-100 py-2">
      <div class="max-w-7xl mx-auto flex flex-col md:flex-nowrap gap-2 px-4">

        <!-- Catégories sur la première ligne -->
        <div class="flex gap-2 flex-wrap">
          <select v-model="categorie" @change="filterCategorie" class="border rounded px-3 py-2 bg-white flex-shrink-0">
            <option value="">Toutes catégories</option>
            <option value="phones">Téléphones</option>
            <option value="pc">PC</option>
            <option value="accessoires">Accessoires</option>
          </select>
        </div>

        <!-- Zone recherche + bouton sur la deuxième ligne -->
        <div class="flex gap-2 flex-wrap mt-1">
          <input v-model="search" type="text" placeholder="Vous cherchez quoi ?..." class="flex-1 min-w-0 border rounded px-3 py-2" />
          <button @click="rechercher" class="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 flex-shrink-0">
            🔍
          </button>
        </div>

      </div>
    </div>

  </header>
</template>

<script>
import { mapGetters } from "vuex";
import { useRouter } from "vue-router";
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
  setup() {
    const router = useRouter();
    return { router };
  },
  computed: { ...mapGetters(["cartItemCount"]) },
  methods: {
    rechercher() {
      this.router.push({ path:"/", query:{ search:this.search } });
    },
    filterCategorie() {
      this.router.push({ path:"/", query:{ categorie:this.categorie, search:this.search } });
    }
  }
};
</script>

<style scoped>
input { min-width: 0; }
.flex-shrink-0 { flex-shrink: 0; }
</style>
