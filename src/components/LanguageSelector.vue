<template>
  <div class="flex gap-2">
    <button 
      v-for="lang in languages" 
      :key="lang.code"
      @click="changeLanguage(lang.code)"
      :class="{'font-bold underline': currentLang === lang.code}"
    >
      {{ lang.label }}
    </button>
  </div>
</template>

<script>
export default {
  name: "LanguageSelector",
  data() {
    return {
      languages: [
        { code: "fr", label: "FR" },
        { code: "en", label: "EN" }
      ]
    };
  },
  computed: {
    // 🔹 Utiliser le getter namespaced pour la réactivité
    currentLang() {
      return this.$store.getters["language/currentLanguage"];
    }
  },
  methods: {
    // 🔹 Dispatch vers le module namespaced
    changeLanguage(lang) {
      this.$store.dispatch("language/changeLanguage", lang);
    }
  }
};
</script>
