<template>
  <div class="p-4">
    <!-- Vitrine principale -->
    <Vitrine />

    <!-- Slider produits promotions -->
    <HorizontalSlider
      :products="products"
      title="Promotions du jour"
      @add-to-cart="addToCart"
    />

    <!-- Slider autres produits -->
    <HorizontalSlider
      :products="otherProducts"
      title="Meilleures ventes"
      @add-to-cart="addToCart"
    />
  </div>
</template>

<script>
import HorizontalSlider from "./HorizontalSlider.vue";
import Vitrine from "../components/Vitrine.vue";
import { ref, onMounted } from "vue";
import axios from "axios";
import { useStore } from "vuex";

export default {
  components: { HorizontalSlider, Vitrine },
  setup() {
    const products = ref([]);
    const otherProducts = ref([]);
    const store = useStore();

    const fetchProducts = async () => {
      try {
        const res = await axios.get(
          "https://printfulapi-production.up.railway.app/printful/products"
        );
        products.value = res.data.products.slice(0, 10);
        otherProducts.value = res.data.products.slice(10, 20);
      } catch (err) {
        console.error(err);
      }
    };

    const addToCart = (product) => {
      store.dispatch("addToCart", product);
    };

    onMounted(fetchProducts);

    return { products, otherProducts, addToCart };
  },
};
</script>
