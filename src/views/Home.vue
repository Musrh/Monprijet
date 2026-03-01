<template>
  <div class="p-4">
    <h2 class="text-xl font-bold mb-4">Calcul des ventes par produit (Debug)</h2>

    <div v-if="commandes.length">
      <h3 class="font-semibold mb-2">Commandes récupérées :</h3>
      <pre class="bg-gray-100 p-2 rounded mb-4">{{ commandes }}</pre>
    </div>
    <div v-else>
      <p class="text-red-600">Aucune commande récupérée depuis Firestore.</p>
    </div>

    <div v-if="Object.keys(ventes).length">
      <h3 class="font-semibold mb-2">Ventes par produit :</h3>
      <div v-for="(qty, id) in ventes" :key="id" class="mb-2">
        Produit ID : <strong>{{ id }}</strong> → Quantité vendue : <strong>{{ qty }}</strong>
      </div>
    </div>
    <div v-else>
      <p class="text-red-600">Aucun produit vendu pour l'instant.</p>
    </div>
  </div>
</template>

<script>
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase"; // Assure-toi que c'est correct

export default {
  data() {
    return {
      commandes: [],
      ventes: {}
    };
  },

  async mounted() {
    await this.calculerVentes();
  },

  methods: {
    async calculerVentes() {
      try {
        // 🔹 1️⃣ Récupérer toutes les commandes
        const cmdSnap = await getDocs(collection(db, "commandes"));
        console.log("cmdSnap :", cmdSnap);

        // 🔹 2️⃣ Vérifier si des commandes existent
        const commandesData = cmdSnap.docs.map(d => d.data());
        console.log("Commandes récupérées :", commandesData);
        this.commandes = commandesData;

        const ventesParProduit = {};

        commandesData.forEach((cmd, index) => {
          console.log(`Commande #${index + 1}:`, cmd);

          // On ne compte que les commandes payées
          if (cmd.statut !== "payé") {
            console.log(`Commande #${index + 1} ignorée, statut =`, cmd.statut);
            return;
          }

          if (!cmd.items || !Array.isArray(cmd.items)) {
            console.log(`Commande #${index + 1} ignorée, items manquants ou invalides`);
            return;
          }

          cmd.items.forEach(item => {
            // 🔹 Cherche l'ID quel que soit le nom du champ
            const itemId = item.id || item["Document id"] || item["IdProduit"];
            const qty = Number(item.quantity || item["quantity"]) || 0;

            console.log("Item trouvé :", item, "→ id :", itemId, "qty :", qty);

            if (!itemId || qty === 0) return;

            ventesParProduit[itemId] = (ventesParProduit[itemId] || 0) + qty;
          });
        });

        this.ventes = ventesParProduit;
        console.log("Ventes par produit calculées :", ventesParProduit);

      } catch (err) {
        console.error("Erreur lors du calcul des ventes :", err);
      }
    }
  }
};
</script>
