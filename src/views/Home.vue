<template>
  <div class="w-full m-0 p-0">

    <!-- Slider + Pub -->
    <section class="flex flex-col md:flex-row w-full items-stretch m-0 p-0">

      <!-- Slider -->
      <div class="md:w-2/3 w-full m-0 p-0">
        <SliderProducts :produits="produitsPromos" class="m-0 p-0" />
      </div>

      <!-- Pub -->
      <div class="md:w-1/3 w-full m-0 p-0">
        <div class="w-full h-full min-h-[320px] bg-yellow-200 flex items-center justify-center">
          Publicité
        </div>
      </div>

    </section>

    <!-- Vitrine sans espace -->
    <div class="m-0 p-0 -mt-0">
      <Vitrine class="m-0 p-0" />
    </div>

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

      snapshot.forEach((doc) => {
        const produit = { id: doc.id, ...doc.data() };

        produits.value.push(produit);

        if (produit.promo) {
          produitsPromos.value.push(produit);
        }
      });
    };

    onMounted(fetchProduits);

    return {
      produits,
      produitsPromos
    };
  }
};
</script>

<style scoped>
/* Supprimer tout margin/padding par défaut */
* {
  margin: 0;
  padding: 0;
}

/* Section Slider + Pub en ligne */
section {
  gap: 0 !important; /* supprime tout espace entre slider et pub */
}
</style>
