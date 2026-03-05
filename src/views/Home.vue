<template>
  <div class="home-page min-h-screen bg-gray-100 p-4">

    <!-- 🔹 Slider produits internes (75% bureau, 100% mobile) -->
    <SliderProducts 
      :produits="produitsInternes" 
      :ventes="ventes" 
      :ajouter-au-panier="ajouterAuPanier" 
      class="w-full md:w-3/4"
    />

    <!-- 🔥 Produits en promotion -->
    <section v-if="produitsPromo.length" class="my-8">
      <h2 class="text-2xl font-bold text-left text-red-600 mb-4">
        🔥 Produits en promotion
      </h2>

      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <div
          v-for="p in produitsPromo"
          :key="p.id"
          class="bg-white border rounded p-4 text-center shadow hover:shadow-lg transition relative"
        >
          <span class="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 text-xs rounded">
            PROMO
          </span>

          <img
            :src="p.images?.[0] || '/placeholder.png'"
            class="w-full h-48 object-cover rounded my-3"
          />

          <h3 class="font-bold">{{ p.nom }}</h3>

          <p v-if="p.oldPrice" class="text-gray-500 line-through">{{ p.oldPrice }} €</p>
          <p class="text-green-600 font-bold">{{ p.prix }} €</p>

          <button
            @click="ajouterAuPanier(p)"
            class="bg-green-600 text-white px-3 py-1 rounded mt-2 hover:bg-green-700"
          >
            Ajouter au panier
          </button>
        </div>
      </div>
    </section>

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
      const snapshotInt = await getDocs(collection(db, "products"));

      snapshotInt.forEach(doc => {
        const p = { id: doc.id, ...doc.data() };

        produitsInternes.value.push(p);

        if (p.promo === true) {
          // 🔹 Calcul prix promo
          p.oldPrice = p.prix; 
          p.prix = Math.round(p.prix * 0.5); // réduction 50 %
          produitsPromo.value.push(p);
        }
      });
    };

    onMounted(async () => {
      await fetchProduits();
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
/* Slider aligné à gauche, 75% bureau, 100% mobile */
.home-page .w-3\/4 {
  margin-left: 0;
}
</style>
