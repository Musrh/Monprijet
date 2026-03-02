<template>
  <div class="relative inline-block">
    <!-- Bouton thème actuel -->
    <button
      @click="toggleDropdown"
      class="bg-green-600 text-white px-4 py-2 rounded font-medium hover:bg-green-700 transition flex items-center gap-1"
    >
      Thème : {{ currentThemeLabel }}
      <svg class="w-4 h-4 opacity-70 transition-transform" :class="{'rotate-180': dropdownOpen}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
      </svg>
    </button>

    <!-- Dropdown -->
    <div
      v-if="dropdownOpen"
      class="absolute right-0 mt-2 w-40 bg-white text-gray-800 rounded-xl shadow-lg border border-gray-200 py-1 z-50"
    >
      <button
        v-for="theme in themes"
        :key="theme.name"
        @click="setTheme(theme.name)"
        class="block w-full text-left px-4 py-2 hover:bg-gray-100"
      >
        {{ theme.label }}
      </button>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";

export default {
  setup() {
    const themes = [
      { name: "dark", label: "Sombre" },
      { name: "pastel", label: "Pastel" }
    ];

    const dropdownOpen = ref(false);
    const currentTheme = ref("pastel");

    const toggleDropdown = () => {
      dropdownOpen.value = !dropdownOpen.value;
    };

    const setTheme = (themeName) => {
      currentTheme.value = themeName;
      document.documentElement.setAttribute("data-theme", themeName);
      dropdownOpen.value = false;
    };

    const currentThemeLabel = computed(() => {
      const theme = themes.find(t => t.name === currentTheme.value);
      return theme ? theme.label : "Thème";
    });

    // Initialisation du thème au chargement
    document.documentElement.setAttribute("data-theme", currentTheme.value);

    return {
      themes,
      dropdownOpen,
      toggleDropdown,
      setTheme,
      currentThemeLabel
    };
  }
};
</script>

<style scoped>
/* Optionnel : fermer le dropdown si click à l'extérieur */
</style>
