<template>
  <div class="slider-wrapper w-full md:w-3/4">
    <div class="slider-container relative overflow-hidden">
      <div
        class="slider-track flex transition-transform duration-500"
        :style="{ transform: `translateX(-${currentIndex * 100}%)` }"
      >
        <div
          v-for="produit in produitsPromos"
          :key="produit.id"
          class="slider-item w-full flex-shrink-0 p-2 text-center relative bg-white rounded shadow"
        >
          <!-- Image du produit -->
          <img
            :src="produit.images?.[0] || '/placeholder.png'"
            :alt="produit.nom"
            class="w-full h-48 object-cover rounded"
          />

          <!-- Bouton Ajouter au panier sur l'image -->
          <button
            @click="ajouterAuPanier(produit)"
            class="absolute bottom-2 left-1/2 -translate-x-1/2 bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-sm z-20"
          >
            Ajouter au panier
          </button>

          <!-- Nom du produit -->
          <h3 class="mt-2 font-semibold">{{ produit.nom }}</h3>

          <!-- Prix réduit avec ancien prix -->
          <div class="mt-1 z-10 relative">
            <span v-if="produit.promo" class="line-through text-gray-400 mr-2">
              {{ produit.prix }} €
            </span>
            <span class="text-green-600 font-bold">
              {{ prixFinal(produit) }} €
            </span>
          </div>

          <!-- Badge promo -->
          <span
            v-if="produit.promo"
            class="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs z-20"
          >
            PROMO 50%
          </span>
        </div>
      </div>

      <!-- Flèches manuelles -->
      <button
        @click="prev"
        class="absolute top-1/2 left-2 -translate-y-1/2 bg-green-600 text-white p-2 rounded-full hover:bg-green-700"
      >
        ‹
      </button>
      <button
        @click="next"
        class="absolute top-1/2 right-2 -translate-y-1/2 bg-green-600 text-white p-2 rounded-full hover:bg-green-700"
      >
        ›
      </button>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onBeforeUnmount, watch } from "vue";
import { useStore } from "vuex";

export default {
  name: "SliderProducts",
  props: {
    produits: { type: Array, required: true, default: () => [] },
    auto: { type: Boolean, default: true },
    interval: { type: Number, default: 3000 },
  },
  setup(props) {
    const store = useStore();
    const currentIndex = ref(0);
    let timer = null;

    // 🔹 Filtrer uniquement les produits en promo
    const produitsPromos = computed(() =>
      props.produits.filter((p) => p.promo)
    );

    // 🔹 Calculer prix final
    const prixFinal = (produit) =>
      produit.promo ? Math.round(produit.prix * 0.5) : produit.prix;

    // 🔹 Navigation du slider
    const next = () => {
      if (!produitsPromos.value.length) return;
      currentIndex.value = (currentIndex.value + 1) % produitsPromos.value.length;
    };

    const prev = () => {
      if (!produitsPromos.value.length) return;
      currentIndex.value =
        (currentIndex.value - 1 + produitsPromos.value.length) %
        produitsPromos.value.length;
    };

    // 🔹 Ajouter au panier
    const ajouterAuPanier = (produit) => {
      store.dispatch("addToCart", {
        id: produit.id,
        nom: produit.nom,
        prix: prixFinal(produit),
        images: produit.images,
        quantity: 1,
      });
      alert(`Le produit "${produit.nom}" a été ajouté à votre panier !`);
    };

    // 🔹 Auto-slide
    onMounted(() => {
      if (props.auto) timer = setInterval(next, props.interval);
    });

    onBeforeUnmount(() => {
      if (timer) clearInterval(timer);
    });

    // 🔹 Réinitialiser index si produits changent
    watch(
      () => props.produits,
      () => { currentIndex.value = 0; }
    );

    return { currentIndex, next, prev, produitsPromos, ajouterAuPanier, prixFinal };
  },
};
</script>

<style scoped>
.slider-wrapper {
  margin: 0; /* aligné à gauche */
}
.slider-container { position: relative; }
.slider-track { display: flex; width: 100%; }
.slider-item { position: relative; }
.slider-item img { transition: transform 0.3s; }
.slider-item img:hover { transform: scale(1.05); }
</style>
