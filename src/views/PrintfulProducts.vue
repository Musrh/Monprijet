<template>
  <div class="printful-products">

    <div
      v-for="product in products"
      :key="product.id"
      class="product-card"
    >

      <!-- Nom -->
      <h2 class="product-title">
        {{ product.name }}
      </h2>

      <!-- Description -->
      <p class="product-description">
        {{ product.description }}
      </p>

      <!-- Image -->
      <img
        v-if="product.thumbnail"
        :src="product.thumbnail"
        class="main-mockup"
      />

      <!-- Tailles visibles -->
      <div class="sizes">

        <strong>Tailles :</strong>

        <span
          v-for="size in getSizes(product)"
          :key="size"
          class="size-badge"
        >
          {{ size }}
        </span>

      </div>

      <!-- Prix -->
      <p class="price">
        💰 {{ product.price }} €
      </p>

      <!-- Ajouter panier -->
      <button
        class="add-cart-btn"
        @click="addToCart(product)"
      >
        Ajouter au panier
      </button>

    </div>

  </div>
</template>

<script>
import axios from "axios";

export default {

  name: "PrintfulProducts",

  props:{
    apiUrl:String
  },

  data(){
    return{
      products:[]
    }
  },

  async mounted(){

    const res = await axios.get(
      `${this.apiUrl}/printful/products`
    )

    this.products = res.data.products
  },

  methods:{

    getSizes(product){

      const sizes = product.variants
        .map(v => v.size)
        .filter(Boolean)

      return [...new Set(sizes)]
    },

    addToCart(product){

      const produit = {

        id: product.id,

        nom: product.name,

        prix: product.price,

        description: product.description,

        images: [product.thumbnail],

        source: "printful"

      }

      this.$emit("add-to-cart",produit)

    }

  }

}
</script>

<style scoped>

.printful-products{
  display:grid;
  grid-template-columns:1fr;
  gap:1.5rem;
}

@media (min-width:768px){
  .printful-products{
    grid-template-columns:repeat(2,1fr);
  }
}

.product-card{
  border:1px solid #ddd;
  padding:1rem;
  border-radius:8px;
  background:white;
}

.product-title{
  font-weight:bold;
  font-size:18px;
}

.product-description{
  color:#666;
  font-size:14px;
}

.main-mockup{
  width:100%;
  margin:10px 0;
}

.sizes{
  margin-top:10px;
}

.size-badge{
  display:inline-block;
  background:#f3f4f6;
  border:1px solid #ddd;
  padding:4px 8px;
  margin:3px;
  border-radius:4px;
  font-size:13px;
}

.price{
  font-weight:bold;
  margin-top:10px;
}

.add-cart-btn{
  width:100%;
  margin-top:10px;
  background:#16a34a;
  color:white;
  padding:8px;
  border:none;
  border-radius:4px;
  cursor:pointer;
}

.add-cart-btn:hover{
  background:#15803d;
}

</style>
