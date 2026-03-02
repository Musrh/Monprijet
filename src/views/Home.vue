<template>
  <div class="home">

    <!-- 🔹 Slider principal -->
    <section class="relative w-full overflow-hidden">
      <div class="flex transition-transform duration-500"
           :style="{ transform: `translateX(-${currentSlide * 100}%)` }">
        <div v-for="p in produitsSlider" :key="p.id" class="w-full flex-shrink-0 relative h-64">
          <img :src="p.images" :alt="p.nom" class="w-full h-full object-cover" />
          <!-- Overlay texte -->
          <div class="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white p-2 rounded">
            <h3 class="font-semibold">{{ p.nom }}</h3>
            <p>{{ p.prix }} €</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 🔹 Produit vedette -->
    <section class="mt-8 w-full md:w-1/2 mx-auto text-center">
      <h2 class="text-xl font-bold mb-4">Produit en vedette</h2>
      <div v-if="produitVedette" class="border p-4 rounded shadow">
        <img :src="produitVedette.images" :alt="produitVedette.nom" class="w-full h-64 object-cover rounded" />
        <h3 class="font-semibold mt-2">{{ produitVedette.nom }}</h3>
        <p>{{ produitVedette.prix }} €</p>
        <p>Vendu : {{ ventes[produitVedette.id] || 0 }} fois</p>
        <button @click="ajouterAuPanier(produitVedette)"
                class="mt-2 bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">
          Ajouter au panier
        </button>
      </div>
      <div v-else class="text-gray-500">Aucun produit vendu pour l'instant.</div>
    </section>

    <!-- 🔹 Vitrine -->
    <section class="mt-8">
      <Vitrine />
    </section>

    <!-- 🔹 Grande image en bas -->
    <section class="mt-8">
      <img src="https://via.placeholder.com/1200x400/ffffff/cccccc?text=Grande+Image"
           alt="Grande Image"
           class="w-full object-cover rounded shadow-lg" />
    </section>
    
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
    const ventes = ref({});
    const currentSlide = ref(0);
    let sliderInterval = null;

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

      // Produit vedette = plus vendu
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

    onMounted(async () => {
      await fetchProduits();
      await fetchCommandes();

      sliderInterval = setInterval(nextSlide, 3000); // slider automatique
    });

    onBeforeUnmount(() => {
      clearInterval(sliderInterval);
    });

    return {
      produitsSlider,
      produitVedette,
      ventes,
      currentSlide,
      ajouterAuPanier,
    };
  },
};
</script>

<style scoped>
.home img { display: block; width: 100%; object-fit: cover; }
</style>
