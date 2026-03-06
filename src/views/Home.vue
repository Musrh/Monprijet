<template>
  <div class="w-full px-4">

    <!-- Slider + Pub -->
    <section class="flex flex-col md:flex-row w-full gap-0">
      <!-- Slider -->
      <div class="md:w-2/3 w-full">
        <SliderProducts :produits="produitsPromos" />
      </div>

      <!-- Pub -->
      <div class="md:w-1/3 w-full">
        <div class="h-full min-h-[320px] bg-yellow-200 flex items-center justify-center">
          Publicité
        </div>
      </div>
    </section>

    <!-- Résultats filtrés ou Vitrine -->
    <section class="my-8">
      <div v-if="filtreActif">
        <h2 class="text-xl font-bold mb-4">Résultats filtrés</h2>

        <div v-if="produitsFiltres.length === 0">
          Aucun produit ne correspond à votre recherche.
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div
            v-for="p in produitsFiltres"
            :key="p.id"
            class="border rounded p-3 flex flex-col items-center"
          >
            <img :src="p.images[0]" alt="" class="h-32 object-cover mb-2" />
            <span class="font-semibold">{{ p.nom }}</span>
            <span class="text-gray-600">{{ p.prix }} $</span>
          </div>
        </div>

        <button
          @click="resetFiltre"
          class="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Revenir à l'accueil
        </button>
      </div>

      <Vitrine v-else />
    </section>

  </div>
</template>

<script>
import { ref, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import SliderProducts from "../components/SliderProducts.vue";
import Vitrine from "../components/Vitrine.vue";

export default {
  components: { SliderProducts, Vitrine },

  setup() {
    const route = useRoute();
    const router = useRouter();

    const produits = ref([]);
    const produitsPromos = ref([]);
    const produitsFiltres = ref([]);
    const filtreActif = ref(false);

    // 🔹 Charger les produits
    const fetchProduits = async () => {
      const snapshot = await getDocs(collection(db, "products"));
      snapshot.forEach(doc => {
        const produit = { id: doc.id, ...doc.data() };
        produits.value.push(produit);
        if (produit.promo) produitsPromos.value.push(produit);
      });
      appliquerFiltre(); // Appliquer filtre si query présente
    };

    onMounted(fetchProduits);

    // 🔹 Appliquer filtre selon query
    const appliquerFiltre = () => {
      const search = route.query.search || "";
      const categorie = route.query.categorie || "";

      if (search || categorie) {
        produitsFiltres.value = produitsPromos.value.filter(p => {
          let ok = true;
          if (categorie) ok = ok && p.categorie.toLowerCase() === categorie.toLowerCase();
          if (search) ok = ok && p.nom.toLowerCase().includes(search.toLowerCase());
          return ok;
        });
        filtreActif.value = true;
      } else {
        produitsFiltres.value = [];
        filtreActif.value = false;
      }
    };

    // 🔹 Observer les changements de query
    watch(() => route.query, appliquerFiltre);

    // 🔹 Réinitialiser pour revenir à l'accueil
    const resetFiltre = () => {
      router.push({ path: "/" });
    };

    return {
      produitsPromos,
      produitsFiltres,
      filtreActif,
      resetFiltre
    };
  }
};
</script>

<style scoped>
/* Supprimer tout espace entre slider et pub */
section.flex > div {
  margin: 0 !important;
}
</style>
