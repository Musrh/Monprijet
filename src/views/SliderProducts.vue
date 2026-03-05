<template>
  <div class="slider-container relative w-full overflow-hidden">
    <div
      class="slider-track flex transition-transform duration-500"
      :style="{ transform: `translateX(-${currentIndex * 100}%)` }"
    >
      <div
        v-for="produit in produitsPromos"
        :key="produit.id"
        class="slider-item w-full flex-shrink-0 p-2 text-center"
      >
        <img
          :src="produit.images?.[0] || '/placeholder.png'"
          :alt="produit.nom"
          class="w-full h-48 object-cover rounded"
        />
        <h3 class="mt-2 font-semibold">{{ produit.nom }}</h3>
        <p class="text-green-600 font-bold">
          {{ Math.round(produit.prix * 0.5) }} €
        </p>
        <span
          class="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs"
          v-if="produit.promo"
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
</template>

<script>
import { ref, computed, onMounted, onBeforeUnmount, watch } from "vue";

export default {
  name: "SliderProducts",
  props: {
    produits: {
      type: Array,
      required: true,
      default: () => [],
    },
    auto: {
      type: Boolean,
      default: true,
    },
    interval: {
      type: Number,
      default: 3000,
    },
  },
  setup(props) {
    const currentIndex = ref(0);
    let timer = null;

    // 🔥 Filtrer uniquement les produits en promo
    const produitsPromos = computed(() => props.produits.filter(p => p.promo === true));

    const next = () => {
      if (produitsPromos.value.length === 0) return;
      currentIndex.value = (currentIndex.value + 1) % produitsPromos.value.length;
    };

    const prev = () => {
      if (produitsPromos.value.length === 0) return;
      currentIndex.value =
        (currentIndex.value - 1 + produitsPromos.value.length) % produitsPromos.value.length;
    };

    onMounted(() => {
      if (props.auto) timer = setInterval(next, props.interval);
    });

    onBeforeUnmount(() => {
      if (timer) clearInterval(timer);
    });

    watch(
      () => props.produits,
      () => {
        currentIndex.value = 0;
      }
    );

    return { currentIndex, next, prev, produitsPromos };
  },
};
</script>

<style scoped>
.slider-container {
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
}

.slider-track {
  display: flex;
  width: 100%;
}

.slider-item {
  position: relative;
}

.slider-item img {
  transition: transform 0.3s;
}

.slider-item img:hover {
  transform: scale(1.05);
}
</style>
