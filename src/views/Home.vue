<template>
  <div class="home">

    <!-- Slider principal -->
    <SliderProducts :produits="produitsSlider" />

    <!-- Section produit vedette + promos -->
    <section class="flex flex-col md:flex-row gap-8 mt-8">

      <!-- Produit vedette -->
      <div class="featured w-full md:w-1/2">
        <h2 class="text-xl font-bold mb-4">Produit en vedette</h2>
        <div v-if="produitVedette" class="border p-4 rounded shadow text-center">
          <img :src="produitVedette.images" :alt="produitVedette.nom" class="w-full h-64 object-cover rounded mb-2" />
          <h3 class="font-semibold mt-2">{{ produitVedette.nom }}</h3>
          <p>{{ produitVedette.prix }} €</p>
          <p>Vendu : {{ ventes[produitVedette.id] || 0 }} fois</p>
          <button
            @click="ajouterAuPanier(produitVedette)"
            class="mt-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 w-full"
          >
            Ajouter au panier
          </button>
        </div>
        <div v-else class="text-gray-500">Aucun produit vendu pour l'instant.</div>
      </div>

      <!-- Produits en promotion -->
      <div class="promos w-full md:w-1/2">
        <h2 class="text-xl font-bold mb-4">Promotions</h2>
        <div v-if="produitsPromo.length" class="relative w-full h-64 overflow-hidden rounded shadow-lg">

          <!-- Slider promo -->
          <div class="flex transition-transform duration-500"
               :style="{ transform: `translateX(-${currentPromoIndex * 100}%)` }">
            <div v-for="p in produitsPromo" :key="p.id" class="w-full flex-shrink-0 p-2 text-center relative">
              <img :src="p.images" :alt="p.nom" class="w-full h-48 object-cover rounded mb-2" />
              <h3 class="font-semibold">{{ p.nom }}</h3>
              <p><s>{{ p.prix }} €</s> {{ Math.round(p.prix * 0.5) }} €</p>
              <button
                @click="ajouterAuPanier(p)"
                class="mt-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 w-full"
              >
                Ajouter au panier
              </button>
              <span class="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded">-50%</span>
            </div>
          </div>

          <!-- Flèches navigation -->
          <button @click="prevPromo"
                  class="absolute top-1/2 left-2 -translate-y-1/2 bg-green-600 text-white rounded-full p-2 hover:bg-green-700">‹</button>
          <button @click="nextPromo"
                  class="absolute top-1/2 right-2 -translate-y-1/2 bg-green-600 text-white rounded-full p-2 hover:bg-green-700">›</button>
        </div>
        <div v-else class="text-gray-500">Aucune promotion pour l'instant.</div>
      </div>

    </section>

  </div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { collection, getDocs } from "firebase/firestore";
import { useStore } from "vuex";
import { db } from "../firebase";
import SliderProducts from "./SliderProducts.vue";

export default {
  components: { SliderProducts },
  setup() {
    const store = useStore();

    const produitsSlider = ref([]);
    const produitsPromo = ref([]);
    const produitVedette = ref(null);
    const ventes = ref({});
    const currentPromoIndex = ref(0);
    let promoInterval = null;

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
        cmd.items?.forEach(item => {
          if (!ventes.value[item.id]) ventes.value[item.id] = 0;
          ventes.value[item.id] += item.quantity;
        });
      });

      // Produit vedette = plus vendu
      let max = 0;
      produitsSlider.value.forEach(p => {
        const q = ventes.value[p.id] || 0;
        if (q > max) {
          max = q;
          produitVedette.value = p;
        }
      });
    };

    const ajouterAuPanier = (produit) => {
      store.dispatch("addToCart", { ...produit, image: produit.images, quantity: 1 });
      alert(`${produit.nom} ajouté au panier !`);
    };

    const nextPromo = () => {
      if (produitsPromo.value.length)
        currentPromoIndex.value = (currentPromoIndex.value + 1) % produitsPromo.value.length;
    };
    const prevPromo = () => {
      if (produitsPromo.value.length)
        currentPromoIndex.value = (currentPromoIndex.value - 1 + produitsPromo.value.length) % produitsPromo.value.length;
    };

    onMounted(async () => {
      await fetchProduits();
      await fetchCommandes();

      // slider automatique
      if (produitsPromo.value.length > 1) promoInterval = setInterval(nextPromo, 3000);
    });

    onBeforeUnmount(() => {
      if (promoInterval) clearInterval(promoInterval);
    });

    return {
      produitsSlider,
      produitsPromo,
      produitVedette,
      ventes,
      currentPromoIndex,
      nextPromo,
      prevPromo,
      ajouterAuPanier
    };
  }
};
</script>

<style scoped>
.home img {
  display: block;
  width: 100%;
  object-fit: cover;
}
</style>
