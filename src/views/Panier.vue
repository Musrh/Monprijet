<template>
<div class="container mx-auto p-6">

<h1 class="text-2xl font-bold mb-6">🛒 Mon Panier</h1>

<div v-if="cart.length === 0">
  Panier vide
</div>

<div v-for="item in cart" :key="item.id" class="flex items-center mb-4 border-b pb-3">

  <img :src="item.image" class="w-16 h-16 object-cover mr-4">

  <div class="flex-1">
    <h3 class="font-bold">{{ item.nom }}</h3>
    <p>{{ item.prix }} €</p>
  </div>

  <input
    type="number"
    min="1"
    v-model.number="item.qty"
    class="border w-16 text-center mr-4"
  />

  <button
    @click="removeItem(item.id)"
    class="bg-red-500 text-white px-3 py-1 rounded"
  >
    X
  </button>

</div>

<h2 class="text-xl font-bold mt-6">
Total : {{ total }} €
</h2>

<select v-model="paymentMethod" class="border p-2 mt-4">
  <option disabled value="">Choisir paiement</option>
  <option value="card">Carte bancaire</option>
  <option value="paypal">PayPal</option>
</select>

<!-- BOUTON PAYPAL -->

<div v-if="paymentMethod === 'paypal'" class="mt-6">

  <div id="paypal-button-container"></div>

</div>

</div>
</template>

<script>

export default {

data() {
  return {

    paymentMethod: "",

    cart: JSON.parse(localStorage.getItem("cart")) || []

  }
},

computed: {

  total() {

    return this.cart.reduce((sum, item) => {

      const prix = Number(item.prix) || 0
      const qty = Number(item.qty) || 1

      return sum + prix * qty

    }, 0)

  }

},

watch: {

  cart: {
    handler(newCart) {

      localStorage.setItem("cart", JSON.stringify(newCart))

    },
    deep: true
  },

  paymentMethod(value) {

    if (value === "paypal") {

      this.$nextTick(() => {

        this.renderPaypal()

      })

    }

  }

},

methods: {

removeItem(id) {

  this.cart = this.cart.filter(item => item.id !== id)

},

renderPaypal() {

  if (!window.paypal) {

    console.error("PayPal SDK non chargé")

    return

  }

  document.getElementById("paypal-button-container").innerHTML = ""

  window.paypal.Buttons({

    createOrder: (data, actions) => {

      return actions.order.create({

        purchase_units: [{

          amount: {

            value: this.total.toFixed(2)

          }

        }]

      })

    },

    onApprove: (data, actions) => {

      return actions.order.capture().then(details => {

        alert("Paiement réussi par " + details.payer.name.given_name)

        this.cart = []

        localStorage.removeItem("cart")

      })

    },

    onError: (err) => {

      console.error(err)

      alert("Erreur paiement")

    }

  }).render("#paypal-button-container")

}

}

}

</script>

<style>

.container{
max-width:900px;
margin:auto;
}

</style>
