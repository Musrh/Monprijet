<template>
  <div class="w-full px-4">

    <!-- Section principale : Slider + Pubs -->
    <section class="flex flex-col md:flex-row w-full gap-4">

      <!-- Gauche : Slider et Vitrine -->
      <div class="md:w-2/3 w-full flex flex-col gap-4">
        <!-- Slider -->
        <SliderProducts :produits="produitsPromos" />

        <!-- Vitrine normale (si pas de filtre) -->
        <div v-if="!hasFilter">
          <Vitrine />
        </div>
      </div>

      <!-- Droite : Pub1 et Pub2 -->
      <div class="md:w-1/3 w-full flex flex-col gap-4">
        <!-- Pub1 -->
        <div class="h-64 bg-yellow-200 flex items-center justify-center rounded shadow-md overflow-hidden">
          <img
            src="https://res.cloudinary.com/dla18l69k/image/upload/v1773023706/rcvi8ukn3if9tycui13d.jpg"
            alt="EasyShopping Image"
            class="mx-auto rounded shadow-md max-w-full h-auto"
          />
        </div>

        <!-- Pub2 -->
        <div class="h-64 bg-yellow-200 flex items-center justify-center rounded shadow-md overflow-hidden">
          <img
            src="https://res.cloudinary.com/dla18l69k/image/upload/v1773193967/ujcme773ewq0eauqs557.jpg"
            alt="EasyShopping Image"
            class="mx-auto rounded shadow-md max-w-full h-auto"
          />
        </div>
      </div>

    </section>

    <!-- Résultats filtrés -->
    <section class="mt-6 w-full">
      <div v-if="hasFilter">

        <h2 class="text-xl font-bold mb-4">Résultats filtrés</h2>

        <!-- Aucun résultat -->
        <div v-if="filteredProducts.length === 0">
          <p>Aucun produit ne correspond à votre recherche.</p>
          <button
            @click="clearFilter"
            class="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Retour à l'accueil
          </button>
        </div>

        <!-- Résultats -->
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div
            v-for="produit in filteredProducts"
            :key="produit.id"
            class="border rounded-lg p-4 bg-white shadow flex flex-col"
          >
            <!-- Image -->
            <img :src="produit.images[0]" class="h-40 w-full object-cover rounded mb-3" />

            <!-- Nom -->
            <h3 class="font-bold text-lg">{{ produit.nom }}</h3>

            <!-- Description -->
            <p class="text-gray-600 text-sm mb-2">{{ produit.description }}</p>

            <!-- Prix -->
            <p class="text-green-600 font-bold text-lg mb-3">{{ produit.prix }} $</p>

            <!-- Bouton panier -->
            <button
              @click="addToCart(produit)"
              class="mt-auto bg-green-600 text-white py-2 rounded hover:bg-green-700"
            >
              Ajouter au panier
            </button>
          </div>
        </div>

      </div>
    </section>

  </div>
</template>

<script>
import { ref, onMounted, computed, watch } from "vue";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import SliderProducts from "../components/SliderProducts.vue";
import Vitrine from "../components/Vitrine.vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";

export default {
  components: { SliderProducts, Vitrine },

  setup() {
    const produits = ref([]);
    const produitsPromos = ref([]);
    const filteredProducts = ref([]);

    const route = useRoute();
    const router = useRouter();
    const store = useStore();

    const hasFilter = computed(() => route.query.search || route.query.categorie);

    const fetchProduits = async () => {
      const snapshot = await getDocs(collection(db, "products"));
      snapshot.forEach((doc) => {
        const produit = { id: doc.id, ...doc.data() };
        produits.value.push(produit);
        if (produit.promo) produitsPromos.value.push(produit);
      });
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

    onMounted(async () => {
      await fetchProduits();
      applyFilter();
    });

    watch(() => route.query, applyFilter);

    return { produitsPromos, filteredProducts, hasFilter, clearFilter, addToCart };
  },
};
</script>

<style scoped>
/* espace vertical léger entre sections */
section + section {
  margin-top: 1rem;
}
</style>
