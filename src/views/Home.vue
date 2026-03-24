<template>
  <div class="w-full px-4 mt-6">

    <!-- Slider promo -->
    <SliderProducts :produits="produitsPromos" />

    <!-- Section produits Printful -->
    <PrintfulProducts :api-url="printfulUrl" />

    <!-- Vitrine catégories après Printful -->
    <Vitrine :categories="categories" />

  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import SliderProducts from "../components/SliderProducts.vue";
import Vitrine from "../components/Vitrine.vue";
import PrintfulProducts from "./PrintfulProducts.vue";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

export default {
  components: { SliderProducts, Vitrine, PrintfulProducts },
  setup() {
    const produitsPromos = ref([]);
    const categories = ref([
      { name: "T-shirts", slug: "t-shirts", emoji: "👕" },
      { name: "Sweats", slug: "sweats", emoji: "🧥" },
      { name: "Accessoires", slug: "accessoires", emoji: "🎒" },
      { name: "Montres", slug: "watch", emoji: "⌚" }
    ]);

    const printfulUrl = "https://printfulapi-production.up.railway.app/printful/products";

    const fetchPromos = async () => {
      const snapshot = await getDocs(collection(db, "products"));
      snapshot.forEach(doc => {
        const produit = { id: doc.id, ...doc.data() };
        if (produit.promo) produitsPromos.value.push(produit);
      });
    };

    onMounted(fetchPromos);

    return { produitsPromos, categories, printfulUrl };
  },
};
</script>
