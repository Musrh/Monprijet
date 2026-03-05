<template>
  <div class="home-page min-h-screen bg-gray-100 px-4">

    <!-- 🔹 Slider produits internes (max 75% en bureau, 100% mobile) -->
    <div class="w-full md:w-3/4 mx-auto">
      <SliderProducts 
        :produits="produitsInternes" 
        :ventes="ventes" 
        :ajouter-au-panier="ajouterAuPanier" 
      />
    </div>

    <!-- 🔥 Produits en promotion (uniquement internes) -->
    <div v-if="produitsPromo.length" class="my-10">
      <h2 class="text-2xl font-bold text-red-600 mb-6 text-left">
        🔥 Produits en promotion
      </h2>

      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <div
          v-for="p in produitsPromo"
          :key="p.id"
          class="bg-white border rounded p-4 text-center shadow hover:shadow-lg transition relative"
        >
          <!-- Étiquette promo -->
          <span class="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 text-xs rounded">
            50% 🔥
          </span>

          <img
            :src="p.images?.[0] || '/placeholder.png'"
            class="w-full h-48 object-cover rounded my-3"
          />

          <h3 class="font-bold">{{ p.nom }}</h3>

          <!-- Ancien prix barré + prix promo -->
          <p class="text-gray-500 line-through" v-if="p.oldPrice">
            {{ p.oldPrice }} €
          </p>
          <p class="text-green-600 font-bold">{{ p.prix }} €</p>

          <button
            @click="ajouterAuPanier(p)"
            class="bg-green-600 text-white px-3 py-1 rounded mt-2 hover:bg-green-700"
          >
            Ajouter au panier
          </button>
        </div>
      </div>
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
    const ventes = ref({});

    const ajouterAuPanier = (produit) => {
      store.dispatch("addToCart", {
        id: produit.id,
        nom: produit.nom,
        prix: produit.prix,
        images: produit.images,
        quantity: 1
      });
    };

    const fetchProduits = async () => {
      const snapshot = await getDocs(collection(db, "products"));
      snapshot.forEach(doc => {
        const p = { id: doc.id, ...doc.data() };

        // Slider : tous les produits internes
        produitsInternes.value.push(p);

        // Produits promo uniquement internes
        if (p.promo === true) {
          // Ancien prix barré = double du prix promo par exemple
          if (!p.oldPrice) {
            p.oldPrice = p.prix * 2;
          }
          produitsPromo.value.push(p);
        }
      });
    };

    const fetchCommandes = async () => {
      const snapshot = await getDocs(collection(db, "commandes"));
      snapshot.forEach(doc => {
        const cmd = doc.data();
        if (cmd.statut !== "payé") return;
        cmd.items?.forEach(item => {
          const prodId = item.id;
          const qty = item.quantity || 1;
          ventes.value[prodId] = (ventes.value[prodId] || 0) + qty;
        });
      });
    };

    onMounted(async () => {
      await fetchProduits();
      await fetchCommandes();
    });

    return {
      produitsInternes,
      produitsPromo,
      ventes,
      ajouterAuPanier
    };
  }
};
</script>

<style scoped>
.home-page img {
  object-fit: cover;
}

/* Titre section à gauche */
h2 {
  text-align: left;
}
</style>
