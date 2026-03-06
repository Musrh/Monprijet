<template>
  <div class="w-full px-4">

    <!-- Slider + Pub -->
    <section class="flex flex-col md:flex-row w-full gap-0">

      <!-- Slider -->
      <div class="md:w-2/3 w-full">
        <SliderProducts :produits="produitsFiltres.length ? produitsFiltres : produitsPromos" />
      </div>

      <!-- Pub -->
      <div class="md:w-1/3 w-full">
        <div class="h-full min-h-[320px] bg-yellow-200 flex items-center justify-center">
          Publicité
        </div>
      </div>

    </section>

    <!-- Résultats filtrés ou vitrine -->
    <section class="my-6">
      <div v-if="produitsFiltres.length && (routeQuery.search || routeQuery.categorie)">
        <h2 class="font-bold text-xl mb-3">Résultats filtrés</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div v-for="p in produitsFiltres" :key="p.id" class="border p-3 rounded shadow">
            <img :src="p.images[0]" class="h-40 w-full object-cover rounded mb-2" />
            <div class="font-semibold">{{ p.nom }}</div>
            <div>{{ p.prix }} €</div>
          </div>
        </div>
        <router-link to="/" class="text-purple-600 underline mt-4 inline-block">Revenir à l'accueil</router-link>
      </div>
      <div v-else>
        <Vitrine />
      </div>
    </section>

  </div>
</template>

<script>
import { ref, onMounted, computed } from "vue";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import SliderProducts from "../components/SliderProducts.vue";
import Vitrine from "../components/Vitrine.vue";
import { useRoute } from "vue-router";

export default {
  components: { SliderProducts, Vitrine },
  setup() {
    const produits = ref([]);
    const produitsPromos = ref([]);
    const route = useRoute();

    const routeQuery = computed(() => ({
      search: route.query.search || "",
      categorie: route.query.categorie || ""
    }));

    const fetchProduits = async () => {
      const snapshot = await getDocs(collection(db, "products"));
      snapshot.forEach(doc => {
        const produit = { id: doc.id, ...doc.data() };
        produits.value.push(produit);
        if (produit.promo) produitsPromos.value.push(produit);
      });
    };

    onMounted(fetchProduits);

    // Produits filtrés selon recherche ou catégorie
    const produitsFiltres = computed(() => {
      let result = produits.value;

      if (routeQuery.value.categorie) {
        result = result.filter(p => p.categorie === routeQuery.value.categorie);
      }
      if (routeQuery.value.search) {
        const s = routeQuery.value.search.toLowerCase();
        result = result.filter(p => p.nom.toLowerCase().includes(s));
      }

      return result;
    });

    return { produitsPromos, produitsFiltres, routeQuery };
  }
};
</script>

<style scoped>
/* Supprime l'espace vertical entre slider et vitrine */
section {
  margin: 0;
  padding: 0;
}
</style>
