<template>
  <div class="printful-products">
    
    <div
      v-for="product in products"
      :key="product.id"
      class="product-card"
    >
      <!-- Nom -->
      <h2 class="product-title">{{ product.name }}</h2>

      <!-- Description -->
      <p class="product-description">
        {{ product.description }}
      </p>

      <!-- Mockup principal -->
      <img
        v-if="product.thumbnail"
        :src="product.thumbnail"
        :alt="product.name"
        class="main-mockup"
      />

      <!-- Variantes -->
      <div v-if="product.variants.length" class="variants">
        <h3>Variantes disponibles</h3>

        <div
          v-for="variant in product.variants"
          :key="variant.id"
          class="variant-card"
        >
          <img
            v-if="variant.thumbnail"
            :src="variant.thumbnail"
            :alt="variant.color + ' ' + variant.size"
            class="variant-mockup"
          />

          <p>
            🎨 {{ variant.color }} |
            📏 {{ variant.size }} |
            💰 {{ variant.price }} €
          </p>
        </div>

      </div>

    </div>

  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "PrintfulProducts",

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
};
</script>

<style scoped>

/* grille produits */
.printful-products {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 1.5rem;
}

/* 2 produits par ligne sur écran moyen et + */
@media (min-width: 768px) {
  .printful-products {
    grid-template-columns: repeat(2, 1fr);
  }
}

.product-card {
  border: 1px solid #ccc;
  padding: 1rem;
  background: white;
  border-radius: 8px;
}

.product-title {
  font-size: 18px;
  font-weight: bold;
}

.product-description {
  font-size: 14px;
  color: #666;
}

.main-mockup {
  width: 100%;
  object-fit: cover;
  margin-bottom: 1rem;
  border-radius: 6px;
}

.variants {
  margin-top: 1rem;
}

.variant-card {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.variant-mockup {
  width: 50px;
  height: 50px;
  object-fit: cover;
  border: 1px solid #ddd;
  border-radius: 4px;
}

</style>
