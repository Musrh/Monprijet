<template>
  <div class="home max-w-6xl mx-auto p-4">
    <!-- Slider des produits -->
    <SliderProduits :produits="produits" />

    <!-- Produit vedette -->
    <section v-if="produitVedette" class="mt-8">
      <h2 class="text-2xl font-bold mb-4">Produit en vedette</h2>
      <div class="product-card border p-4 rounded-lg flex items-center gap-4">
        <img :src="produitVedette.image" :alt="produitVedette.nom" class="w-32 h-32 object-cover rounded-lg" />
        <div>
          <h3 class="text-xl font-semibold">{{ produitVedette.nom }}</h3>
          <p class="text-green-700 font-bold">{{ produitVedette.prix }} €</p>
          <p>Vendu : {{ ventes[produitVedette.id] || 0 }} fois</p>
        </div>
      </div>
    </section>

    <!-- Produits en promotion -->
    <section v-if="produitsPromo.length" class="mt-8">
      <h2 class="text-2xl font-bold mb-4">Promotions</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <div v-for="p in produitsPromo" :key="p.id" class="product-card border p-4 rounded-lg relative">
          <img :src="p.image" :alt="p.nom" class="w-full h-48 object-cover rounded-lg mb-2" />
          <h3 class="text-lg font-semibold">{{ p.nom }}</h3>
          <p>
            <s>{{ p.prix }} €</s>
            <span class="text-red-600 font-bold ml-2">{{ Math.round(p.prix * 0.5) }} €</span>
          </p>
          <span class="badge absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded text-sm">Promo 50%</span>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import SliderProduits from "./SliderProducts.vue"; // Assure-toi que le nom correspond

export default {
  components: { SliderProduits },
  setup() {
    const produits = ref([]);
    const commandes = ref([]);
    const ventes = ref({}); // { idProduit: totalQuantity }
    const produitVedette = ref(null);
    const produitsPromo = ref([]);

    // 🔹 Récupérer les produits
    const fetchProduits = async () => {
      const snapshot = await getDocs(collection(db, "products"));
      snapshot.forEach(doc => {
        const p = doc.data();
        produits.value.push(p);

        // Exemple : tous les produits ont un champ promo = true ou false
        if (p.promo) produitsPromo.value.push(p);
      });
    };

    // 🔹 Récupérer les commandes pour calculer les ventes
    const fetchCommandes = async () => {
      const snapshot = await getDocs(collection(db, "commandes"));
      snapshot.forEach(doc => {
        const cmd = doc.data();
        commandes.value.push(cmd);

        // Calculer ventes par produit
        if (cmd.items && cmd.items.length) {
          cmd.items.forEach(item => {
            if (!ventes.value[item.id]) ventes.value[item.id] = 0;
            ventes.value[item.id] += item.quantity;
          });
        }
      });

      // Déterminer le produit vedette : celui avec le plus de ventes
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
    });

    return { produits, commandes, ventes, produitVedette, produitsPromo };
  }
};
</script>

<style scoped>
.product-card img {
  object-fit: cover;
}
.badge {
  font-weight: bold;
  font-size: 0.8rem;
}
</style>
