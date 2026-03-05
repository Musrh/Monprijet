<template>
  <div>

    <!-- Slider + Pub -->
    <section class="flex flex-col md:flex-row gap-0 w-full">

      <!-- Slider -->
      <div class="md:w-2/3 w-full p-0 m-0">
        <SliderProducts :produits="produitsPromos" />
      </div>

      <!-- Publicité -->
      <div class="md:w-1/3 w-full p-0 m-0">
        <div class="w-full h-full min-h-[320px] bg-yellow-200 flex items-center justify-center">
          Publicité
        </div>
      </div>

    </section>

    <!-- Vitrine -->
    <div class="mt-8">
      <Vitrine />
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

      const loaded = [];

      snapshot.forEach((doc) => {
        const produit = { id: doc.id, ...doc.data() };

        loaded.push(produit);

        if (produit.promo) {
          produitsPromos.value.push(produit);
        }
      });

      produits.value = loaded;
    };

    onMounted(fetchProduits);

    return {
      produits,
      produitsPromos
    };
  }
};
</script>
