<template>
  <div class="relative inline-block text-left" ref="dropdownRef">
    <!-- Bouton pour ouvrir le menu -->
    <button
      @click="toggleDropdown"
      class="bg-gray-700 text-white px-4 py-2 rounded flex items-center gap-1 hover:bg-gray-600 transition"
    >
      Thème : {{ currentTheme }}
      <svg
        class="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M19 9l-7 7-7-7" />
      </svg>
    </button>

    <!-- Liste déroulante -->
    <ul
      v-show="isOpen"
      class="absolute right-0 mt-2 w-32 bg-white border rounded shadow-lg z-50"
    >
      <li
        v-for="theme in themes"
        :key="theme"
        @click="setTheme(theme)"
        class="px-4 py-2 hover:bg-gray-100 cursor-pointer"
      >
        {{ theme }}
      </li>
    </ul>
  </div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount } from "vue";

export default {
  setup() {
    const themes = ["dark", "pastel"];
    const currentTheme = ref("dark");
    const isOpen = ref(false);
    const dropdownRef = ref(null);

    const toggleDropdown = () => {
      isOpen.value = !isOpen.value;
    };

    const setTheme = (theme) => {
      currentTheme.value = theme;
      document.documentElement.setAttribute("data-theme", theme);
      isOpen.value = false;
    };

    const handleClickOutside = (event) => {
      if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
        isOpen.value = false;
      }
    };

    onMounted(() => {
      document.addEventListener("click", handleClickOutside);
    });

    onBeforeUnmount(() => {
      document.removeEventListener("click", handleClickOutside);
    });

    return { themes, currentTheme, isOpen, toggleDropdown, setTheme, dropdownRef };
  }
};
</script>
