<template>
  <div class="home">
    <!-- Slider principal -->
    <SliderProducts :produits="produits" />
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

    const fetchProduits = async () => {
      const snapshot = await getDocs(collection(db, "products"));
      snapshot.forEach(doc => {
        const p = doc.data();
        p.id = doc.id;
        produits.value.push(p);
      });
    };

    onMounted(() => {
      fetchProduits();
    });

    return { produits };
  }
};
</script>

<style scoped>
.home {
  max-width: 1200px;
  margin: 0 auto;
  padding: 16px;
}
</style>
