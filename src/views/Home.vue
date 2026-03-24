<template>
  <div class="w-full px-4 mt-6">

    <!-- Slider promo -->
    <SliderProducts :produits="produitsPromos" />

    <!-- Section produits Printful -->
    <PrintfulProducts :api-url="printfulUrl" />

    <!-- Vitrine catégories après Printful -->
    <Vitrine :categories="categoriesLocalized" />

  </div>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import SliderProducts from "../components/SliderProducts.vue";
import Vitrine from "../components/Vitrine.vue";
import PrintfulProducts from "./PrintfulProducts.vue";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

export default {
  components: { SliderProducts, Vitrine, PrintfulProducts },
  setup(_, { root }) {
    const produitsPromos = ref([]);

    // 🔹 Accès au store pour langue
    const currentLang = computed(() => root.$store.getters["language/currentLanguage"]);

    // 🔹 Catégories multilingues
    const categoriesFR = [
      { name: "T-shirts", slug: "t-shirts", emoji: "👕" },
      { name: "Sweats", slug: "sweats", emoji: "🧥" },
      { name: "Accessoires", slug: "accessoires", emoji: "🎒" },
      { name: "Montres", slug: "watch", emoji: "⌚" }
    ];
    const categoriesEN = [
      { name: "T-shirts", slug: "t-shirts", emoji: "👕" },
      { name: "Sweatshirts", slug: "sweats", emoji: "🧥" },
      { name: "Accessories", slug: "accessoires", emoji: "🎒" },
      { name: "Watches", slug: "watch", emoji: "⌚" }
    ];

    const categoriesLocalized = computed(() => currentLang.value === "fr" ? categoriesFR : categoriesEN);

    const printfulUrl = "https://printfulapi-production.up.railway.app/printful/products";

    // 🔹 Récupération des promos depuis Firestore
    const fetchPromos = async () => {
      const snapshot = await getDocs(collection(db, "products"));
      snapshot.forEach(doc => {
        const produit = { id: doc.id, ...doc.data() };
        if (produit.promo) produitsPromos.value.push(produit);
      });
    };

    onMounted(fetchPromos);

    return { produitsPromos, categoriesLocalized, printfulUrl };
  },
};
</script>
