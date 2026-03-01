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

        <button
          @click="ajouterAuPanier(produitVedette)"
          class="mt-2 bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
        >
          Ajouter au panier
        </button>
      </div>

      <!-- Produits Promo -->
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

    <!-- 🔹 Notification ajout panier -->
    <div
      v-if="showConfirmation"
      class="fixed bottom-6 right-6 bg-green-600 text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-4 z-50 transition-all duration-300"
    >
      <span>✅ Produit ajouté au panier</span>

      <button
        @click="router.push('/panier')"
        class="bg-white text-green-600 px-3 py-1 rounded font-semibold hover:bg-gray-100"
      >
        Voir panier
      </button>
    </div>

  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { collection, getDocs } from "firebase/firestore";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { db } from "../firebase";
import SliderProducts from "./SliderProducts.vue";

export default {
  components: { SliderProducts },

  setup() {
    const store = useStore();
    const router = useRouter();

    const produitsSlider = ref([]);
    const produitVedette = ref(null);
    const produitsPromo = ref([]);
    const ventes = ref({});

    const showPopup = ref(true);
    const popupProduit = ref(null);
    const showConfirmation = ref(false);

    // 🔹 Charger produits
    const fetchProduits = async () => {
      const snapshot = await getDocs(collection(db, "products"));

      snapshot.forEach((doc) => {
        const produit = {
          id: doc.id,
          ...doc.data(),
        };

        produitsSlider.value.push({ ...produit });

        if (produit.promo) {
          produitsPromo.value.push({ ...produit });
        }
      });

      if (produitsPromo.value.length) {
        popupProduit.value = { ...produitsPromo.value[0] };
      }
    };

    // 🔹 Calcul produit vedette
    const fetchCommandes = async () => {
      const snapshot = await getDocs(collection(db, "commandes"));

      snapshot.forEach((doc) => {
        const cmd = doc.data();

        if (cmd.items) {
          cmd.items.forEach((item) => {
            if (!ventes.value[item.id]) ventes.value[item.id] = 0;
            ventes.value[item.id] += item.quantity;
          });
        }
      });

      let max = 0;

      produitsSlider.value.forEach((p) => {
        const q = ventes.value[p.id] || 0;

        if (q > max) {
          max = q;
          produitVedette.value = { ...p };
        }
      });
    };

    // 🔹 Ajouter au panier
    const ajouterAuPanier = (produit) => {
      store.dispatch("addToCart", {
        ...produit,
        image: produit.images,
        quantity: 1,
      });

      showPopup.value = false;

      showConfirmation.value = true;

      setTimeout(() => {
        showConfirmation.value = false;
      }, 4000);
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
      showConfirmation,
      ajouterAuPanier,
      closePopup,
      router,
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
