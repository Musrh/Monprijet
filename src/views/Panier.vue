<template>

<div class="container mx-auto p-6">

<h1 class="text-2xl font-bold mb-4">Mon Panier</h1>

<div v-for="item in $store.state.cart" :key="item.id" class="flex mb-4">
  <img :src="item.image" class="w-16 mr-4">
  <div>
    <p>{{ item.nom }}</p>
    <p>{{ item.prix }} €</p>
  </div>
</div>

<h2 class="text-xl mt-4">
Total : {{ total }} €
</h2>

<select v-model="paymentMethod" class="border p-2 mt-4">
  <option disabled value="">Choisir paiement</option>
  <option value="card">Carte bancaire</option>
  <option value="paypal">PayPal</option>
</select>

<div v-if="paymentMethod === 'paypal'" class="mt-6">
  <PayPalButton
    :amount="total"
    @success="paymentSuccess"
  />
</div>

</div>

</template>

<script>
import PayPalButton from "../components/PayPalButton.vue";

export default {
  components: {
    PayPalButton
  },

  data() {
    return {
      paymentMethod: "",
    };
  },

  computed: {
    total() {
      return this.$store.state.cart.reduce(
        (sum, item) => sum + item.prix * item.qty,
        0
      );
    }
  },

  methods: {
    paymentSuccess(details) {
      console.log("Commande validée :", details);

      alert("Commande enregistrée !");
      
      this.$store.commit("clearCart");
    }
  }
};
</script>
