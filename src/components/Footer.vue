<!-- Footer.vue -->
<template>
  <footer class="bg-white text-center py-4 text-sm">
    <p>
      © 2026 WellShoppings •
      <router-link 
        to="/" 
        class="footer-link" 
        :class="{ active: $route.path === '/' }"
      >
        Accueil
      </router-link> •
      <router-link 
        to="/conditions" 
        class="footer-link" 
        :class="{ active: $route.path === '/conditions' }"
      >
        Conditions de Vente
      </router-link>
    </p>
  </footer>
</template>

<script>
export default {
  name: "Footer",
};
</script>

<style scoped>
/* Liens du footer */
.footer-link {
  color: #dc2626; /* rouge */
  text-decoration: none;
  transition: color 0.2s;
}

/* Hover */
.footer-link:hover {
  color: #b91c1c; /* rouge foncé */
}

/* Lien actif = page courante */
.footer-link.active {
  color: #16a34a; /* vert */
  font-weight: bold;
}
</style>
