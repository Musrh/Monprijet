<template>
  <div class="products-grid">
    <div v-for="product in products" :key="product.id" class="product-card">
      <img :src="product.thumbnail" alt="product.name" class="product-image" />
      <h2 class="product-name">{{ product.name }}</h2>
      <p class="product-description">{{ product.description }}</p>
      <p class="product-price">€{{ product.price }}</p>
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
      const res = await axios.get("https://ton-backend-url/printful/products");
      this.products = res.data.result;
    } catch (err) {
      console.error("Erreur fetching Printful products:", err);
    }
  },
};
</script>

<style scoped>
.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
}
.product-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 1rem;
  text-align: center;
}
.product-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}
.product-name {
  font-weight: bold;
  margin: 0.5rem 0;
}
.product-description {
  font-size: 0.9rem;
  color: #555;
}
.product-price {
  font-size: 1.1rem;
  color: #222;
  margin-top: 0.5rem;
}
</style>
