<template>
  <div class="relative inline-block" ref="dropdownRef">
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
import { ref, computed, onMounted, onBeforeUnmount } from "vue";

export default {
  setup() {
    const themes = [
      { name: "dark", label: "Sombre" },
      { name: "pastel", label: "Pastel" }
    ];

    const dropdownOpen = ref(false);
    const currentTheme = ref("pastel");
    const dropdownRef = ref(null);

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

    // Fermer le dropdown si click en dehors
    const handleClickOutside = (event) => {
      if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
        dropdownOpen.value = false;
      }
    };

    onMounted(() => {
      document.addEventListener("click", handleClickOutside);
      // Appliquer le thème initial
      document.documentElement.setAttribute("data-theme", currentTheme.value);
    });

    onBeforeUnmount(() => {
      document.removeEventListener("click", handleClickOutside);
    });

    return {
      themes,
      dropdownOpen,
      toggleDropdown,
      setTheme,
      currentThemeLabel,
      dropdownRef
    };
  }
};
</script>
