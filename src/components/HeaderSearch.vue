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

    <!-- Barre recherche uniquement -->
    <div class="bg-gray-100 py-3">
      <div class="max-w-7xl mx-auto px-4 flex justify-center">

        <div class="flex gap-2 w-full max-w-md">

          <input
            v-model="search"
            type="text"
            :placeholder="texts.searchPlaceholder"
            class="w-full border rounded px-3 py-2"
          />

          <button
            @click="rechercher"
            class="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
          >
            {{ texts.searchButton }}
          </button>

        </div>

      </div>
    </div>

  </header>
</template>

<script>
import { useRouter, useRoute } from "vue-router";
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
    const route = useRoute();
    return { router, route };
  },

  computed: {
    currentLang() {
      return this.$store.getters["language/currentLanguage"] || "fr";
    },

    texts() {
      const translations = {
        fr: {
          searchPlaceholder: "Vous cherchez quoi ?...",
          searchButton: "Rechercher"
        },
        en: {
          searchPlaceholder: "What are you looking for?",
          searchButton: "Search"
        }
      };

      return translations[this.currentLang] || translations.fr;
    }
  },

  mounted() {
    this.search = this.route.query.search || "";
  },

  methods: {
    rechercher() {
      this.router.push({
        path: "/",
        query: {
          search: this.search
        }
      });
    }
  }
};
</script>

<style scoped>
input {
  min-width: 0;
}
</style>
