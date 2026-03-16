<template>
  <div class="p-4 w-full">

    <!-- Slider des produits Printful avant la vitrine -->
    <section class="mb-4">
      <HorizontalSlider
        :products="printfulProducts"
        title="Produits Populaires"
        @add-to-cart="addToCart"
      />
    </section>

    <!-- Vitrine normale -->
    <section class="mb-4">
      <Vitrine />
    </section>

    <!-- Slider produits promotions -->
    <section class="mb-4">
      <HorizontalSlider
        :products="productsPromo"
        title="Promotions du jour"
        @add-to-cart="addToCart"
      />
    </section>

    <!-- Slider autres produits -->
    <section class="mb-4">
      <HorizontalSlider
        :products="otherProducts"
        title="Meilleures ventes"
        @add-to-cart="addToCart"
      />
    </section>

  </div>
</template>

<script>
import HorizontalSlider from "../components/HorizontalSlider.vue";
import Vitrine from "../components/Vitrine.vue";
import { ref, onMounted } from "vue";
import axios from "axios";
import { useStore } from "vuex";

export default {
  components: { HorizontalSlider, Vitrine },
  setup() {
    const printfulProducts = ref([]);
    const productsPromo = ref([]);
    const otherProducts = ref([]);
    const store = useStore();

    const fetchPrintfulProducts = async () => {
      try {
        const res = await axios.get(
          "https://printfulapi-production.up.railway.app/printful/products"
        );
        // Trier selon vos besoins, ici simplement premier lot pour l'exemple
        printfulProducts.value = res.data.products;
      } catch (err) {
        console.error("Erreur Printful:", err);
      }
    };

    const fetchLocalProducts = async () => {
      try {
        const res = await axios.get("/api/local-products"); // Exemple
        const allProducts = res.data.products || [];
        productsPromo.value = allProducts.filter((p) => p.promo);
        otherProducts.value = allProducts.filter((p) => !p.promo);
      } catch (err) {
        console.error(err);
      }
    };

    const addToCart = (product) => {
      // Passer le prix correct
      store.dispatch("addToCart", {
        id: product.id,
        name: product.name,
        price: product.price,
        thumbnail: product.thumbnail,
      });
    };

    onMounted(() => {
      fetchPrintfulProducts();
      fetchLocalProducts();
    });

    return { printfulProducts, productsPromo, otherProducts, addToCart };
  },
};
</script>

<style scoped>
/* Espace vertical léger entre sections */
section + section {
  margin-top: 1rem;
}
</style>
