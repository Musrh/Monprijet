<template>
  <div class="printful-products">
    <div v-for="product in products" :key="product.id" class="product-card">
      <h2>{{ product.name }}</h2>
      <p>{{ product.description }}</p>
      <img :src="product.thumbnail" :alt="product.name" class="main-mockup" />

      <div class="variants">
        <h3>Variantes</h3>
        <div v-for="variant in product.variants" :key="variant.id" class="variant">
          <img :src="variant.thumbnail" :alt="variant.color + ' ' + variant.size" class="variant-mockup" />
          <p>🎨 {{ variant.color }} | 📏 {{ variant.size }} | 💰 {{ variant.price }} €</p>
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
    return { products: [] };
  },
  async mounted() {
    try {
      const res = await axios.get("https://printfulapi-production.up.railway.app/printful/products");
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

.variant-mockup {
  width: 80px;
  object-fit: cover;
  margin-right: 0.5rem;
}
</style>
