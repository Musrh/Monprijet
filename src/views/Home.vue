<script>
import { ref, onMounted } from "vue";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase"; // ton fichier firebase.js
import SliderProducts from "./SliderProducts.vue";

export default {
  components: { SliderProducts },
  setup() {
    const commandes = ref([]);
    const produits = ref([]);
    const produitsPromo = ref([]);
    const produitVedette = ref(null);
    const ventes = ref({}); // { idProduit: totalQuantity }

    // Récupérer toutes les commandes et calculer ventes
    const fetchCommandes = async () => {
      const snapshot = await getDocs(collection(db, "commandes"));
      snapshot.forEach(doc => {
        const cmd = doc.data();
        commandes.value.push(cmd);

        if (cmd.items && cmd.items.length) {
          cmd.items.forEach(item => {
            if (!ventes.value[item.id]) ventes.value[item.id] = 0;
            ventes.value[item.id] += item.quantity;
          });
        }
      });
    };

    // Récupérer tous les produits et les promos
    const fetchProduits = async () => {
      const snapshot = await getDocs(collection(db, "products"));
      snapshot.forEach(doc => {
        const p = doc.data();
        produits.value.push(p);
        if (p.promo) produitsPromo.value.push(p);
      });
    };

    // Déterminer le produit vedette (max ventes)
    const findProduitVedette = () => {
      let maxVente = 0;
      let vedette = null;
      produits.value.forEach(p => {
        const total = ventes.value[p.id] || 0;
        if (total > maxVente) {
          maxVente = total;
          vedette = p;
        }
      });
      produitVedette.value = vedette;
    };

    // Tout lancer au montage
    onMounted(async () => {
      await fetchCommandes();
      await fetchProduits();
      findProduitVedette();
    });

    return { commandes, ventes, produitsPromo, produitVedette };
  }
};
</script>
