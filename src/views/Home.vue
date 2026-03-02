import { ref, onMounted, onBeforeUnmount } from "vue";
import { collection, getDocs } from "firebase/firestore";
import { useStore } from "vuex";
import { db } from "../firebase";

import Vitrine from "../components/Vitrine.vue";

export default {
  components: { Vitrine }, // ← Ajouter ceci
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

      // Produit vedette
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
