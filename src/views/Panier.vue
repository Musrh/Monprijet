<template>
  <div class="p-4 max-w-3xl mx-auto">
    <h1 class="text-2xl font-bold mb-4">Votre Panier</h1>

    <!-- 🔒 Utilisateur non connecté -->
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

    <!-- 🛒 Panier -->
    <div v-else-if="cart.length">
      <ul class="mb-6">
        <li
          v-for="item in cart"
          :key="item.id"
          class="flex justify-between mb-2"
        >
          <span>{{ item.nom }} x {{ item.quantity }}</span>
          <span>{{ item.prix * item.quantity }} €</span>
        </li>
      </ul>

      <h2 class="font-semibold mb-2">Adresse de livraison</h2>

      <input v-model="adresse1" placeholder="Adresse 1" class="input" />
      <input v-model="adresse2" placeholder="Adresse 2" class="input" />
      <input v-model="codePostal" placeholder="Code postal" class="input" />
      <input v-model="ville" placeholder="Ville" class="input" />
      <input v-model="pays" placeholder="Pays" class="input" />

      <div class="flex gap-4 mt-4">
        <!-- 🔵 Stripe -->
        <button
          @click="checkoutStripe"
          class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Payer avec Stripe
        </button>

        <!-- 🟡 PayPal -->
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
      loading: false,
    };
  },

  computed: {
    ...mapState(["cart", "user"]),
  },

  methods: {
    getAdresse() {
      return `${this.adresse1} ${this.adresse2}, ${this.codePostal} ${this.ville}, ${this.pays}`;
    },

    adresseValide() {
      return (
        this.adresse1 &&
        this.codePostal &&
        this.ville &&
        this.pays
      );
    },

    // 🔵 STRIPE
    async checkoutStripe() {
      try {
        if (!this.adresseValide()) {
          alert("Veuillez remplir l'adresse complète.");
          return;
        }

        this.loading = true;

        const response = await axios.post(
          "https://stripe-backend-production-2ac4.up.railway.app/create-stripe-session",
          {
            items: this.cart,
            email: this.user.email,
            adresseLivraison: this.getAdresse(),
          }
        );

        window.location.href = response.data.url;

      } catch (error) {
        console.error("Erreur Stripe:", error);
        alert("Erreur lors du paiement Stripe.");
      } finally {
        this.loading = false;
      }
    },

    // 🟡 PAYPAL
    async checkoutPaypal() {
      try {
        if (!this.adresseValide()) {
          alert("Veuillez remplir l'adresse complète.");
          return;
        }

        this.loading = true;

        const response = await axios.post(
          "https://stripe-backend-production-2ac4.up.railway.app/create-paypal-order",
          {
            items: this.cart,
          }
        );

        // 🔁 Redirection vers PayPal pour approbation
        window.location.href = response.data.approveUrl;

      } catch (error) {
        console.error("Erreur PayPal:", error);
        alert("Erreur lors du paiement PayPal.");
      } finally {
        this.loading = false;
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
  border-radius: 4px;
}
</style>
