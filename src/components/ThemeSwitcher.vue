<template>
  <button
    @click="toggleTheme"
    class="border rounded px-3 py-2 bg-gray-700 text-white hover:bg-gray-800 transition"
  >
    <span v-if="theme === 'dark'">🌙</span>
    <span v-else>☀️</span>
  </button>
</template>

<script>
export default {
  name: "ThemeSwitcher",
  data() {
    return {
      theme: "light"
    };
  },
  mounted() {
    const saved = localStorage.getItem("theme");
    if (saved) {
      this.theme = saved;
      document.documentElement.classList.toggle("dark", saved === "dark");
    }
  },
  methods: {
    toggleTheme() {
      this.theme = this.theme === "dark" ? "light" : "dark";
      localStorage.setItem("theme", this.theme);
      document.documentElement.classList.toggle("dark", this.theme === "dark");
    }
  }
};
</script>
