<template>
  <div class="home-page min-h-screen bg-gray-100">

    <!-- 🔹 SLIDER PRODUITS INTERNES -->
    <SliderProducts
      :produits="produitsInternes"
      :ventes="ventes"
      :ajouter-au-panier="ajouterAuPanier"
    />

    <!-- 🔥 SECTION PRODUITS EN VEDETTE -->
    <section v-if="produitVedette" class="my-10 px-4">
      <h2 class="text-3xl font-bold text-center mb-6">
        ⭐ Produit en vedette
      </h2>

      <div class="relative max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6 flex flex-col md:flex-row items-center gap-8">

        <!-- 🔥 BADGE -->
        <span
          class="absolute top-4 left-4 bg-red-500 text-white font-bold px-4 py-1 rounded-full shadow-md z-50"
        >
          🔥 En vedette
        </span>

        <!-- IMAGE -->
        <img
          :src="produitVedette.images?.[0] || produitVedette.image || '/placeholder.png'"
          class="w-64 h-64 object-cover rounded-lg"
        />

        <!-- INFOS -->
        <div class="text-center md:text-left">
          <h3 class="text-2xl font-semibold mb-2">
            {{ produitVedette.nom }}
          </h3>

          <p class="text-green-600 text-xl font-bold mb-2">
            {{ produitVedette.prix }} €
          </p>

          <p class="text-gray-500 mb-4">
            Vendus : {{ ventes[produitVedette.id] || 0 }}
          </p>

          <button
            @click="ajouterAuPanier(produitVedette)"
            class="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition"
          >
            Ajouter au panier
          </button>
        </div>

      </div>
    </section>

    <!-- 🔹 PRODUITS EXTERNES -->
    <section v-if="produitsExternes.length" class="my-12 px-4">
      <h2 class="text-3xl font-bold text-center mb-6">
        Produits externes
      </h2>

      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <div
          v-for="p in produitsExternes"
          :key="p.id"
          class="bg-white rounded-lg shadow p-4 text-center hover:shadow-lg transition"
        >
          <img
            :src="p.image || '/placeholder.png'"
            class="w-full h-40 object-cover rounded mb-3"
          />

          <h3 class="font-semibold mb-1">{{ p.nom }}</h3>

          <p class="text-green-600 font-bold mb-2">
            {{ p.prix }} €
          </p>

          <button
            @click="ajouterAuPanier(p)"
            class="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded transition"
          >
            Ajouter
          </button>
        </div>
      </div>
    </section>

    <!-- 🔹 VITRINE -->
    <Vitrine />

  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { collection, getDocs } from "firebase/firestore";
import { useStore } from "vuex";
import { db } from "../firebase";

import SliderProducts from "./SliderProducts.vue";
import Vitrine from "../components/Vitrine.vue";

export default {
  components: { SliderProducts, Vitrine },

  setup() {
    const store = useStore();

    const produitsInternes = ref([]);
    const produitsExternes = ref([]);
    const produitVedette = ref(null);
    const ventes = ref({});

    const ajouterAuPanier = (produit) => {
      store.dispatch("addToCart", {
        ...produit,
        image: produit.images?.[0] || produit.image || "/placeholder.png",
        quantity: 1,
      });
    };

    // 🔹 Charger produits
    const fetchProduits = async () => {
      const snapshotInt = await getDocs(collection(db, "products"));
      snapshotInt.forEach((doc) => {
        produitsInternes.value.push({
          id: doc.id,
          ...doc.data(),
        });
      });

      const snapshotExt = await getDocs(collection(db, "ProductsExternes"));
      snapshotExt.forEach((doc) => {
        produitsExternes.value.push({
          id: doc.id,
          ...doc.data(),
        });
      });
    };

    // 🔹 Calcul produit vedette depuis commandes
    const fetchCommandes = async () => {
      const snapshot = await getDocs(collection(db, "commandes"));

      snapshot.forEach((doc) => {
        const cmd = doc.data();
        if (cmd.statut !== "payé") return;

        const produit = produitsInternes.value.find(
          (p) => p.id === cmd.id
        );

        if (!produit) return;

        ventes.value[cmd.id] =
          (ventes.value[cmd.id] || 0) + (cmd.quantity || 0);
      });

      let max = 0;
      let vedette = null;

      produitsInternes.value.forEach((p) => {
        const q = ventes.value[p.id] || 0;
        if (q > max) {
          max = q;
          vedette = p;
        }
      });

      // 🔥 Si aucune vente → produit prix max
      if (!vedette && produitsInternes.value.length > 0) {
        vedette = produitsInternes.value.reduce((a, b) =>
          a.prix > b.prix ? a : b
        );
      }

      produitVedette.value = vedette;
    };

    onMounted(async () => {
      await fetchProduits();
      await fetchCommandes();
    });

    return {
      produitsInternes,
      produitsExternes,
      produitVedette,
      ventes,
      ajouterAuPanier,
    };
  },
};
</script>
