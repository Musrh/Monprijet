<!-- Footer.vue -->
<template>
  <footer class="py-4 text-center text-sm" style="background-color: #fcd34d;">
    <p>
      © 2026 WellShoppings •
      <a href="https://wellshoppings.com/#/" class="footer-link">Accueil</a> •
      <a href="https://wellshoppings.com/#/conditions" class="footer-link">Conditions de Vente</a>
    </p>
  </footer>
</template>

<script>
export default {
  name: "Footer",
};
</script>

<style scoped>
.footer-link {
  color: #fff;           /* texte en blanc */
  font-weight: 600;
  margin: 0 4px;
  text-decoration: none;
}
.footer-link:hover {
  color: #d1d5db;        /* gris clair au survol */
  text-decoration: underline;
}
</style>
