<template>
  <button
    @click="toggleTheme"
    class="border rounded px-3 py-2 bg-gray-700 text-white hover:bg-gray-800 transition"
  >
    <span v-if="theme === 'dark'">🌙</span>
    <span v-else>🌸</span>
  </button>
</template>

<script>
export default {
  name: "ThemeSwitcher",
  data() {
    return {
      theme: "pastel"
    };
  },

  mounted() {
    const saved = localStorage.getItem("theme");
    if (saved) {
      this.theme = saved;
      document.documentElement.classList.remove("dark","pastel");
      document.documentElement.classList.add(saved);
    } else {
      document.documentElement.classList.add("pastel");
    }
  },

  methods: {
    toggleTheme() {
      this.theme = this.theme === "dark" ? "pastel" : "dark";

      localStorage.setItem("theme", this.theme);

      document.documentElement.classList.remove("dark","pastel");
      document.documentElement.classList.add(this.theme);
    }
  }
};
</script>
