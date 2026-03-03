<template>
  <section v-if="produitVedette" class="my-10 px-4">
    <h2 class="text-3xl font-bold text-center mb-6">
      ⭐ Produits en vedette
    </h2>

    <div class="relative max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6 flex flex-col md:flex-row items-center gap-8">

      <!-- 🔥 Badge -->
      <span
        class="absolute top-4 left-4 bg-red-500 text-white font-bold px-4 py-1 rounded-full shadow-md z-50"
      >
        🔥 En vedette
      </span>

      <!-- Image -->
      <img
        :src="produitVedette.images?.[0] || produitVedette.image || '/placeholder.png'"
        class="w-64 h-64 object-cover rounded-lg"
      />

      <!-- Infos -->
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
</template>

<script>
import { ref, onMounted } from "vue";
import { collection, getDocs } from "firebase/firestore";
import { useStore } from "vuex";
import { db } from "../firebase";

export default {
  setup() {
    const store = useStore();

    const produitsInternes = ref([]);
    const produitVedette = ref(null);
    const ventes = ref({});

    const ajouterAuPanier = (produit) => {
      store.dispatch("addToCart", {
        ...produit,
        image: produit.images?.[0] || produit.image || "/placeholder.png",
        quantity: 1,
      });
    };

    const fetchProduits = async () => {
      const snapshot = await getDocs(collection(db, "products"));
      snapshot.forEach((doc) => {
        produitsInternes.value.push({
          id: doc.id,
          ...doc.data(),
        });
      });
    };

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

      // 🔥 Fallback si aucune vente
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
      produitVedette,
      ventes,
      ajouterAuPanier,
    };
  },
};
</script>
