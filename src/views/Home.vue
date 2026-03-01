<template>
  <div class="p-4">
    <h2 class="text-xl font-bold mb-4">Calcul des ventes par produit</h2>

    <div v-if="ventes && Object.keys(ventes).length">
      <div v-for="(qty, id) in ventes" :key="id" class="mb-2">
        Produit ID : <strong>{{ id }}</strong> → Quantité vendue : <strong>{{ qty }}</strong>
      </div>
    </div>

    <div v-else>
      Aucun produit vendu pour l'instant.
    </div>
  </div>
</template>

<script>
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase"; // ton fichier firebase.js

export default {
  data() {
    return {
      ventes: {}
    };
  },

  async mounted() {
    await this.calculerVentes();
  },

  methods: {
    async calculerVentes() {
      try {
        const cmdSnap = await getDocs(collection(db, "commandes"));
        const ventesParProduit = {};

        cmdSnap.docs.forEach(doc => {
          const cmd = doc.data();

          if (cmd.statut !== "payé") return;
          if (!cmd.items || !Array.isArray(cmd.items)) return;

          cmd.items.forEach(item => {
            if (!item.id || !item.quantity) return;
            const qty = Number(item.quantity) || 0;
            ventesParProduit[item.id] = (ventesParProduit[item.id] || 0) + qty;
          });
        });

        this.ventes = ventesParProduit;
        console.log("Ventes par produit :", ventesParProduit);
      } catch (err) {
        console.error("Erreur calcul ventes :", err);
      }
    }
  }
};
</script>
