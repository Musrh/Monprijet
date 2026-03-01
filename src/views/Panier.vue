<template>
  <div class="home">
    <!-- 🔹 Slider -->
    <SliderProducts :produits="produitsSlider" />

    <!-- 🔹 Vedette + Promos -->
    <div class="flex flex-wrap gap-6 my-8 justify-center">
      
      <!-- Produit Vedette -->
      <div v-if="produitVedette" class="w-64 p-4 border rounded shadow">
        <h2 class="text-xl font-semibold mb-2">Produit en vedette</h2>
        <img
          :src="produitVedette.images"
          :alt="produitVedette.nom"
          class="w-full h-48 object-cover rounded mb-2"
        />
        <h3>{{ produitVedette.nom }}</h3>
        <p>{{ produitVedette.prix }} €</p>
        <p>Vendu : {{ ventes[produitVedette.id] || 0 }} fois</p>

        <!-- Bouton ajout vedette -->
        <button
          @click="ajouterAuPanier(produitVedette)"
          class="mt-2 bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
        >
          Ajouter au panier
        </button>
      </div>

      <!-- Produits en promotion -->
      <div
        v-for="p in produitsPromo"
        :key="p.id"
        class="w-64 p-4 border rounded shadow relative"
      >
        <h2 class="text-xl font-semibold mb-2">Promotion</h2>
        <img
          :src="p.images"
          :alt="p.nom"
          class="w-full h-48 object-cover rounded mb-2"
        />
        <h3>{{ p.nom }}</h3>
        <p>
          <s>{{ p.prix }} €</s>
          {{ Math.round(p.prix * 0.5) }} €
        </p>
        <span
          class="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded"
        >
          -50%
        </span>
      </div>
    </div>

    <!-- 🔹 Popup Promo -->
    <div
      v-if="showPopup && popupProduit"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white p-6 rounded-lg max-w-sm w-full relative">
        <button
          @click="closePopup"
          class="absolute top-2 right-2 text-xl"
        >
          ×
        </button>

        <h2 class="text-lg font-semibold mb-2">Promotion spéciale</h2>

        <img
          :src="popupProduit.images"
          :alt="popupProduit.nom"
          class="w-full h-48 object-cover mb-4"
        />

        <h3>{{ popupProduit.nom }}</h3>
        <p>{{ popupProduit.prix }} €</p>

        <button
          @click="ajouterAuPanier(popupProduit)"
          class="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Ajouter au panier
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { collection, getDocs } from "firebase/firestore";
import { useStore } from "vuex";
import { db } from "../firebase";
import SliderProducts from "./SliderProducts.vue";

export default {
  components: { SliderProducts },
  setup() {
    const store = useStore();

    const produitsSlider = ref([]);
    const produitVedette = ref(null);
    const produitsPromo = ref([]);
    const ventes = ref({});

    const showPopup = ref(true);
    const popupProduit = ref(null);

    // 🔹 Récupération produits
    const fetchProduits = async () => {
      const snapshot = await getDocs(collection(db, "products"));

      snapshot.forEach((doc) => {
        const data = doc.data();

        // 🔥 Création d’un objet indépendant
        const produit = {
          id: doc.id,
          ...data,
        };

        produitsSlider.value.push({ ...produit });

        if (produit.promo) {
          produitsPromo.value.push({ ...produit });
        }
      });

      // Popup = premier produit promo (cloné)
      if (produitsPromo.value.length) {
        popupProduit.value = { ...produitsPromo.value[0] };
      }
    };

    // 🔹 Récupération commandes pour vedette
    const fetchCommandes = async () => {
      const snapshot = await getDocs(collection(db, "commandes"));

      snapshot.forEach((doc) => {
        const cmd = doc.data();

        if (cmd.items && cmd.items.length) {
          cmd.items.forEach((item) => {
            if (!ventes.value[item.id]) ventes.value[item.id] = 0;
            ventes.value[item.id] += item.quantity;
          });
        }
      });

      // Déterminer produit vedette
      let max = 0;

      produitsSlider.value.forEach((p) => {
        const q = ventes.value[p.id] || 0;

        if (q > max) {
          max = q;
          produitVedette.value = { ...p }; // 🔥 clone
        }
      });
    };

    // 🔹 Ajouter au panier
    const ajouterAuPanier = (produit) => {
      store.dispatch("addToCart", {
        ...produit,
        image: produit.images, // 🔥 adaptation pour Panier.vue
        quantity: 1,
      });

      showPopup.value = false;
    };

    const closePopup = () => {
      showPopup.value = false;
    };

    onMounted(async () => {
      await fetchProduits();
      await fetchCommandes();
    });

    return {
      produitsSlider,
      produitVedette,
      produitsPromo,
      ventes,
      showPopup,
      popupProduit,
      ajouterAuPanier,
      closePopup,
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
