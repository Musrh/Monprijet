<template>
  <div>
    <h1>Admin Panel</h1>

    <div v-if="!isAuthenticated">
      <p>Veuillez vous connecter</p>
    </div>

    <div v-else-if="!isAdmin">
      <p>Accès refusé ❌</p>
    </div>

    <div v-else>
      <h2>Bienvenue Admin 👑</h2>
      <p>Email: {{ userEmail }}</p>

      <hr />

      <h3>Gestion Produits</h3>
      <p>Ici tu peux ajouter / modifier / supprimer produits</p>

      <h3>Gestion Commandes</h3>
      <p>Ici tu peux voir les commandes</p>

      <h3>Gestion Utilisateurs</h3>
      <p>Ici tu peux modifier ou supprimer des comptes</p>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  computed: {
    ...mapGetters([
      "isAuthenticated",
      "isAdmin",
      "userEmail"
    ])
  }
};
</script>
