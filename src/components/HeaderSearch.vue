<template>
  <header class="bg-white border-b shadow-md relative z-20">

    <!-- Logo + ThemeSwitcher -->
    <div class="flex items-center justify-between px-4 py-3 max-w-7xl mx-auto">
      <div class="flex items-center gap-3">
        <img src="../assets/logowell.png" alt="logo" class="h-10" />
        <span class="font-bold text-lg">Wellshoppings</span>
      </div>
      <ThemeSwitcher />
    </div>

    <!-- Barre recherche -->
    <div class="bg-gray-100 py-3">
      <div class="max-w-7xl mx-auto px-4 flex justify-center">
        <div class="flex gap-2 w-full max-w-md">

          <input
            v-model="search"
            type="text"
            :placeholder="texts.searchPlaceholder"
            class="w-full border rounded px-3 py-2"
            @input="updateSearch"
          />

          <button
            @click="goSearch"
            class="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition"
          >
            {{ texts.searchButton }}
          </button>

        </div>
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
      search: ""
    };
  },

  setup() {
    const router = useRouter();
    return { router };
  },

  computed: {
    currentLang() {
      return this.$store.getters["language/currentLanguage"] || "en";
    },
    texts() {
      return {
        fr: {
          searchPlaceholder: "Vous cherchez quoi ?...",
          searchButton: "Rechercher"
        },
        en: {
          searchPlaceholder: "What are you looking for?",
          searchButton: "Search"
        }
      }[this.currentLang];
    }
  },

  methods: {
    updateSearch() {
      this.$emit("update:search", this.search);
    },

    goSearch() {
      if (!this.search.trim()) return;
      this.router.push({
        path: "/search",
        query: { search: this.search }
      });
    }
  }
};
</script>
