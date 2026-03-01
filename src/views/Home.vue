<template>
  <div class="p-4">
    <h2 class="text-xl font-bold mb-4">Calcul des ventes par produit</h2>

    <div v-if="Object.keys(ventes).length">
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

          // On ne compte que les commandes payées
          if (cmd.statut !== "payé") return;
          if (!cmd.items || !Array.isArray(cmd.items)) return;

          cmd.items.forEach(item => {
            // 🔹 Cherche l'ID quel que soit le nom du champ
            const itemId = item.id || item["Document id"] || item["IdProduit"];
            const qty = Number(item.quantity || item["quantity"]) || 0;

            if (!itemId || qty === 0) return;

            ventesParProduit[itemId] = (ventesParProduit[itemId] || 0) + qty;
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
