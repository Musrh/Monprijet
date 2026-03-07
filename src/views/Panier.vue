<template>
  <div>
    <h2>Mon Panier</h2>

    <div v-if="cart.length === 0">Panier vide</div>

    <div v-else>
      <div v-for="item in cart" :key="item.id">
        {{ item.nom }} - {{ item.prix }}€
      </div>

      <p>Total : {{ total.toFixed(2) }} €</p>

      <select v-model="paymentMethod">
        <option value="stripe">Carte bancaire</option>
        <option value="paypal">PayPal</option>
      </select>

      <!-- Stripe -->
      <button v-if="paymentMethod === 'stripe'" @click="payerStripe">Payer Stripe</button>

      <!-- PayPal -->
      <div v-show="paymentMethod === 'paypal'" id="paypal-button-container"></div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  data() {
    return { paymentMethod: "stripe" };
  },
  computed: {
    ...mapState(["cart", "user"]),
    total() { return this.cart.reduce((s,i)=>s+i.prix*i.quantity,0); }
  },
  watch: {
    paymentMethod(newVal) {
      if (newVal === "paypal") this.$nextTick(this.renderPayPalButton);
    },
    cart() {
      if (this.paymentMethod === "paypal") this.$nextTick(this.renderPayPalButton);
    }
  },
  methods: {
    payerStripe() { /* ton code Stripe ici */ },

    renderPayPalButton() {
      if (!window.paypal) return console.error("SDK PayPal non chargé");

      const container = document.getElementById("paypal-button-container");
      container.innerHTML = ""; // vide le conteneur avant de créer un nouveau bouton

      const total = this.cart.reduce((s,i)=>s+i.prix*i.quantity,0).toFixed(2);

      window.paypal.Buttons({
        createOrder: (data, actions) => actions.order.create({
          purchase_units: [{ amount: { currency_code: "EUR", value: total } }]
        }),
        onApprove: async (data, actions) => {
          const capture = await actions.order.capture();
          alert("Paiement PayPal réussi ! ID: " + capture.id);
          console.log("Capture:", capture);
        },
        onError: err => { console.error(err); alert("Erreur PayPal"); }
      }).render("#paypal-button-container");
    }
  }
};
</script>
