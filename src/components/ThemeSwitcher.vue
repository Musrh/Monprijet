<!-- /components/ThemeSwitcher.vue -->
<template>
  <div class="relative inline-block text-left" ref="dropdownRef">

    <!-- Bouton -->
    <button
      @click="toggleDropdown"
      class="bg-gray-700 text-white px-4 py-2 rounded flex items-center gap-1 hover:bg-gray-600 transition"
    >
      {{ currentTheme }}
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

    <!-- Liste centrée -->
    <ul
      v-show="isOpen"
      class="absolute left-1/2 -translate-x-1/2 mt-2 w-32 bg-white border rounded shadow-lg z-50 text-center"
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
