<template>
  <div class="home-page min-h-screen bg-gray-100 px-4">

    <!-- 🔹 Slider produits internes réduit sur bureau -->
    <div class="mx-auto w-full md:w-3/4 lg:w-2/3">
      <SliderProducts 
        :produits="produitsInternes" 
        :ventes="ventes" 
        :ajouter-au-panier="ajouterAuPanier" 
      />
    </div>

    <!-- 🔥 Produits internes en promotion -->
    <div v-if="produitsPromo.length" class="my-10 px-2 md:px-6">
      <h2 class="text-2xl font-bold text-center text-red-600 mb-6">
        🔥 Produits en promotion
      </h2>

      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <div
          v-for="p in produitsPromo"
          :key="p.id"
          class="bg-white border rounded p-4 text-center shadow hover:shadow-lg transition relative"
        >
          <!-- Étiquette PROMO -->
          <span class="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 text-xs rounded">
            PROMO
          </span>

          <img
            :src="p.images?.[0] || '/placeholder.png'"
            class="w-full h-48 object-cover rounded my-3"
          />

          <h3 class="font-bold">{{ p.nom }}</h3>
          <p class="text-green-600 font-bold">{{ p.prix }} €</p>

          <button
            @click="ajouterAuPanier(p)"
            class="bg-green-600 text-white px-3 py-1 rounded mt-2 hover:bg-green-700"
          >
            Ajouter au panier
          </button>
        </div>
      </div>
    </div>

    <!-- ⭐ Produit en vedette -->
    <div v-if="produitVedette" class="featured-product my-8 text-center">
      <h2 class="text-2xl font-bold mb-4">⭐ Produit en vedette</h2>

      <img 
        :src="produitVedette.images?.[0] || '/placeholder.png'" 
        class="w-64 h-64 object-cover mx-auto mb-2 rounded"
      />

      <p class="text-lg font-semibold">{{ produitVedette.nom }}</p>
      <p class="text-green-600 font-bold">{{ produitVedette.prix }} €</p>
      <p class="text-gray-500">
        Vendus : {{ ventes[produitVedette.id] || 0 }}
      </p>

      <button 
        @click="ajouterAuPanier(produitVedette)"
        class="bg-green-600 text-white px-4 py-2 rounded mt-2 hover:bg-green-700"
      >
        Ajouter au panier
      </button>
    </div>

    <!-- 🌍 Produits externes -->
    <div
      v-if="produitsExternes.length"
      class="external-products my-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-2 md:px-4"
    >
      <div
        v-for="p in produitsExternes"
        :key="p.id"
        class="text-center border rounded p-2 bg-white shadow-sm hover:shadow-md transition"
      >
        <img 
          :src="p.image || '/placeholder.png'" 
          class="w-full h-40 object-cover mb-2 rounded"
        />
        <p class="font-semibold">{{ p.nom }}</p>
        <p class="text-green-600 font-bold">{{ p.prix }} €</p>

        <button 
          @click="ajouterAuPanier(p)" 
          class="bg-green-600 text-white px-3 py-1 rounded mt-1 hover:bg-green-700"
        >
          Ajouter au panier
        </button>
      </div>
    </div>

    <!-- 🏪 Vitrine -->
    <Vitrine />

  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { collection, getDocs } from "firebase/firestore";
import { useStore } from "vuex";
import { db } from "../firebase";

import SliderProducts from "../components/SliderProducts.vue";
import Vitrine from "../components/Vitrine.vue";

export default {
  components: { SliderProducts, Vitrine },
  setup() {
    const store = useStore();

    const produitsInternes = ref([]);
    const produitsExternes = ref([]);
    const produitsPromo = ref([]);
    const produitVedette = ref(null);
    const ventes = ref({});

    const ajouterAuPanier = (produit) => {
      store.dispatch("addToCart", {
        id: produit.id,
        nom: produit.nom,
        prix: produit.prix,
        images: produit.images,
        quantity: 1
      });
    };

    const fetchProduits = async () => {
      // 🔹 Produits internes
      const snapshotInt = await getDocs(collection(db, "products"));

      snapshotInt.forEach(doc => {
        const p = { id: doc.id, ...doc.data() };
        produitsInternes.value.push(p);

        // 🔥 Seulement produits internes en promo
        if (p.promo === true) {
          produitsPromo.value.push(p);
        }
      });

      // 🔹 Produits externes
      const snapshotExt = await getDocs(collection(db, "ProductsExternes"));
      snapshotExt.forEach(doc => {
        produitsExternes.value.push({ id: doc.id, ...doc.data() });
      });
    };

    const fetchCommandes = async () => {
      const snapshot = await getDocs(collection(db, "commandes"));

      snapshot.forEach(doc => {
        const cmd = doc.data();
        if (cmd.statut !== "payé") return;

        cmd.items?.forEach(item => {
          const prodId = item.id;
          const qty = item.quantity || 1;
          ventes.value[prodId] = (ventes.value[prodId] || 0) + qty;
        });
      });

      let max = 0;
      produitsInternes.value.forEach(p => {
        const q = ventes.value[p.id] || 0;
        if (q > max) {
          max = q;
          produitVedette.value = { ...p };
        }
      });

      if (!produitVedette.value && produitsInternes.value.length > 0) {
        produitVedette.value = { ...produitsInternes.value[0] };
      }
    };

    onMounted(async () => {
      await fetchProduits();
      await fetchCommandes();
    });

    return {
      produitsInternes,
      produitsExternes,
      produitsPromo,
      produitVedette,
      ventes,
      ajouterAuPanier
    };
  }
};
</script>

<style scoped>
.featured-product img,
.external-products img {
  object-fit: cover;
}
</style>
