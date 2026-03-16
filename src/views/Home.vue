<template>

<div class="home">

<h1>Produits</h1>

<PrintfulProducts @add-to-cart="addToCart"/>

</div>

</template>

<script>
import PrintfulProducts from "./PrintfulProducts.vue"
import { useStore } from "vuex"

export default{
components:{PrintfulProducts},

setup(){

const store = useStore()

const addToCart = (product)=>{
store.dispatch("addToCart",product)
}

return{addToCart}

}
}
</script>
