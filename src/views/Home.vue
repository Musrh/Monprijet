<template>
  <div class="w-full px-4">
    <!-- Slider + Pub -->
    <section class="flex flex-col md:flex-row w-full gap-0">
      <div class="md:w-2/3 w-full">
        <SliderProducts :produits="produitsFiltres" />
      </div>
      <div class="md:w-1/3 w-full">
        <div class="h-full min-h-[320px] bg-yellow-200 flex items-center justify-center">
          Publicité
        </div>
      </div>
    </section>

    <!-- Bouton retour si filtre actif -->
    <div v-if="filtreActif" class="my-4 text-right">
      <button @click="resetFiltre" class="bg-gray-300 px-3 py-1 rounded hover:bg-gray-400">
        Retour à la vitrine
      </button>
    </div>

    <!-- Vitrine seulement si pas de filtre -->
    <Vitrine v-if="!filtreActif" />
  </div>
</template>

<script>
import { ref, onMounted, watch } from "vue";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import SliderProducts from "../components/SliderProducts.vue";
import Vitrine from "../components/Vitrine.vue";
import { useRoute, useRouter } from "vue-router";

export default {
  components: { SliderProducts, Vitrine },
  setup() {
    const route = useRoute();
    const router = useRouter();

    const produits = ref([]);
    const produitsPromos = ref([]);
    const produitsFiltres = ref([]);
    const filtreActif = ref(false);

    const fetchProduits = async () => {
      const snapshot = await getDocs(collection(db, "products"));
      snapshot.forEach(doc => {
        const p = { id: doc.id, ...doc.data() };
        produits.value.push(p);
        if (p.promo) produitsPromos.value.push(p);
      });
      appliquerFiltre();
    };

    const appliquerFiltre = () => {
      const search = route.query.search || "";
      const categorie = route.query.categorie || "";

      if (search || categorie) {
        produitsFiltres.value = produitsPromos.value.filter(p => {
          let ok = true;
          if (categorie) ok = ok && p.categorie === categorie;
          if (search) ok = ok && p.nom.toLowerCase().includes(search.toLowerCase());
          return ok;
        });
        filtreActif.value = true;
      } else {
        produitsFiltres.value = produitsPromos.value;
        filtreActif.value = false;
      }
    };

    const resetFiltre = () => router.push({ path: "/" });

    onMounted(fetchProduits);
    watch(() => route.query, appliquerFiltre);

    return { produitsFiltres, filtreActif, resetFiltre };
  }
};
</script>
