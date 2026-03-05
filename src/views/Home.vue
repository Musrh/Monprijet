<template>
  <div class="w-full px-4">

    <!-- Slider + Pub -->
    <section class="flex flex-col md:flex-row w-full mb-4">

      <!-- Slider -->
      <div class="md:w-2/3 w-full">
        <SliderProducts :produits="produitsFiltrés" />
      </div>

      <!-- Pub -->
      <div class="md:w-1/3 w-full">
        <div class="h-full min-h-[320px] bg-yellow-200 flex items-center justify-center">
          Publicité
        </div>
      </div>

    </section>

    <!-- Résultat temporaire ou Vitrine -->
    <section>
      <div v-if="categorieSelectionnee || search">
        <h2 class="text-xl font-semibold mb-2">
          Résultats pour : 
          <span v-if="categorieSelectionnee">{{ categorieSelectionnee }}</span>
          <span v-if="search"> / "{{ search }}"</span>
        </h2>

        <div v-if="produitsFiltrés.length > 0" class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div v-for="produit in produitsFiltrés" :key="produit.id" class="border rounded p-2">
            <img :src="produit.images[0]" alt="" class="w-full h-40 object-cover mb-2">
            <h3 class="font-semibold">{{ produit.nom }}</h3>
            <p class="text-green-700 font-bold">{{ produit.prix }} €</p>
          </div>
        </div>

        <div v-else class="p-4 text-center text-gray-600">
          Aucun produit trouvé pour ce filtre.
        </div>

        <!-- Lien retour -->
        <button
          @click="resetHome"
          class="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Retour à la Home
        </button>
      </div>

      <!-- Vitrine initiale si pas de filtre -->
      <Vitrine v-else />
    </section>

  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { collection, getDocs } from "firebase/firestore";
import { useRoute } from "vue-router";
import { db } from "../firebase";
import SliderProducts from "../components/SliderProducts.vue";
import Vitrine from "../components/Vitrine.vue";

export default {
  components: { SliderProducts, Vitrine },

  setup() {
    const route = useRoute();
    const produits = ref([]);
    const produitsPromos = ref([]);
    const produitsFiltrés = ref([]);
    const categorieSelectionnee = ref(route.query.categorie || "");
    const search = ref(route.query.search || "");

    const fetchProduits = async () => {
      const snapshot = await getDocs(collection(db, "products"));

      snapshot.forEach((doc) => {
        const produit = { id: doc.id, ...doc.data() };
        produits.value.push(produit);
        if (produit.promo) produitsPromos.value.push(produit);
      });

      applyFilter();
    };

    const applyFilter = () => {
      produitsFiltrés.value = produits.value.filter(p => {
        const catOk = categorieSelectionnee.value ? p.categorie === categorieSelectionnee.value : true;
        const searchOk = search.value ? p.nom.toLowerCase().includes(search.value.toLowerCase()) : true;
        return catOk && searchOk;
      });

      // Si aucun filtre, afficher les produits en promo dans le slider
      if (!categorieSelectionnee.value && !search.value) {
        produitsFiltrés.value = produitsPromos.value;
      }
    };

    const resetHome = () => {
      categorieSelectionnee.value = "";
      search.value = "";
      produitsFiltrés.value = produitsPromos.value;
    };

    onMounted(fetchProduits);

    return {
      produitsPromos,
      produitsFiltrés,
      categorieSelectionnee,
      search,
      resetHome,
    };
  }
};
</script>
