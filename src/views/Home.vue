import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

async function calculerVedettes(produits) {
  const cmdSnap = await getDocs(collection(db, "commandes"));
  const ventesParProduit = {};

  cmdSnap.docs.forEach(doc => {
    const cmd = doc.data();

    if (cmd.statut !== "payé") return;
    if (!cmd.items || !Array.isArray(cmd.items)) return;

    cmd.items.forEach(item => {
      if (!item.id) return;
      const qty = Number(item.quantity) || 0;

      ventesParProduit[item.id] =
        (ventesParProduit[item.id] || 0) + qty;
    });
  });

  // Map produits avec leur nombre de ventes
  return produits
    .map(p => ({
      ...p,
      ventes: ventesParProduit[p.id] || 0
    }))
    .filter(p => p.ventes > 0)
    .sort((a, b) => b.ventes - a.ventes)
    .slice(0, 3); // Top 3 vedettes
}
