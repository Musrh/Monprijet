<template>
  <div class="produits">
    <div v-for="produit in produits" :key="produit.id" class="card">
      <img :src="produit.image" />
      <h3>{{ produit.nom }}</h3>
      <p>{{ produit.prix }} €</p>
      <button @click="add(produit)">Ajouter au panier</button>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  computed: {
    ...mapState(["produits"])
  },
  methods: {
    add(produit) {
      // 🔹 On envoie le produit **tel quel** à l'action
      this.$store.dispatch("addToCart", produit);
      alert(`${produit.nom} ajouté au panier ✅`);
    }
  }
}
</script>
