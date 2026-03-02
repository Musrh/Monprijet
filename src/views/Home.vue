<template>
  <div class="home">

    <!-- 🔹 Slider principal -->
    <section class="relative w-full overflow-hidden mb-8">
      <div class="flex transition-transform duration-500" :style="{ transform: `translateX(-${currentSlide * 100}%)` }">
        <div
          v-for="p in produitsSlider"
          :key="p.id"
          class="w-full flex-shrink-0 relative h-64"
        >
          <img :src="p.images" :alt="p.nom" class="w-full h-full object-cover" />
          <div class="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white p-2 rounded">
            <h3 class="font-semibold">{{ p.nom }}</h3>
            <p>{{ p.prix }} €</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 🔹 Produit vedette + promos -->
    <section class="flex flex-col md:flex-row gap-8 mb-8">

      <!-- Produit vedette -->
      <div class="featured w-full md:w-1/2">
        <h2 class="text-xl font-bold mb-4">Produit en vedette</h2>
        <div v-if="produitVedette" class="border p-4 rounded shadow text-center">
          <img :src="produitVedette.images" :alt="produitVedette.nom" class="w-full h-64 object-cover rounded" />
          <h3 class="font-semibold mt-2">{{ produitVedette.nom }}</h3>
          <p>{{ produitVedette.prix }} €</p>
          <p>Vendu : {{ ventes[produitVedette.id] || 0 }} fois</p>
          <button
            @click="ajouterAuPanier(produitVedette)"
            class="mt-2 bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
          >
            Ajouter au panier
          </button>
        </div>
        <div v-else class="text-gray-500">Aucun produit vendu pour l'instant.</div>
      </div>

      <!-- Produits en promotion -->
      <div class="promos w-full md:w-1/2">
        <h2 class="text-xl font-bold mb-4">Promotions</h2>
        <div v-if="produitsPromo.length" class="relative w-full h-64 rounded shadow-lg overflow-hidden">
          <div class="flex transition-transform duration-500" :style="{ transform: `translateX(-${currentPromoIndex * 100}%)` }">
            <div
              v-for="p in produitsPromo"
              :key="p.id"
              class="w-full flex-shrink-0 p-2 text-center relative"
            >
              <img :src="p.images" :alt="p.nom" class="w-full h-48 object-cover rounded" />
              <h3 class="font-semibold mt-2">{{ p.nom }}</h3>
              <p><s>{{ p.prix }} €</s> {{ Math.round(p.prix * 0.5) }} €</p>
              <button
                @click="ajouterAuPanier(p)"
                class="mt-2 bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
              >
                Ajouter au panier
              </button>
              <span class="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded">Promo 50%</span>
            </div>
          </div>

          <!-- flèches navigation promos -->
          <button
            @click="prevPromo"
            class="absolute top-1/2 left-2 -translate-y-1/2 bg-green-600 text-white rounded-full p-2 hover:bg-green-700"
          >‹</button>
          <button
            @click="nextPromo"
            class="absolute top-1/2 right-2 -translate-y-1/2 bg-green-600 text-white rounded-full p-2 hover:bg-green-700"
          >›</button>
        </div>
        <div v-else class="text-gray-500">Aucune promotion pour l'instant.</div>
      </div>

    </section>

    <!-- 🔹 Vitrine -->
    <Vitrine />

  </div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { collection, getDocs } from "firebase/firestore";
import { useStore } from "vuex";
import { db } from "../firebase";

import Vitrine from "../components/Vitrine.vue";

export default {
  name: "Home",
  components: { Vitrine },
  setup() {
    const store = useStore();

    const produitsSlider = ref([]);
    const produitVedette = ref(null);
    const produitsPromo = ref([]);
    const ventes = ref({});
    const currentSlide = ref(0);
    const currentPromoIndex = ref(0);
    let sliderInterval = null;
    let promoInterval = null;

    const ajouterAuPanier = (produit) => {
      store.dispatch("addToCart", {
        ...produit,
        image: produit.images,
        quantity: 1,
      });
    };

    const fetchProduits = async () => {
      const snapshot = await getDocs(collection(db, "products"));
      snapshot.forEach((doc) => {
        const p = { id: doc.id, ...doc.data() };
        produitsSlider.value.push(p);
        if (p.promo) produitsPromo.value.push(p);
      });
    };

    const fetchCommandes = async () => {
      const snapshot = await getDocs(collection(db, "commandes"));
      snapshot.forEach((doc) => {
        const cmd = doc.data();
        cmd.items?.forEach((item) => {
          ventes.value[item.id] = (ventes.value[item.id] || 0) + item.quantity;
        });
      });

      // Produit vedette = le plus vendu
      let max = 0;
      produitsSlider.value.forEach((p) => {
        const q = ventes.value[p.id] || 0;
        if (q > max) {
          max = q;
          produitVedette.value = { ...p };
        }
      });
    };

    const nextSlide = () => {
      if (produitsSlider.value.length > 0) {
        currentSlide.value = (currentSlide.value + 1) % produitsSlider.value.length;
      }
    };
    const nextPromo = () => {
      if (produitsPromo.value.length > 0) {
        currentPromoIndex.value =
          (currentPromoIndex.value + 1) % produitsPromo.value.length;
      }
    };
    const prevPromo = () => {
      if (produitsPromo.value.length > 0) {
        currentPromoIndex.value =
          (currentPromoIndex.value - 1 + produitsPromo.value.length) %
          produitsPromo.value.length;
      }
    };

    onMounted(async () => {
      await fetchProduits();
      await fetchCommandes();

      // Slider automatique toutes les 3s
      sliderInterval = setInterval(nextSlide, 3000);
      promoInterval = setInterval(nextPromo, 3000);
    });

    onBeforeUnmount(() => {
      clearInterval(sliderInterval);
      clearInterval(promoInterval);
    });

    return {
      produitsSlider,
      produitVedette,
      produitsPromo,
      ventes,
      currentSlide,
      currentPromoIndex,
      ajouterAuPanier,
      nextPromo,
      prevPromo,
    };
  },
};
</script>

<style scoped>
.home img {
  display: block;
  width: 100%;
  object-fit: cover;
}
</style>
