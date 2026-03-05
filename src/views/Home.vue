<template>
  <div>
    <!-- Slider des produits en promo -->
    <SliderProducts :produits="produits" />

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

    const fetchProduits = async () => {
      const snapshot = await getDocs(collection(db, "products"));
      const loaded = [];
      snapshot.forEach((doc) => loaded.push({ id: doc.id, ...doc.data() }));
      produits.value = loaded;
    };

    onMounted(() => fetchProduits());

    return { produits };
  },
};
</script>
