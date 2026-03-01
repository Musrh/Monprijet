<template>
  <div class="home">

    <!-- Slider des produits -->
    <SliderProducts :produits="produits" />

    <!-- Produit vedette -->
    <section v-if="produitVedette" class="mb-8">
      <h2 class="text-xl font-bold mb-4">Produit en vedette</h2>
      <div class="product-card">
        <img :src="produitVedette.images" :alt="produitVedette.nom" class="w-64 h-64 object-cover rounded" />
        <h3 class="font-semibold">{{ produitVedette.nom }}</h3>
        <p>{{ produitVedette.prix }} €</p>
        <p>Vendu : {{ ventes[produitVedette.id] }} fois</p>
      </div>
    </section>

    <!-- Produits en promotion -->
    <section v-if="produitsPromo.length">
      <h2 class="text-xl font-bold mb-4">Promotions</h2>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div v-for="p in produitsPromo" :key="p.id" class="product-card">
          <img :src="p.images" :alt="p.nom" class="w-48 h-48 object-cover rounded" />
          <h3 class="font-semibold">{{ p.nom }}</h3>
          <p><s>{{ p.prix }} €</s> {{ Math.round(p.prix * 0.5) }} €</p>
          <span class="badge bg-red-500 text-white px-2 py-1 rounded">Promo 50%</span>
        </div>
      </div>
    </section>

  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import SliderProducts from "./SliderProducts.vue";

export default {
  components: { SliderProducts },
  setup() {
    const produits = ref([]);
    const produitsPromo = ref([]);
    const commandes = ref([]);
    const produitVedette = ref(null);
    const ventes = ref({}); // { idProduit: totalQuantity }

    // Récupérer tous les produits
    const fetchProduits = async () => {
      const snapshot = await getDocs(collection(db, "products"));
      snapshot.forEach(doc => {
        const p = doc.data();
        p.id = doc.id;         // ID Firestore
        // Copier images dans image pour uniformité si nécessaire
        p.image = p.images;     
        produits.value.push(p);

        if (p.promo) produitsPromo.value.push(p);
      });
    };

    // Récupérer toutes les commandes payées
    const fetchCommandes = async () => {
      const snapshot = await getDocs(collection(db, "commandes"));
      snapshot.forEach(doc => {
        const cmd = doc.data();
        commandes.value.push(cmd);
      });
    };

    // Calculer les ventes par produit
    const calculVentes = () => {
      commandes.value.forEach(cmd => {
        if (cmd.statut === "payé" && cmd.items && cmd.items.length) {
          cmd.items.forEach(item => {
            if (!ventes.value[item.id]) ventes.value[item.id] = 0;
            ventes.value[item.id] += item.quantity;
          });
        }
      });

      // Déterminer le produit vedette
      let maxVentes = 0;
      let vedetteId = null;
      for (const id in ventes.value) {
        if (ventes.value[id] > maxVentes) {
          maxVentes = ventes.value[id];
          vedetteId = id;
        }
      }
      if (vedetteId) {
        produitVedette.value = produits.value.find(p => p.id === vedetteId) || null;
      }
    };

    onMounted(async () => {
      await fetchProduits();
      await fetchCommandes();
      calculVentes();
    });

    return {
      produits,
      produitsPromo,
      produitVedette,
      ventes
    };
  }
};
</script>

<style scoped>
.product-card {
  text-align: center;
}
.badge {
  display: inline-block;
  margin-top: 4px;
}
</style>
