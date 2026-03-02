<template>
  <div class="home min-h-screen bg-gray-100">

    <!-- Slider principal -->
    <section class="slider-container w-full overflow-hidden relative">
      <div
        class="flex transition-transform duration-700"
        :style="{ transform: `translateX(-${currentSlideIndex * 100}%)` }"
      >
        <div
          v-for="p in produitsSlider"
          :key="p.id"
          class="w-full flex-shrink-0"
        >
          <img
            :src="p.images"
            :alt="p.nom"
            class="w-full h-64 object-cover"
          />
        </div>
      </div>
    </section>

    <!-- Produit vedette et promotions -->
    <section class="my-8 px-4 grid md:grid-cols-2 gap-6">

      <!-- Produit vedette -->
      <div v-if="produitVedette" class="border rounded shadow p-4 text-center">
        <h2 class="text-xl font-semibold mb-2">Produit en vedette</h2>
        <img
          :src="produitVedette.images"
          :alt="produitVedette.nom"
          class="w-full h-48 object-cover rounded mb-2"
        />
        <h3 class="font-semibold">{{ produitVedette.nom }}</h3>
        <p>{{ produitVedette.prix }} €</p>
        <p>Vendu : {{ ventes[produitVedette.id] || 0 }} fois</p>
        <button
          @click="ajouterAuPanier(produitVedette)"
          class="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Ajouter au panier
        </button>
      </div>

      <!-- Produits en promotion -->
      <div
        v-for="p in produitsPromo"
        :key="p.id"
        class="border rounded shadow p-4 text-center relative"
      >
        <h2 class="text-xl font-semibold mb-2">Promotion</h2>
        <img
          :src="p.images"
          :alt="p.nom"
          class="w-full h-48 object-cover rounded mb-2"
        />
        <h3 class="font-semibold">{{ p.nom }}</h3>
        <p><s>{{ p.prix }} €</s> {{ Math.round(p.prix * 0.5) }} €</p>
        <span class="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded">-50%</span>
        <button
          @click="ajouterAuPanier(p)"
          class="mt-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Ajouter au panier
        </button>
      </div>

    </section>
  </div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { collection, getDocs } from "firebase/firestore";
import { useStore } from "vuex";
import { db } from "../firebase";

export default {
  setup() {
    const store = useStore();

    const produitsSlider = ref([]);
    const produitsPromo = ref([]);
    const produitVedette = ref(null);
    const ventes = ref({});
    const currentSlideIndex = ref(0);
    let slideInterval = null;

    // 🔹 Fetch produits depuis Firestore
    const fetchProduits = async () => {
      const snapshot = await getDocs(collection(db, "products"));
      snapshot.forEach(doc => {
        const p = { id: doc.id, ...doc.data() };
        produitsSlider.value.push(p);
        if (p.promo) produitsPromo.value.push(p);
      });
    };

    // 🔹 Fetch commandes pour calcul ventes et produit vedette
    const fetchCommandes = async () => {
      const snapshot = await getDocs(collection(db, "commandes"));
      snapshot.forEach(doc => {
        const cmd = doc.data();
        if (cmd.items && cmd.items.length) {
          cmd.items.forEach(item => {
            ventes.value[item.id] = (ventes.value[item.id] || 0) + item.quantity;
          });
        }
      });

      // Produit vedette = plus vendu
      let max = 0;
      produitsSlider.value.forEach(p => {
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
        quantity: 1
      });
    };

    // 🔹 Slider automatique
    const nextSlide = () => {
      if (produitsSlider.value.length > 0)
        currentSlideIndex.value = (currentSlideIndex.value + 1) % produitsSlider.value.length;
    };

    onMounted(async () => {
      await fetchProduits();
      await fetchCommandes();
      slideInterval = setInterval(nextSlide, 3000); // changement toutes les 3 sec
    });

    onBeforeUnmount(() => {
      if (slideInterval) clearInterval(slideInterval);
    });

    return {
      produitsSlider,
      produitsPromo,
      produitVedette,
      ventes,
      currentSlideIndex,
      ajouterAuPanier
    };
  }
};
</script>

<style scoped>
.slider-container img {
  width: 100%;
  height: 16rem; /* 64 */
  object-fit: cover;
}
</style>
