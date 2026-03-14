<template>
  <div class="printful-products">
    <div
      v-for="product in products"
      :key="product.id"
      class="product-card"
    >
      <img
        v-if="product.thumbnail"
        :src="product.thumbnail"
        :alt="product.name"
        class="product-image"
      />
      <h2>{{ product.name }}</h2>
      <p>{{ product.description }}</p>
      <p>{{ product.variants[0]?.price || 0 }} €</p>
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
      this.products = res.data.products || [];
    } catch (err) {
      console.error("Erreur récupération produits :", err);
    }
  },
};
</script>

<style scoped>
.printful-products {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.product-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 10px;
  width: 250px;
  text-align: center;
}

.product-image {
  width: 100%;
  height: auto;
  object-fit: contain;
  transition: transform 0.2s;
}

.product-image:hover {
  transform: scale(1.05);
}
</style>
