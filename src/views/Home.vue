<template>
  <div class="home-page">

    <!-- Slider principal full-width -->
    <div v-if="produitsSlider.length" class="slider-container w-full overflow-hidden relative">
      <div class="slider flex transition-transform duration-500"
           :style="{ transform: `translateX(-${currentSlide * 100}%)` }">
        <div v-for="(p, index) in produitsSlider" :key="p.id" class="slide flex-shrink-0 w-full text-center">
          <img :src="p.images || p.image || p.imageUrl" 
               alt="Image produit" 
               class="w-full h-64 object-cover mb-2 rounded"/>
          <p class="text-lg font-semibold">{{ p.nom }}</p>
          <p class="text-green-600 font-bold">{{ p.prix }} €</p>
          <p class="text-gray-500">Vendus : {{ ventes[p.id] || 0 }}</p>
          <button @click="ajouterAuPanier(p)"
                  class="bg-green-600 text-white px-4 py-2 rounded mt-2 hover:bg-green-700 transition">
            Ajouter au panier
          </button>
          <span v-if="p.type" class="badge">{{ p.type }}</span>
        </div>
      </div>
    </div>

    <!-- Produit en vedette -->
    <div v-if="produitVedette" class="featured-product my-8 text-center">
      <h2 class="text-2xl font-bold mb-4">Produit en vedette</h2>
      <img :src="produitVedette.images || produitVedette.image || produitVedette.imageUrl" 
           alt="Produit vedette" class="w-64 h-64 object-cover mx-auto mb-2 rounded"/>
      <p class="text-lg font-semibold">{{ produitVedette.nom }}</p>
      <p class="text-green-600 font-bold">{{ produitVedette.prix }} €</p>
      <p class="text-gray-500">Vendus : {{ ventes[produitVedette.id] || 0 }}</p>
      <button @click="ajouterAuPanier(produitVedette)"
              class="bg-green-600 text-white px-4 py-2 rounded mt-2 hover:bg-green-700 transition">
        Ajouter au panier
      </button>
    </div>

    <!-- Produits en promotion -->
    <div v-if="produitsPromo.length" class="promo-slider flex items-center justify-center space-x-4 my-6">
      <button @click="prevPromo" class="bg-gray-300 px-3 py-1 rounded hover:bg-gray-400">‹</button>
      <div v-for="(p, index) in produitsPromo" :key="p.id" v-show="currentPromoIndex === index" class="text-center">
        <img :src="p.images || p.image || p.imageUrl" 
             alt="Produit promo" class="w-40 h-40 object-cover mb-2 rounded"/>
        <p class="font-semibold">{{ p.nom }}</p>
        <p class="text-green-600 font-bold">{{ p.prix }} €</p>
        <button @click="ajouterAuPanier(p)" 
                class="bg-green-600 text-white px-3 py-1 rounded mt-1 hover:bg-green-700 transition">
          Ajouter au panier
        </button>
      </div>
      <button @click="nextPromo" class="bg-gray-300 px-3 py-1 rounded hover:bg-gray-400">›</button>
    </div>

    <!-- Vitrine -->
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
        image: produit.images || produit.image || produit.imageUrl,
        quantity: 1,
      });
    };

    // 🔹 Récupérer tous les produits internes + externes
    const fetchProduits = async () => {
      produitsSlider.value = [];
      produitsPromo.value = [];

      const snapshotInt = await getDocs(collection(db, "products"));
      snapshotInt.forEach((doc) => {
        const p = { id: doc.id, ...doc.data(), type: "interne" };
        produitsSlider.value.push(p);
        if (p.promo) produitsPromo.value.push(p);
      });

      const snapshotExt = await getDocs(collection(db, "ProductsExternes"));
      snapshotExt.forEach((doc) => {
        const p = { id: doc.id, ...doc.data(), type: "externe" };
        produitsSlider.value.push(p);
        if (p.promo) produitsPromo.value.push(p);
      });
    };

    // 🔹 Récupérer les commandes payées et calculer les ventes
    const fetchCommandes = async () => {
      const snapshot = await getDocs(collection(db, "commandes"));
      snapshot.forEach((doc) => {
        const cmd = doc.data();
        if (cmd.statut !== "payé") return;
        const prodId = cmd.id;
        const qty = cmd.quantity || 0;
        ventes.value[prodId] = (ventes.value[prodId] || 0) + qty;
      });

      // Déterminer le produit vedette
      let max = 0;
      produitsSlider.value.forEach((p) => {
        const q = ventes.value[p.id] || 0;
        if (q > max) {
          max = q;
          produitVedette.value = { ...p };
        }
      });
    };

    // 🔹 Slider automatique
    const nextSlide = () => {
      if (produitsSlider.value.length > 0) {
        currentSlide.value = (currentSlide.value + 1) % produitsSlider.value.length;
      }
    };

    // 🔹 Slider promo automatique
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
.slider-container {
  width: 100%;
  overflow: hidden;
}

.slide {
  min-width: 100%;
  text-align: center;
}

.featured-product {
  margin: 2rem 0;
}

.promo-slider {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

.badge {
  display: inline-block;
  margin-left: 0.5rem;
  padding: 0.1rem 0.3rem;
  font-size: 0.7rem;
  background-color: #4ade80;
  color: white;
  border-radius: 0.25rem;
}
</style>
