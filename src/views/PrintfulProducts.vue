<template>
  <div class="printful-products">
    <h2 class="text-xl font-bold mb-4">Produits Printful</h2>

    <div class="slider-container">
      <button @click="scrollLeft" class="scroll-btn left">&lt;</button>

      <div class="slider" ref="slider">
        <div
          v-for="product in products"
          :key="product.id"
          class="product-card"
        >
          <!-- Image principale -->
          <img
            v-if="selectedVariant[product.id]?.thumbnail"
            :src="selectedVariant[product.id].thumbnail"
            :alt="product.name"
            class="main-mockup"
          />

          <!-- Nom -->
          <h3 class="font-bold text-lg mt-2">{{ product.name }}</h3>

          <!-- Description -->
          <p class="text-gray-600 text-sm">{{ product.description }}</p>

          <!-- Prix -->
          <p class="text-green-600 font-bold">
            {{ selectedVariant[product.id]?.price || product.price }} €
          </p>

          <!-- Tailles -->
          <div v-if="product.variants.length" class="variants mt-2">
            <p class="text-sm font-semibold">Tailles :</p>
            <div class="sizes flex flex-wrap gap-2 mb-1">
              <button
                v-for="variant in product.variants"
                :key="variant.id + '-size'"
                class="size-chip"
                :class="{
                  'bg-blue-600 text-white': selectedVariant[product.id]?.id === variant.id
                }"
                @click="selectVariant(product.id, variant)"
              >
                {{ variant.size }}
              </button>
            </div>

            <!-- Couleurs -->
            <p class="text-sm font-semibold">Couleurs :</p>
            <div class="colors flex flex-wrap gap-2 mb-2">
              <button
                v-for="variant in product.variants"
                :key="variant.id + '-color'"
                class="color-chip"
                :class="{
                  'bg-blue-600 text-white': selectedVariant[product.id]?.id === variant.id
                }"
                @click="selectVariant(product.id, variant)"
              >
                {{ variant.color }}
              </button>
            </div>
          </div>

          <!-- Bouton Ajouter au panier -->
          <button
            class="add-cart-btn mt-auto bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
            @click="addToCart(product)"
          >
            Ajouter au panier
          </button>
        </div>
      </div>

      <button @click="scrollRight" class="scroll-btn right">&gt;</button>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { ref, onMounted, reactive } from "vue";
import { useStore } from "vuex";

export default {
  name: "PrintfulProducts",
  setup() {
    const products = ref([]);
    const slider = ref(null);
    const store = useStore();

    // Stocke la variante sélectionnée pour chaque produit
    const selectedVariant = reactive({});

    const fetchProducts = async () => {
      try {
        const res = await axios.get(
          "https://printfulapi-production.up.railway.app/printful/products"
        );
        products.value = res.data.products;

        // initialisation des variantes sélectionnées (première variante)
        products.value.forEach((p) => {
          if (p.variants && p.variants.length > 0) {
            selectedVariant[p.id] = p.variants[0];
          }
        });
      } catch (err) {
        console.error("Erreur fetching products:", err);
      }
    };

    const selectVariant = (productId, variant) => {
      selectedVariant[productId] = variant;
    };

    const addToCart = (product) => {
      const variant = selectedVariant[product.id];
      if (!variant) return;

      const item = {
        id: product.id,
        name: product.name,
        price: variant.price,
        size: variant.size,
        color: variant.color,
        quantity: 1,
        thumbnail: variant.thumbnail || product.thumbnail
      };

      store.dispatch("addToCart", item);
    };

    const scrollLeft = () => slider.value.scrollBy({ left: -300, behavior: "smooth" });
    const scrollRight = () => slider.value.scrollBy({ left: 300, behavior: "smooth" });

    onMounted(fetchProducts);

    return { products, slider, selectedVariant, selectVariant, addToCart, scrollLeft, scrollRight };
  },
};
</script>

<style scoped>
.printful-products {
  width: 100%;
  margin-bottom: 2rem;
}

.slider-container {
  position: relative;
  display: flex;
  align-items: center;
}

.slider {
  display: flex;
  overflow-x: auto;
  scroll-behavior: smooth;
  gap: 1rem;
  padding: 0.5rem 0;
}

.slider::-webkit-scrollbar {
  display: none;
}

.product-card {
  flex: 0 0 200px;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 0.5rem;
  background-color: #fff;
  display: flex;
  flex-direction: column;
}

.main-mockup {
  width: 100%;
  object-fit: cover;
  border-radius: 6px;
}

.size-chip,
.color-chip {
  background-color: #f1f1f1;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  cursor: pointer;
}

.size-chip.bg-blue-600,
.color-chip.bg-blue-600 {
  background-color: #2563eb;
  color: white;
}

.scroll-btn {
  position: absolute;
  top: 40%;
  background-color: rgba(0, 0, 0, 0.3);
  color: white;
  border: none;
  padding: 0.5rem;
  font-size: 1.5rem;
  cursor: pointer;
  z-index: 10;
  border-radius: 50%;
}

.scroll-btn.left {
  left: -10px;
}

.scroll-btn.right {
  right: -10px;
}

.add-cart-btn {
  margin-top: auto;
}
</style>
