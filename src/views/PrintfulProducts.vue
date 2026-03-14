<template>
  <div class="printful-products">
    <h1>Produits Printful</h1>
    <div v-if="products.length === 0">Aucun produit trouvé.</div>
    <div v-else class="grid">
      <div v-for="p in products" :key="p.id" class="product-card">
        <img :src="p.thumbnail || '/placeholder.png'" :alt="p.name" />
        <h2>{{ p.name }}</h2>
        <p>{{ p.description }}</p>
        <p class="price">{{ p.price }} €</p>
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
  async created() {
    try {
      const res = await axios.get(
        "https://printfulapi-production.up.railway.app/printful/products"
      );
      this.products = res.data.products || [];
    } catch (err) {
      console.error("Erreur fetching products:", err.message);
    }
  },
};
</script>

<style scoped>
.printful-products {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 20px;
  width: 100%;
}

.product-card {
  border: 1px solid #ddd;
  border-radius: 12px;
  padding: 10px;
  text-align: center;
}

.product-card img {
  width: 100%;
  object-fit: contain;
  transition: transform 0.2s;
}

.product-card img:hover {
  transform: scale(1.05);
}

.price {
  font-weight: bold;
  margin-top: 5px;
}
</style>
