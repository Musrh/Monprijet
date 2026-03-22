<template>
  <div class="p-4 max-w-3xl mx-auto">
    <h1 class="text-2xl font-bold mb-4">Votre Panier</h1>

    <div v-if="!user">
      <p class="text-red-600 font-semibold">
        Vous devez être connecté pour payer.
      </p>
      <button
        @click="$router.push('/login')"
        class="bg-black text-white px-4 py-2 mt-3 rounded"
      >
        Se connecter
      </button>
    </div>

    <div v-else-if="cart.length">
      <ul class="mb-6">
        <li v-for="item in cart" :key="item.id" class="flex justify-between">
          <span>{{ item.nom }} x {{ item.quantity }}</span>
          <span>{{ item.prix * item.quantity }} €</span>
        </li>
      </ul>

      <h2 class="font-semibold mb-2">Adresse</h2>

      <input v-model="adresse1" placeholder="Adresse 1" class="input" />
      <input v-model="adresse2" placeholder="Adresse 2" class="input" />
      <input v-model="codePostal" placeholder="Code postal" class="input" />
      <input v-model="ville" placeholder="Ville" class="input" />
      <input v-model="pays" placeholder="Pays" class="input" />

      <div class="flex gap-4 mt-4">
        <button
          @click="checkoutStripe"
          class="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Stripe
        </button>

        <button
          @click="checkoutPaypal"
          class="bg-yellow-500 text-black px-4 py-2 rounded"
        >
          PayPal
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
    ...mapState(["cart", "user"]),
  },
  methods: {
    getAdresse() {
      return `${this.adresse1} ${this.adresse2}, ${this.codePostal} ${this.ville}, ${this.pays}`;
    },

    async checkoutStripe() {
      try {
        const response = await axios.post(
          "https://stripe-backend-production-2ac4.up.railway.app/create-stripe-session",
          {
            items: this.cart,
            email: this.user.email,
            adresseLivraison: this.getAdresse(),
          }
        );
        window.location.href = response.data.url;
      } catch (err) {
        console.error("Stripe error:", err);
        alert("Impossible de créer la session Stripe.");
      }
    },

    async checkoutPaypal() {
      if (!this.cart.length) {
        alert("Votre panier est vide !");
        return;
      }

      try {
        // Forcer types numériques
        const itemsPayload = this.cart.map(item => ({
          nom: item.nom,
          prix: Number(item.prix),
          quantity: Number(item.quantity),
        }));

        const order = await axios.post(
          "https://stripe-backend-production-2ac4.up.railway.app/create-paypal-order",
          { items: itemsPayload }
        );

        const approveUrl = order.data.approveUrl;
        if (!approveUrl) throw new Error("Aucune URL d'approbation PayPal reçue");

        // Redirection vers PayPal
        window.location.href = approveUrl;
      } catch (err) {
        console.error("PayPal error:", err);
        alert("Impossible de créer l'ordre PayPal.");
      }
    },
  },
};
</script>

<style scoped>
.input {
  display: block;
  width: 100%;
  margin-bottom: 10px;
  padding: 8px;
  border: 1px solid #ddd;
}
</style>
