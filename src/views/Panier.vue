<template>
  <div class="p-4 max-w-3xl mx-auto">
    <h1 class="text-2xl font-bold mb-4">Votre Panier</h1>

    <div v-if="cart.length">
      <ul class="mb-6">
        <li v-for="item in cart" :key="item.id" class="flex justify-between mb-2">
          <span>{{ item.nom }} x {{ item.quantity }}</span>
          <span>{{ item.prix * item.quantity }} €</span>
        </li>
      </ul>

      <h2 class="text-xl font-semibold mb-2">Adresse de livraison</h2>
      <form @submit.prevent>
        <input v-model="adresse1" placeholder="Adresse 1" class="mb-2 w-full p-2 border" />
        <input v-model="adresse2" placeholder="Adresse 2" class="mb-2 w-full p-2 border" />
        <input v-model="codePostal" placeholder="Code Postal" class="mb-2 w-full p-2 border" />
        <input v-model="ville" placeholder="Ville" class="mb-2 w-full p-2 border" />
        <input v-model="pays" placeholder="Pays" class="mb-2 w-full p-2 border" />
      </form>

      <div class="flex gap-4 mt-4">
        <!-- Bouton Stripe -->
        <button
          @click="checkoutStripe"
          class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Payer avec Stripe
        </button>

        <!-- Bouton PayPal -->
        <button
          @click="checkoutPaypal"
          class="bg-yellow-500 text-black px-4 py-2 rounded hover:bg-yellow-600"
        >
          Payer avec PayPal
        </button>
      </div>
    </div>

    <p v-else>Votre panier est vide.</p>
  </div>
</template>

<script>
import { mapState } from "vuex";
import axios from "axios";

export default {
  name: "Panier",
  data() {
    return {
      adresse1: "",
      adresse2: "",
      codePostal: "",
      ville: "",
      pays: "",
    };
  },
  computed: {
    ...mapState(["cart"]),
  },
  methods: {
    getFullAdresse() {
      return `${this.adresse1} ${this.adresse2}, ${this.codePostal} ${this.ville}, ${this.pays}`;
    },
    async checkoutStripe() {
      try {
        const response = await axios.post(
          "https://stripe-backend-production-2ac4.up.railway.app/create-stripe-session",
          {
            items: this.cart,
            email: "test@example.com", // remplacer par l'email connecté
            adresseLivraison: this.getFullAdresse(),
          }
        );
        window.location.href = response.data.url; // redirection Stripe
      } catch (err) {
        console.error("Erreur Stripe:", err);
        alert("Impossible de créer la session Stripe.");
      }
    },
    async checkoutPaypal() {
      try {
        // 1️⃣ Création de l'ordre PayPal
        const orderResponse = await axios.post(
          "https://stripe-backend-production-2ac4.up.railway.app/create-paypal-order",
          { items: this.cart }
        );
        const orderId = orderResponse.data.id;

        // 2️⃣ Capture du paiement
        const captureResponse = await axios.post(
          "https://stripe-backend-production-2ac4.up.railway.app/capture-paypal-order",
          {
            orderId,
            email: "test@example.com",
            adresseLivraison: this.getFullAdresse(),
            items: this.cart,
          }
        );

        if (captureResponse.data.success) {
          alert("Paiement PayPal réussi !");
          this.$router.push("/success");
        }
      } catch (err) {
        console.error("Erreur PayPal:", err);
        alert("Impossible de traiter le paiement PayPal.");
      }
    },
  },
};
</script>

<style scoped>
input {
  border-radius: 4px;
}
</style>
