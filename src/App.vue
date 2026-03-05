<template>
  <div class="min-h-screen bg-gray-100 px-4">

    <!-- Slider et pub côte à côte -->
    <section class="flex flex-col md:flex-row gap-6 my-8">
      <!-- Slider produits promos -->
      <div class="md:w-3/4 w-full pr-2">
        <SliderProducts :produits="produitsPromos" />
      </div>

      <!-- Pub à côté du slider -->
      <div class="md:w-1/4 w-full pl-2">
        <div class="h-64 bg-yellow-200 flex items-center justify-center rounded shadow text-center font-bold">
          Publicité ici
        </div>
      </div>
    </section>

    <!-- Vitrine -->
    <Vitrine />
  </div>
</template>

<script>
import { ref, onMounted, computed } from "vue";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";
import SliderProducts from "../components/SliderProducts.vue";
import Vitrine from "../components/Vitrine.vue";

export default {
  components: { SliderProducts, Vitrine },
  setup() {
    const produits = ref([]);

    const fetchProduits = async () => {
      const snapshot = await getDocs(collection(db, "products"));
      const loaded = [];
      snapshot.forEach((doc) => loaded.push({ id: doc.id, ...doc.data() }));
      produits.value = loaded;
    };

    onMounted(() => fetchProduits());

    // Produits promos uniquement pour le slider
    const produitsPromos = computed(() => produits.value.filter(p => p.promo));

    return { produitsPromos };
  },
};
</script>

<style scoped>
/* Optionnel : ajustements visuels */
section {
  max-width: 1200px;
  margin: 0 auto;
}

.slider-products, .pub {
  border-radius: 8px;
}

.pub {
  background-color: #facc15; /* jaune pub */
}

@media (max-width: 768px) {
  section {
    flex-direction: column;
  }
}
</style>
