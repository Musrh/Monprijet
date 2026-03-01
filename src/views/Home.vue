<template>
  <div class="home">
    <!-- Slider des produits -->
    <SliderProducts />

    <!-- Produit vedette -->
    <section v-if="produitVedette">
      <h2>Produit en vedette</h2>
      <div class="product-card">
        <img :src="produitVedette.image" :alt="produitVedette.nom" />
        <h3>{{ produitVedette.nom }}</h3>
        <p>{{ produitVedette.prix }} €</p>
        <p>Vendu : {{ ventes[produitVedette.id] }} fois</p>
      </div>
    </section>

    <!-- Produits en promotion -->
    <section v-if="produitsPromo.length">
      <h2>Promotions</h2>
      <div class="product-card" v-for="p in produitsPromo" :key="p.id">
        <img :src="p.image" :alt="p.nom" />
        <h3>{{ p.nom }}</h3>
        <p><s>{{ p.prix }} €</s> {{ Math.round(p.prix * 0.5) }} €</p>
        <span class="badge">Promo 50%</span>
      </div>
    </section>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase"; // ton fichier firebase.js
import SliderProducts from "./SliderProducts.vue";

export default {
  components: { SliderProducts },
  setup() {
    const commandes = ref([]);
    const produitsPromo = ref([]);
    const produitVedette = ref(null);
    const ventes = ref({}); // { idProduit: totalQuantity }

    // Récupérer toutes les commandes
    const fetchCommandes = async () => {
      const snapshot = await getDocs(collection(db, "commandes"));
      snapshot.forEach(doc => {
        commandes.value.push(doc.data());
      });

      // Calculer ventes par produit
      commandes.value.forEach(cmd => {
        if (cmd.items && cmd.items.length) {
          cmd.items.forEach(item => {
            if (!ventes.value[item.id]) ventes.value[item.id] = 0;
            ventes.value[item.id] += item.quantity;
          });
        }
      });
    };

    // Récupérer tous les produits
    const fetchProduits = async () => {
      const snapshot = await getDocs(collection(db, "products"));
      snapshot.forEach(doc => {
        const p = doc.data();
        if (p.promo) produitsPromo.value.push(p);
      });
    };

    // Déterminer le produit vedette
    const findProduitVedette = async () => {
      await fetchCommandes();
      await fetchProduits();

      let maxVente = 0;
      let vedette = null;

      // Vérifier chaque produit pour trouver celui avec le plus de ventes
      const snapshot = await getDocs(collection(db, "products"));
      snapshot.forEach(doc => {
        const p = doc.data();
        const total = ventes.value[p.id] || 0;
        if (total > maxVente) {
          maxVente = total;
          vedette = p;
        }
      });

      produitVedette.value = vedette;
    };

    onMounted(() => {
      fetchProduits();
      findProduitVedette();
    });

    return { commandes, ventes, produitVedette, produitsPromo };
  }
};
</script>

<style scoped>
.product-card {
  display: inline-block;
  margin: 10px;
  border: 1px solid #ddd;
  padding: 10px;
  border-radius: 8px;
  text-align: center;
}
.product-card img {
  width: 150px;
  height: 150px;
  object-fit: cover;
}
.badge {
  background: red;
  color: #fff;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.8em;
}
</style>
