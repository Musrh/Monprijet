<template>
  <div class="relative inline-block" ref="dropdownRef">
    <button @click="toggleDropdown" class="bg-green-600 text-white px-4 py-2 rounded font-medium hover:bg-green-700 transition flex items-center gap-1">
      Thème
      <svg class="w-4 h-4 opacity-60 transition-transform" :class="{'rotate-180': dropdownOpen}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
      </svg>
    </button>

    <div v-if="dropdownOpen" class="absolute right-0 mt-2 w-36 bg-white text-gray-800 rounded shadow-lg border border-gray-200 z-50">
      <button @click="setTheme('pastel')" class="block w-full text-left px-4 py-2 hover:bg-gray-100">Pastel</button>
      <button @click="setTheme('dark')" class="block w-full text-left px-4 py-2 hover:bg-gray-100">Dark</button>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount } from "vue";

export default {
  setup() {
    const dropdownOpen = ref(false);
    const dropdownRef = ref(null);

    const toggleDropdown = () => {
      dropdownOpen.value = !dropdownOpen.value;
    };

    const setTheme = (theme) => {
      document.documentElement.setAttribute('data-theme', theme);
      dropdownOpen.value = false; // fermer après choix
    };

    const handleClickOutside = (event) => {
      if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
        dropdownOpen.value = false;
      }
    };

    onMounted(() => {
      document.addEventListener('click', handleClickOutside);
    });

    onBeforeUnmount(() => {
      document.removeEventListener('click', handleClickOutside);
    });

    return { dropdownOpen, toggleDropdown, setTheme, dropdownRef };
  }
};
</script>

<style scoped>
/* Optionnel : petite transition */
div[ref="dropdownRef"] div {
  transition: all 0.2s ease-in-out;
}
</style>
