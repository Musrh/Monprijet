import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase"; // ton fichier firebase.js

async function calculerVentesParProduit() {
  try {
    const cmdSnap = await getDocs(collection(db, "commandes"));
    const ventesParProduit = {};

    cmdSnap.docs.forEach(doc => {
      const cmd = doc.data();

      // On ne compte que les commandes payées
      if (cmd.statut !== "payé") return;

      if (!cmd.items || !Array.isArray(cmd.items)) return;

      cmd.items.forEach(item => {
        if (!item.id || !item.quantity) return;

        const qty = Number(item.quantity) || 0;
        ventesParProduit[item.id] = (ventesParProduit[item.id] || 0) + qty;
      });
    });

    console.log("Ventes par produit :", ventesParProduit);

    return ventesParProduit;
  } catch (err) {
    console.error("Erreur lors du calcul des ventes :", err);
    return {};
  }
}

// Exemple d'utilisation
calculerVentesParProduit().then(result => {
  /*
    Résultat attendu pour tes données :

    {
      "CSKwfA88jG84Grrqt7Ko": 7,
      "11Mo4739dKeGJuDgmnMs": 10,
      "Ot1y2v5KeDrql1cUkfH9": 3
    }
  */
});
