<template>
  <div class="w-full px-4">
    <!-- Vitrine -->
    <Vitrine
      :categories="categories"
      @category-selected="goToCategory"
    />

    <!-- Section produits -->
    <section v-if="!hasFilter" class="w-full mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      <div
        v-for="produit in produits"
        :key="produit.id"
        class="border rounded-lg p-4 bg-white shadow flex flex-col"
      >
        <img :src="produit.images[0]" class="h-40 w-full object-cover rounded mb-3" />
        <h3 class="font-bold text-lg">{{ produit.nom }}</h3>
        <p class="text-gray-600 text-sm mb-2">{{ produit.description }}</p>
        <p class="text-green-600 font-bold text-lg mb-3">{{ produit.prix }} $</p>
        <button
          @click="addToCart(produit)"
          class="mt-auto bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          Ajouter au panier
        </button>
      </div>
    </section>

    <!-- Résultats filtrés -->
    <section v-if="hasFilter" class="w-full mt-4">
      <h2 class="text-xl font-bold mb-2">Résultats filtrés</h2>

      <div v-if="filteredProducts.length === 0">
        <p>Aucun produit ne correspond à votre recherche.</p>
        <button
          @click="clearFilter"
          class="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Retour à l'accueil
        </button>
      </div>

      <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <div
          v-for="produit in filteredProducts"
          :key="produit.id"
          class="border rounded-lg p-4 bg-white shadow flex flex-col"
        >
          <img :src="produit.images[0]" class="h-40 w-full object-cover rounded mb-3" />
          <h3 class="font-bold text-lg">{{ produit.nom }}</h3>
          <p class="text-gray-600 text-sm mb-2">{{ produit.description }}</p>
          <p class="text-green-600 font-bold text-lg mb-3">{{ produit.prix }} $</p>
          <button
            @click="addToCart(produit)"
            class="mt-auto bg-green-600 text-white py-2 rounded hover:bg-green-700"
          >
            Ajouter au panier
          </button>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { ref, onMounted, computed, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import Vitrine from "../components/Vitrine.vue";

export default {
  components: { Vitrine },
  setup() {
    const produits = ref([]);
    const filteredProducts = ref([]);
    const categories = ref([
      { name: "T-shirts", slug: "t-shirts", emoji: "👕" },
      { name: "Sweats", slug: "sweats", emoji: "🧥" },
      { name: "Accessoires", slug: "accessoires", emoji: "🎒" },
      // 🔹 Ajouter toutes les catégories nécessaires
    ]);

    const route = useRoute();
    const router = useRouter();
    const store = useStore();

    const hasFilter = computed(() => route.query.search || route.query.categorie);

    const fetchProduits = async () => {
      const snapshot = await getDocs(collection(db, "products"));
      snapshot.forEach((doc) => {
        const produit = { id: doc.id, ...doc.data() };
        produits.value.push(produit);
      });
      applyFilter();
    };

    const applyFilter = () => {
      const searchText = (route.query.search || "").toLowerCase();
      const categorie = (route.query.categorie || "").toLowerCase();

      filteredProducts.value = produits.value.filter((p) => {
        const nom = (p.nom || "").toLowerCase();
        const description = (p.description || "").toLowerCase();
        const cat = (p.categorie || "").toLowerCase();

        const matchText =
          searchText === "" ||
          nom.includes(searchText) ||
          description.includes(searchText) ||
          cat.includes(searchText);

        const matchCategorie = categorie === "" || cat === categorie;

        return matchText && matchCategorie;
      });
    };

    const clearFilter = () => router.push({ path: "/" });
    const addToCart = (produit) => store.dispatch("addToCart", produit);

    const goToCategory = (slug) => {
      router.push({ path: "/", query: { categorie: slug } });
    };

    onMounted(fetchProduits);
    watch(() => route.query, applyFilter);

    return {
      produits,
      filteredProducts,
      categories,
      hasFilter,
      clearFilter,
      addToCart,
      goToCategory,
    };
  },
};
</script>
