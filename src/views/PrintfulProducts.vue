<template>
  <div class="printful-products">
    <!-- Slider horizontal ou grille responsive -->
    <div class="products-grid">
      <div
        v-for="product in products"
        :key="product.id"
        class="product-card"
      >
        <!-- Nom et description -->
        <h2 class="font-bold text-lg mb-1">{{ product.name }}</h2>
        <p class="text-gray-600 text-sm mb-2">{{ product.description }}</p>

        <!-- Mockup principal -->
        <img
          v-if="product.thumbnail"
          :src="product.thumbnail"
          :alt="product.name"
          class="main-mockup mb-2"
        />

        <!-- Variantes disponibles (texte uniquement) -->
        <div v-if="product.variants && product.variants.length" class="variants mb-2">
          <h3 class="text-sm font-medium mb-1">Tailles disponibles :</h3>
          <div class="flex flex-wrap gap-1">
            <span
              v-for="variant in product.variants"
              :key="variant.id"
              class="text-xs px-2 py-1 border rounded bg-gray-100"
            >
              {{ variant.size || "N/A" }}
            </span>
          </div>

          <h3 class="text-sm font-medium mt-2 mb-1">Couleurs disponibles :</h3>
          <div class="flex flex-wrap gap-1">
            <span
              v-for="variant in product.variants"
              :key="variant.id + '-color'"
              class="text-xs px-2 py-1 border rounded bg-gray-100"
            >
              {{ variant.color || "N/A" }}
            </span>
          </div>
        </div>

        <!-- Prix principal -->
        <p class="text-green-600 font-bold text-lg mb-2">
          {{ product.price }} €
        </p>

        <!-- Bouton ajouter au panier -->
        <button
          @click="addToCart(product)"
          class="bg-green-600 text-white py-2 rounded hover:bg-green-700 w-full"
        >
          Ajouter au panier
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "PrintfulProducts",
  props: {
    // On reçoit le store ou la méthode d'ajout au panier depuis Home.vue
    onAddToCart: {
      type: Function,
      default: null,
    },
  },
  data() {
    return {
      products: [],
    };
  },
  async mounted() {
    try {
      const res = await axios.get(
        "https://printfulapi-production.up.railway.app/printful/products"
      );
      this.products = res.data.products;
    } catch (err) {
      console.error("Erreur fetching products:", err);
    }
  },
  methods: {
    addToCart(product) {
      const item = {
        id: product.id,
        name: product.name,
        price: product.price, // on prend le prix principal
        quantity: 1,
      };
      if (this.onAddToCart) {
        this.onAddToCart(item);
      } else {
        console.log("Ajouter au panier :", item);
      }
    },
  },
};
</script>

<style scoped>
.printful-products {
  width: 100%;
}

.products-grid {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); /* maximum de produits par ligne */
}

.product-card {
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  padding: 0.75rem;
  display: flex;
  flex-direction: column;
  background-color: #fff;
}

.main-mockup {
  width: 100%;
  height: 160px;
  object-fit: cover;
  border-radius: 0.25rem;
}
</style>
