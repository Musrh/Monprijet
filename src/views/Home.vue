<template>
  <div class="home-page min-h-screen bg-gray-100">

    <!-- 🔹 Slider produits internes -->
    <SliderProducts 
      :produits="produitsInternes" 
      :ventes="ventes" 
      :ajouter-au-panier="ajouterAuPanier" 
      class="max-w-6xl mx-auto"
    />

    <!-- 🔥 Produits en promotion -->
    <div v-if="produitsPromo.length" class="my-10 px-6">
      <h2 class="text-2xl font-bold text-center text-red-600 mb-6">
        🔥 Produits en promotion
      </h2>

      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <div
          v-for="p in produitsPromo"
          :key="p.id"
          class="bg-white border rounded p-4 text-center shadow hover:shadow-lg transition relative"
        >
          <span class="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 text-xs rounded">
            PROMO 50%
          </span>

          <img
            :src="p.images?.[0] || '/placeholder.png'"
            class="w-full h-48 object-cover rounded my-3"
          />

          <h3 class="font-bold">{{ p.nom }}</h3>
          <p class="text-green-600 font-bold">{{ (p.prix * 0.5).toFixed(2) }} €</p>

          <button
            @click="ajouterAuPanier(p, true)"
            class="bg-green-600 text-white px-3 py-1 rounded mt-2 hover:bg-green-700"
          >
            Ajouter au panier
          </button>
        </div>
      </div>
    </div>

    <!-- ⭐ Produit en vedette -->
    <div v-if="produitVedette" class="featured-product my-8 text-center">
      <h2 class="text-2xl font-bold mb-4">⭐ Produit en vedette</h2>

      <img 
        :src="produitVedette.images?.[0] || '/placeholder.png'" 
        class="w-64 h-64 object-cover mx-auto mb-2 rounded"
      />

      <p class="text-lg font-semibold">{{ produitVedette.nom }}</p>
      <p class="text-green-600 font-bold">{{ produitVedette.prix }} €</p>
      <p class="text-gray-500">
        Vendus : {{ ventes[produitVedette.id] || 0 }}
      </p>

      <button 
        @click="ajouterAuPanier(produitVedette)"
        class="bg-green-600 text-white px-4 py-2 rounded mt-2 hover:bg-green-700"
      >
        Ajouter au panier
      </button>
    </div>

    <!-- 🏪 Vitrine -->
    <Vitrine />

  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { collection, getDocs } from "firebase/firestore";
import { useStore } from "vuex";
import { db } from "../firebase";

import SliderProducts from "./SliderProducts.vue";
import Vitrine from "../components/Vitrine.vue";

export default {
  components: { SliderProducts, Vitrine },
  setup() {
    const store = useStore();

    const produitsInternes = ref([]);
    const produitsPromo = ref([]);
    const produitVedette = ref(null);
    const ventes = ref({});

    // Ajouter au panier
    const ajouterAuPanier = (produit, isPromo = false) => {
      store.dispatch("addToCart", {
        id: produit.id,
        nom: produit.nom,
        prix: isPromo ? (produit.prix * 0.5) : produit.prix,
        images: produit.images,
        quantity: 1
      });
      alert(`${produit.nom} a été ajouté au panier`);
    };

    // Récupérer les produits internes et promos
    const fetchProduits = async () => {
      const snapshotInt = await getDocs(collection(db, "products"));

      snapshotInt.forEach(doc => {
        const p = { id: doc.id, ...doc.data() };
        produitsInternes.value.push(p);

        if (p.promo === true) {
          produitsPromo.value.push(p);
        }
      });
    };

    // Récupérer les commandes pour déterminer le produit vedette
    const fetchCommandes = async () => {
      const snapshot = await getDocs(collection(db, "commandes"));

      snapshot.forEach(doc => {
        const cmd = doc.data();
        if (cmd.statut !== "payé") return;

        cmd.items?.forEach(item => {
          const prodId = item.id;
          const qty = item.quantity || 1;
          ventes.value[prodId] =
            (ventes.value[prodId] || 0) + qty;
        });
      });

      let max = 0;
      produitsInternes.value.forEach(p => {
        const q = ventes.value[p.id] || 0;
        if (q > max) {
          max = q;
          produitVedette.value = { ...p };
        }
      });

      if (!produitVedette.value && produitsInternes.value.length > 0) {
        produitVedette.value = { ...produitsInternes.value[0] };
      }
    };

    onMounted(async () => {
      await fetchProduits();
      await fetchCommandes();
    });

    return {
      produitsInternes,
      produitsPromo,
      produitVedette,
      ventes,
      ajouterAuPanier
    };
  }
};
</script>

<style scoped>
.featured-product img {
  object-fit: cover;
}
</style>
