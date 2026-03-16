<template>
  <div class="printful-products">
    <div class="slider-wrapper">
      <button class="scroll-btn left" @click="scrollLeft">&#10094;</button>
      <div class="slider-container" ref="sliderContainer">
        <div class="slider-grid">
          <div
            v-for="product in products"
            :key="product.id"
            class="product-card"
          >
            <img :src="product.thumbnail" :alt="product.name" class="main-mockup" />
            <h3 class="font-bold text-sm mt-1">{{ product.name }}</h3>
            <p class="text-gray-600 text-xs">{{ product.description }}</p>

            <div class="variants flex flex-wrap gap-1 mt-1">
              <span
                v-for="variant in product.variants"
                :key="variant.id"
                class="px-2 py-1 border rounded bg-gray-100 text-xs cursor-pointer"
                :class="{ 'bg-green-200': isSelected(product.id, variant.id) }"
                @click="selectVariant(product.id, variant.id)"
              >
                {{ variant.size || 'N/A' }} / {{ variant.color || 'N/A' }}
              </span>
            </div>

            <p class="text-green-600 font-bold mt-1 text-sm">
              💰 {{ getVariantPrice(product.id) }} €
            </p>

            <button
              class="mt-1 bg-green-600 text-white py-1 rounded w-full text-xs hover:bg-green-700"
              @click="addToCart(product)"
            >
              Ajouter au panier
            </button>
          </div>
        </div>
      </div>
      <button class="scroll-btn right" @click="scrollRight">&#10095;</button>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import axios from "axios";
import { useStore } from "vuex";

export default {
  name: "PrintfulProducts",
  setup() {
    const store = useStore();
    const products = ref([]);
    const sliderContainer = ref(null);
    const selectedVariants = ref({}); // { productId: variantId }

    const fetchProducts = async () => {
      try {
        const res = await axios.get(
          "https://printfulapi-production.up.railway.app/printful/products"
        );
        products.value = res.data.products;
        // Initialiser une variante sélectionnée par défaut
        products.value.forEach((p) => {
          if (p.variants.length > 0) selectedVariants.value[p.id] = p.variants[0].id;
        });
      } catch (err) {
        console.error("Erreur fetching products:", err);
      }
    };

    const selectVariant = (productId, variantId) => {
      selectedVariants.value[productId] = variantId;
    };

    const isSelected = (productId, variantId) =>
      selectedVariants.value[productId] === variantId;

    const getVariantPrice = (productId) => {
      const product = products.value.find((p) => p.id === productId);
      const variantId = selectedVariants.value[productId];
      const variant = product?.variants.find((v) => v.id === variantId);
      return variant?.price || product?.price || 0;
    };

    const addToCart = (product) => {
      const variantId = selectedVariants.value[product.id];
      const variant = product.variants.find((v) => v.id === variantId) || {};
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

    const scrollAmount = 300;
    const scrollLeft = () => {
      sliderContainer.value.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    };
    const scrollRight = () => {
      sliderContainer.value.scrollBy({ left: scrollAmount, behavior: "smooth" });
    };

    onMounted(() => {
      fetchProducts();
    });

    return {
      products,
      sliderContainer,
      selectVariant,
      addToCart,
      isSelected,
      getVariantPrice,
      scrollLeft,
      scrollRight,
    };
  },
};
</script>

<style scoped>
.printful-products {
  position: relative;
  width: 100%;
}

.slider-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  overflow: hidden;
}

.slider-container {
  overflow-x: auto;
  scroll-behavior: smooth;
  flex: 1;
}

.slider-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  grid-auto-rows: auto;
  gap: 1rem;
}

.product-card {
  border: 1px solid #ccc;
  padding: 0.5rem;
  border-radius: 0.25rem;
  background: #fff;
}

.main-mockup {
  width: 100%;
  object-fit: cover;
  border-radius: 0.25rem;
}

.scroll-btn {
  position: absolute;
  top: 40%;
  background: rgba(255, 255, 255, 0.8);
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  z-index: 10;
  padding: 0.2rem 0.5rem;
  border-radius: 50%;
}

.scroll-btn.left {
  left: 0.2rem;
}

.scroll-btn.right {
  right: 0.2rem;
}
</style>
