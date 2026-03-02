<template>
  <section class="vitrine my-8">
    <h2 class="text-2xl font-bold mb-4 text-center">Vitrine</h2>

    <div class="relative w-full overflow-hidden h-64 rounded shadow-lg">
      <div class="flex transition-transform duration-500" :style="{ transform: `translateX(-${currentSlide * 100}%)` }">
        <div v-for="p in produitsSlider" :key="p.id" class="w-full flex-shrink-0 relative">
          <img :src="p.images" :alt="p.nom" class="w-full h-64 object-cover rounded" />
          <div class="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white p-2 rounded">
            <h3 class="font-semibold">{{ p.nom }}</h3>
            <p>{{ p.prix }} €</p>
          </div>
          <button
            @click="ajouterAuPanier(p)"
            class="absolute bottom-2 right-2 bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
          >
            Ajouter au panier
          </button>
        </div>
      </div>

      <!-- Navigation -->
      <button @click="prevSlide" class="absolute top-1/2 left-2 -translate-y-1/2 bg-green-600 text-white p-2 rounded-full hover:bg-green-700">‹</button>
      <button @click="nextSlide" class="absolute top-1/2 right-2 -translate-y-1/2 bg-green-600 text-white p-2 rounded-full hover:bg-green-700">›</button>
    </div>
  </section>
</template>

<script>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { collection, getDocs } from "firebase/firestore";
import { useStore } from "vuex";
import { db } from "../firebase";

export default {
  name: "Vitrine",
  setup() {
    const store = useStore();
    const produitsSlider = ref([]);
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

    const nextSlide = () => {
      if (produitsSlider.value.length > 0) {
        currentSlide.value = (currentSlide.value + 1) % produitsSlider.value.length;
      }
    };

    const prevSlide = () => {
      if (produitsSlider.value.length > 0) {
        currentSlide.value = (currentSlide.value - 1 + produitsSlider.value.length) % produitsSlider.value.length;
      }
    };

    onMounted(async () => {
      await fetchProduits();
      sliderInterval = setInterval(nextSlide, 3000); // défilement automatique toutes les 3s
    });

    onBeforeUnmount(() => {
      clearInterval(sliderInterval);
    });

    return {
      produitsSlider,
      currentSlide,
      ajouterAuPanier,
      nextSlide,
      prevSlide,
    };
  },
};
</script>

<style scoped>
.vitrine img {
  display: block;
  object-fit: cover;
}
</style>
