<template>
  <div class="home-page">

    <!-- Slider principal -->
    <div v-if="produitsSlider.length" class="slider-container">
      <div class="slider">
        <div v-for="(p, index) in produitsSlider" :key="p.id" 
             v-show="currentSlide === index" 
             class="slide">
          <p>{{ p.nom }}</p>
          <p>{{ p.prix }} €</p>
          <p>Vendus : {{ ventes[p.id] || 0 }}</p>
          <button @click="ajouterAuPanier(p)">Ajouter au panier</button>
          <span v-if="p.type" class="badge">{{ p.type }}</span>
        </div>
      </div>
    </div>

    <!-- Produit en vedette -->
    <div v-if="produitVedette" class="featured-product">
      <h2>Produit en vedette</h2>
      <p>{{ produitVedette.nom }}</p>
      <p>{{ produitVedette.prix }} €</p>
      <p>Vendus : {{ ventes[produitVedette.id] || 0 }}</p>
      <button @click="ajouterAuPanier(produitVedette)">Ajouter au panier</button>
    </div>
    <div v-else>
      Aucun produit vendu pour l'instant.
    </div>

    <!-- Produits en promotion -->
    <div v-if="produitsPromo.length" class="promo-slider">
      <button @click="prevPromo">‹</button>
      <div v-for="(p, index) in produitsPromo" :key="p.id" 
           v-show="currentPromoIndex === index">
        <p>{{ p.nom }}</p>
        <p>{{ p.prix }} €</p>
        <button @click="ajouterAuPanier(p)">Ajouter au panier</button>
      </div>
      <button @click="nextPromo">›</button>
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
        image: produit.images || produit.image,
        quantity: 1,
      });
    };

    // 🔹 Récupérer tous les produits internes + externes
    const fetchProduits = async () => {
      produitsSlider.value = [];
      produitsPromo.value = [];

      // Produits internes
      const snapshotInt = await getDocs(collection(db, "products"));
      snapshotInt.forEach((doc) => {
        const p = { id: doc.id, ...doc.data(), type: "interne" };
        produitsSlider.value.push(p);
        if (p.promo) produitsPromo.value.push(p);
      });

      // Produits externes
      const snapshotExt = await getDocs(collection(db, "ProductsExternes"));
      snapshotExt.forEach((doc) => {
        const p = { id: doc.id, ...doc.data(), type: "externe" };
        produitsSlider.value.push(p);
        if (p.promo) produitsPromo.value.push(p);
      });
    };

    // 🔹 Récupérer les commandes et calculer les ventes
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

    // 🔹 Slider promo
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
.slider-container, .promo-slider {
  width: 100%;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
}

.slide, .promo-slide {
  min-width: 100%;
  text-align: center;
}

.featured-product {
  margin: 2rem 0;
  text-align: center;
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
