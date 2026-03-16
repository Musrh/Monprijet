<template>
  <div class="horizontal-slider">
    <div class="slider-wrapper">
      <div
        class="slider-track"
        :style="{ transform: `translateX(-${scrollX}px)` }"
      >
        <div
          v-for="product in products"
          :key="product.id"
          class="slider-item"
        >
          <div class="product-card">
            <img :src="product.thumbnail" :alt="product.name" class="main-mockup" />
            <h3 class="font-bold text-sm mt-1">{{ product.name }}</h3>
            <p class="text-green-600 font-bold">{{ product.price }} €</p>

            <!-- Tailles visibles -->
            <div class="flex flex-wrap gap-1 text-xs mb-1">
              <span
                v-for="variant in product.variants"
                :key="variant.id"
                class="px-2 py-1 border rounded bg-gray-100"
              >
                {{ variant.size || "N/A" }}
              </span>
            </div>

            <!-- Ajouter au panier -->
            <button
              @click="addToCart(product)"
              class="bg-green-600 text-white py-1 rounded w-full text-xs hover:bg-green-700"
            >
              Ajouter au panier
            </button>
          </div>
        </div>
      </div>
    </div>

    <button class="prev" @click="scrollLeft">&#10094;</button>
    <button class="next" @click="scrollRight">&#10095;</button>
  </div>
</template>

<script>
import { useStore } from "vuex";

export default {
  name: "HorizontalSlider",
  props: { products: { type: Array, required: true } },
  setup(props) {
    const store = useStore();
    const scrollX = Vue.ref(0);
    const itemWidth = 180;
    const gap = 16;

    const addToCart = (product) => {
      // On ajoute la première variante si existante
      const variant = product.variants?.[0] || {};
      const item = {
        id: product.id,
        name: product.name,
        price: variant.price || product.price,
        size: variant.size || null,
        color: variant.color || null,
        quantity: 1,
      };
      store.dispatch("addToCart", item);
    };

    const scrollLeft = () => {
      scrollX.value = Math.max(0, scrollX.value - (itemWidth + gap) * 2);
    };
    const scrollRight = () => {
      const maxScroll = (itemWidth + gap) * props.products.length - window.innerWidth;
      scrollX.value = Math.min(maxScroll, scrollX.value + (itemWidth + gap) * 2);
    };

    return { scrollX, addToCart, scrollLeft, scrollRight };
  },
};
</script>
