<template>
  <div class="w-full px-4 mt-6">

    <!-- Slider promo -->
    <SliderProducts :produits="produitsPromos" />

    <!-- Section produits Printful -->
    <PrintfulProducts :api-url="printfulUrl" />

    <!-- Vitrine catégories -->
    <Vitrine :categories="categoriesLocalized" />

  </div>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import { useStore } from "vuex";
import SliderProducts from "../components/SliderProducts.vue";
import Vitrine from "../components/Vitrine.vue";
import PrintfulProducts from "./PrintfulProducts.vue";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

export default {
  name: "Home",
  components: {
    SliderProducts,
    Vitrine,
    PrintfulProducts
  },

  setup() {

    const store = useStore();

    const produitsPromos = ref([]);

    // 🔹 Langue actuelle (module namespaced)
    const currentLang = computed(() =>
      store.getters["language/currentLanguage"]
    );

    // 🔹 Catégories FR
    const categoriesFR = [
      { name: "T-shirts", slug: "t-shirts", emoji: "👕" },
      { name: "Sweats", slug: "sweats", emoji: "🧥" },
      { name: "Accessoires", slug: "accessoires", emoji: "🎒" },
      { name: "Montres", slug: "watch", emoji: "⌚" }
    ];

    // 🔹 Catégories EN
    const categoriesEN = [
      { name: "T-shirts", slug: "t-shirts", emoji: "👕" },
      { name: "Sweatshirts", slug: "sweats", emoji: "🧥" },
      { name: "Accessories", slug: "accessoires", emoji: "🎒" },
      { name: "Watches", slug: "watch", emoji: "⌚" }
    ];

    // 🔹 Catégories dynamiques selon langue
    const categoriesLocalized = computed(() =>
      currentLang.value === "fr" ? categoriesFR : categoriesEN
    );

    const printfulUrl =
      "https://printfulapi-production.up.railway.app/printful/products";

    // 🔹 Charger produits en promo
    const fetchPromos = async () => {
      try {
        const snapshot = await getDocs(collection(db, "products"));

        produitsPromos.value = snapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter(product => product.promo === true);

      } catch (error) {
        console.error("Erreur chargement promos:", error);
      }
    };

    onMounted(fetchPromos);

    return {
      produitsPromos,
      categoriesLocalized,
      printfulUrl
    };
  }
};
</script>
