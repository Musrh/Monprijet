<template>
  <div class="p-6">

    <h1 class="text-2xl font-bold mb-4">TEST PRODUITS</h1>

    <div v-if="loading">Chargement...</div>

    <div v-if="error" class="text-red-500">
      Erreur : {{ error }}
    </div>

    <div v-for="p in produits" :key="p.id" class="mb-6 border p-4 rounded">
      <p><strong>{{ p.nom }}</strong></p>
      <p>{{ p.prix }} MAD</p>
      <img :src="p.images" class="w-64 mt-2" />
    </div>

  </div>
</template>

<script>
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

export default {
  data() {
    return {
      produits: [],
      loading: true,
      error: null
    };
  },

  async mounted() {
    try {
      const snapshot = await getDocs(collection(db, "products"));

      console.log("Documents Firestore:", snapshot.docs.length);

      this.produits = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

    } catch (err) {
      console.error(err);
      this.error = err.message;
    } finally {
      this.loading = false;
    }
  }
};
</script>
