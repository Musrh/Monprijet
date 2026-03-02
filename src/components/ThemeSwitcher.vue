<template>
  <div class="flex gap-2">
    <button @click="setTheme('dark')" class="px-2 py-1 bg-gray-800 text-white rounded">
      Dark
    </button>
    <button @click="setTheme('pastel')" class="px-2 py-1 bg-pink-200 text-gray-700 rounded">
      Pastel
    </button>
  </div>
</template>

<script>
export default {
  methods: {
    setTheme(theme) {
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('theme', theme); // mémoriser le choix
    }
  },
  mounted() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      document.documentElement.setAttribute('data-theme', savedTheme);
    } else {
      document.documentElement.setAttribute('data-theme', 'pastel'); // thème par défaut
    }
  }
}
</script>

<style scoped>
/* optionnel: style local pour les boutons */
</style>
