<template>
  <div class="slider-container relative w-full overflow-hidden">
    <div
      class="slider-track flex transition-transform duration-500"
      :style="{ transform: `translateX(-${currentIndex * 100}%)` }"
    >
      <div
        v-for="produit in produits"
        :key="produit.id"
        class="slider-item w-full flex-shrink-0 p-2 text-center"
      >
        <img
          :src="produit.images"
          :alt="produit.nom"
          class="w-full h-48 object-cover rounded"
        />
        <h3 class="mt-2 font-semibold">{{ produit.nom }}</h3>
        <p>{{ produit.prix }} €</p>
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
import { ref, onMounted, onBeforeUnmount, watch } from "vue";

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
      default: 3000, // 3 secondes par défaut
    },
  },
  setup(props) {
    const currentIndex = ref(0);
    let timer = null;

    const next = () => {
      if (props.produits.length === 0) return;
      currentIndex.value = (currentIndex.value + 1) % props.produits.length;
    };

    const prev = () => {
      if (props.produits.length === 0) return;
      currentIndex.value =
        (currentIndex.value - 1 + props.produits.length) % props.produits.length;
    };

    onMounted(() => {
      if (props.auto) {
        timer = setInterval(next, props.interval);
      }
    });

    onBeforeUnmount(() => {
      if (timer) clearInterval(timer);
    });

    // Redémarrer le timer si l'utilisateur change le tableau de produits
    watch(
      () => props.produits,
      () => {
        currentIndex.value = 0;
      }
    );

    return { currentIndex, next, prev };
  },
};
</script>

<style scoped>
.slider-container {
  max-width: 1200px;
  margin: 0 auto;
}

.slider-track {
  display: flex;
  width: 100%;
}

.slider-item img {
  transition: transform 0.3s;
}

.slider-item img:hover {
  transform: scale(1.05);
}
</style>
