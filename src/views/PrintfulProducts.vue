//Printfulproducts dernier 
<template>
  <div class="printful-products">
    <div v-for="product in products" :key="product.id" class="product-card">
      <!-- Nom et description -->
      <h2>{{ product.name }}</h2>
      <p>{{ product.description }}</p>

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
            🎨 {{ variant.color }} | 📏 {{ variant.size }} | 💰 {{ variant.price }} €
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
.printful-products {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
}

.product-card {
  border: 1px solid #ccc;
  padding: 1rem;
  width: 300px;
}

.main-mockup {
  width: 100%;
  object-fit: cover;
  margin-bottom: 1rem;
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
  width: 60px;
  height: 60px;
  object-fit: cover;
  border: 1px solid #ddd;
  border-radius: 4px;
}
</style>
