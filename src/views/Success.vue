<template>
  <div class="success-page">
    <h1>Paiement réussi ! ✅</h1>
    <p>Merci pour votre commande.</p>
    <p>Vous pouvez revenir à l'<a href="https://musrh.github.io/monprijet">accueil</a>.</p>
  </div>
</template>

<script>
export default {
  name: "Success"
};
</script>

<style scoped>
.success-page {
  max-width: 700px;
  margin: auto;
  padding: 20px;
  text-align: center;
  font-family: sans-serif;
}
a {
  color: #42b983;
  text-decoration: none;
  font-weight: bold;
}
</style>
