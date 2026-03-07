<template>
<div class="container mx-auto p-6">

<h1 class="text-2xl font-bold mb-6">🛒 Mon Panier</h1>

<div v-if="cart.length === 0">
Panier vide
</div>

<div v-for="item in cart" :key="item.id" class="flex items-center mb-4 border-b pb-3">

  <img :src="item.image" class="w-16 h-16 mr-4">

  <div class="flex-1">
    <h3 class="font-bold">{{ item.nom }}</h3>
    <p>{{ item.prix }} €</p>
  </div>

  <p>x {{ item.qty }}</p>

</div>

<h2 class="text-xl font-bold mt-6">
Total : {{ total }} €
</h2>

<select v-model="paymentMethod" class="border p-2 mt-4">
<option disabled value="">Choisir paiement</option>
<option value="card">Carte bancaire</option>
<option value="paypal">PayPal</option>
</select>

<div v-if="paymentMethod === 'paypal'" class="mt-6">
<div id="paypal-button-container"></div>
</div>

</div>
</template>

<script>

export default {

data(){
return{
paymentMethod:""
}
},

computed:{

cart(){
return this.$store.state.cart
},

total(){
return this.cart.reduce((sum,item)=>{
return sum + item.prix * item.qty
},0)
}

},

watch:{

paymentMethod(value){

if(value==="paypal"){

this.$nextTick(()=>{
this.renderPaypal()
})

}

}

},

methods:{

renderPaypal(){

if(!window.paypal) return

document.getElementById("paypal-button-container").innerHTML=""

window.paypal.Buttons({

createOrder:(data,actions)=>{

return actions.order.create({

purchase_units:[{

amount:{
value:this.total.toFixed(2)
}

}]

})

},

onApprove:(data,actions)=>{

return actions.order.capture().then(details=>{

alert("Paiement réussi "+details.payer.name.given_name)

this.$store.commit("clearCart")

})

}

}).render("#paypal-button-container")

}

}

}

</script>
