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
    // 🔹 accès à la langue dans le module namespaced 'language'
    currentLang() {
      return this.$store.state.language.currentLanguage;
    }
  },
  methods: {
    // 🔹 changer la langue via le module namespaced
    changeLanguage(lang) {
      this.$store.dispatch("language/changeLanguage", lang);
    }
  }
};
</script>
