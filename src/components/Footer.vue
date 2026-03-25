<template>
  <footer class="bg-white text-left py-4 text-sm px-4">
    <p>
      © 2026 WellShoppings •

      <router-link 
        to="/" 
        class="footer-link" 
        :class="{ active: $route.path === '/' }"
      >
        {{ texts.home }}
      </router-link>

      •

      <router-link 
        to="/conditions" 
        class="footer-link" 
        :class="{ active: $route.path === '/conditions' }"
      >
        {{ texts.conditions }}
      </router-link>
    </p>
  </footer>
</template>

<script>
export default {
  name: "Footer",

  computed: {
    currentLang() {
      return this.$store.getters["language/currentLanguage"] || "fr";
    },

    texts() {
      const translations = {
        fr: {
          home: "Accueil",
          conditions: "Conditions de Vente",
        },
        en: {
          home: "Home",
          conditions: "Terms of Sale",
        }
      };

      return translations[this.currentLang] || translations.fr;
    }
  }
};
</script>

<style scoped>
.footer-link {
  color: #dc2626;
  text-decoration: none;
  transition: color 0.2s;
}

.footer-link:hover {
  color: #b91c1c;
}

.footer-link.active {
  color: #16a34a;
  font-weight: bold;
}
</style>
