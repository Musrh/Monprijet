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
import { mapGetters, mapActions } from "vuex";

export default {
  name: "LanguageSelector",
  data() {
    return {
      languages: [
        { code: "fr", label: "FR" },
        { code: "en", label: "EN" },
      ],
    };
  },
  computed: {
    ...mapGetters(["currentLanguage"]),
    currentLang() {
      return this.currentLanguage;
    },
  },
  methods: {
    ...mapActions(["setLanguage"]),
    changeLanguage(lang) {
      this.setLanguage(lang);
    },
  },
};
</script>
