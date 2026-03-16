<template>
  <div class="printful-products">

    <div
      v-for="product in products"
      :key="product.id"
      class="product-card"
    >

      <h2 class="product-title">{{ product.name }}</h2>

      <p class="product-description">
        {{ product.description }}
      </p>

      <!-- image -->
      <img
        v-if="product.thumbnail"
        :src="product.thumbnail"
        class="main-mockup"
      />

      <!-- couleurs -->
      <div class="selector">
        <label>Couleur :</label>

        <div class="options">
          <button
            v-for="color in product.availableColors"
            :key="color"
            :class="['option-btn',
            selectedColor[product.id] === color ? 'active' : '']"
            @click="selectColor(product.id,color)"
          >
            {{ color }}
          </button>
        </div>
      </div>

      <!-- tailles -->
      <div class="selector">
        <label>Taille :</label>

        <div class="options">
          <button
            v-for="size in product.availableSizes"
            :key="size"
            :class="['option-btn',
            selectedSize[product.id] === size ? 'active' : '']"
            @click="selectSize(product.id,size)"
          >
            {{ size }}
          </button>
        </div>
      </div>

      <!-- prix -->
      <p class="price">
        💰 {{ product.price }} €
      </p>

      <!-- panier -->
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
      products:[],
      selectedColor:{},
      selectedSize:{}
    }
  },

  async mounted(){

    const res = await axios.get(
      `${this.apiUrl}/printful/products`
    )

    this.products = res.data.products
  },

  methods:{

    selectColor(productId,color){
      this.selectedColor[productId] = color
    },

    selectSize(productId,size){
      this.selectedSize[productId] = size
    },

    addToCart(product){

      const item = {
        id: product.id,
        name: product.name,
        price: product.price,
        color: this.selectedColor[product.id] || "",
        size: this.selectedSize[product.id] || "",
        image: product.thumbnail,
        quantity:1
      }

      this.$emit("add-to-cart",item)
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
  border-radius:6px;
}

.selector{
  margin-top:10px;
}

.options{
  display:flex;
  gap:6px;
  flex-wrap:wrap;
}

.option-btn{
  border:1px solid #ccc;
  padding:5px 10px;
  border-radius:4px;
  background:white;
  cursor:pointer;
}

.option-btn.active{
  background:#2563eb;
  color:white;
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
