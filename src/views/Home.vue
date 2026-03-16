<template>
  <div>
    <!-- Slider principal -->
    <SliderProducts :produits="produitsPromos" />

    <!-- Produits Printful en horizontal slider -->
    <HorizontalSlider
      :products="printfulProducts"
      :onAddToCart="addToCart"
    />

    <!-- Vitrine -->
    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
      <Vitrine />
    </div>
  </div>
</template>

<script>
import SliderProducts from "./SliderProducts.vue";
import HorizontalSlider from "./HorizontalSlider.vue";
import Vitrine from "../components/Vitrine.vue";
import { ref, onMounted } from "vue";
import axios from "axios";

export default {
  components: { SliderProducts, HorizontalSlider, Vitrine },
  setup() {
    const printfulProducts = ref([]);

    const fetchPrintfulProducts = async () => {
      try {
        const res = await axios.get(
          "https://printfulapi-production.up.railway.app/printful/products"
        );
        printfulProducts.value = res.data.products;
      } catch (err) {
        console.error(err);
      }
    };

    onMounted(() => {
      fetchPrintfulProducts();
    });

    const addToCart = (product) => {
      console.log("Ajouter au panier :", product);
      // Ici, dispatch vers store Vuex si utilisé
    };

    return { printfulProducts, addToCart };
  },
};
</script>
