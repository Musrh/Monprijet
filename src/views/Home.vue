<template>
  <div class="px-4">

    <!-- Section Slider + Pub -->
    <section class="flex flex-col md:flex-row gap-4 my-8">

      <!-- Slider des produits promos -->
      <div class="w-full md:w-3/4">
        <SliderProducts :produits="produitsPromos" />
      </div>

      <!-- Pub à côté du slider -->
      <div class="w-full md:w-1/4">
        <div class="h-64 bg-yellow-200 flex items-center justify-center rounded shadow">
          Publicité
        </div>
      </div>

    </section>

    <!-- Vitrine -->
    <Vitrine />

  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import SliderProducts from "../components/SliderProducts.vue";
import Vitrine from "../components/Vitrine.vue";

export default {
  components: { SliderProducts, Vitrine },
  setup() {
    const produits = ref([]);
    const produitsPromos = ref([]);

    const fetchProduits = async () => {
      const snapshot = await getDocs(collection(db, "products"));
      const loaded = [];
      snapshot.forEach((doc) => {
        const produit = { id: doc.id, ...doc.data() };
        loaded.push(produit);
        // Sélection des promos
        if (produit.promo) produitsPromos.value.push(produit);
      });
      produits.value = loaded;
    };

    onMounted(() => fetchProduits());

    return { produits, produitsPromos };
  },
};
</script>

<style scoped>
/* Les styles sont gérés par Tailwind, rien à ajouter */
</style>
