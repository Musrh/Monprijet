<template>
  <div class="products">

    <div
      v-for="product in products"
      :key="product.id"
      class="product"
    >

      <img
        v-if="product.thumbnail"
        :src="product.thumbnail"
        :alt="product.name"
      />

      <h3>{{ product.name }}</h3>

      <p>{{ product.description }}</p>

      <strong>{{ product.price }} €</strong>

    </div>

  </div>
</template>

<script>
import axios from "axios"

export default {

  data() {
    return {
      products: []
    }
  },

  async mounted() {

    const res = await axios.get(
      "https://printfulapi-production.up.railway.app/printful/products"
    )

    this.products = res.data.products
  }

}
</script>

<style scoped>

.products{
display:grid;
grid-template-columns:repeat(auto-fill,minmax(250px,1fr));
gap:20px;
}

.product img{
width:100%;
height:250px;
object-fit:contain;
}

</style>
