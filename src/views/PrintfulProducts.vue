<template>
  <div class="products-container">
    <h1>Produits Printful</h1>

    <div v-if="loading">Chargement des produits...</div>
    <div v-else-if="products.length === 0">Aucun produit disponible</div>

    <div class="products-grid">
      <div class="product-card" v-for="product in products" :key="product.id">
        <img
          v-if="product.thumbnail"
          :src="product.thumbnail"
          :alt="product.name"
          class="product-image"
        />
        <div class="product-info">
          <h2>{{ product.name }}</h2>
          <p>{{ product.description }}</p>
          <p class="price">{{ product.price }} €</p>
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
      loading: true,
    };
  },
  async mounted() {
    try {
      const response = await axios.get(
        "https://printfulapi-production.up.railway.app/printful/products"
      );
      this.products = response.data.products || [];
    } catch (err) {
      console.error("Erreur récupération produits:", err);
    } finally {
      this.loading = false;
    }
  },
};
</script>

<style scoped>
.products-container {
  padding: 2rem;
  font-family: Arial, sans-serif;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.5rem;
  margin-top: 1rem;
}

.product-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  background-color: #fff;
  display: flex;
  flex-direction: column;
}

.product-image {
  width: 100%;
  object-fit: cover;
  height: 200px;
}

.product-info {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.price {
  font-weight: bold;
  color: #1f2937;
}
</style>
