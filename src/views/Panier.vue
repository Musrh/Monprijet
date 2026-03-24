<template>
  <div class="p-4 max-w-3xl mx-auto">
    <h1 class="text-2xl font-bold mb-4">{{ titles.cart }}</h1>

    <!-- Utilisateur non connecté -->
    <div v-if="!user">
      <p class="text-red-600 font-semibold">{{ titles.mustLogin }}</p>
      <button @click="$router.push('/login')" class="bg-black text-white px-4 py-2 mt-3 rounded">
        {{ titles.login }}
      </button>
    </div>

    <!-- Panier avec items -->
    <div v-else-if="cart.length">
      <ul class="mb-6">
        <li v-for="item in cart" :key="item.id" class="flex justify-between">
          <span>{{ item.nom }} x {{ item.quantity }}</span>
          <span>{{ (item.prix * item.quantity).toFixed(2) }} €</span>
        </li>
      </ul>

      <h2 class="font-semibold mb-2">{{ titles.address }}</h2>
      <input v-model="adresse1" :placeholder="titles.address1" class="input" />
      <input v-model="adresse2" :placeholder="titles.address2" class="input" />
      <input v-model="codePostal" :placeholder="titles.postalCode" class="input" />
      <input v-model="ville" :placeholder="titles.city" class="input" />
      <input v-model="pays" :placeholder="titles.country" class="input" />

      <div class="flex gap-4 mt-4">
        <button @click="checkoutStripe" class="bg-blue-600 text-white px-4 py-2 rounded">
          {{ titles.stripe }}
        </button>

        <button @click="checkoutPaypal" class="bg-yellow-500 text-black px-4 py-2 rounded">
          {{ titles.paypal }}
        </button>
      </div>
    </div>

    <!-- Panier vide -->
    <p v-else>{{ titles.cartEmpty }}</p>
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

    // 🔹 Langue courante
    currentLang() {
      return this.$store.getters["language/currentLanguage"] || "fr";
    },

    // 🔹 Titres et labels selon la langue
    titles() {
      const translations = {
        fr: {
          cart: "Votre Panier",
          mustLogin: "Vous devez être connecté pour payer.",
          login: "Se connecter",
          address: "Adresse",
          address1: "Adresse 1",
          address2: "Adresse 2",
          postalCode: "Code postal",
          city: "Ville",
          country: "Pays",
          stripe: "Stripe",
          paypal: "PayPal",
          cartEmpty: "Votre panier est vide."
        },
        en: {
          cart: "Your Cart",
          mustLogin: "You must be logged in to pay.",
          login: "Login",
          address: "Address",
          address1: "Address 1",
          address2: "Address 2",
          postalCode: "Postal Code",
          city: "City",
          country: "Country",
          stripe: "Stripe",
          paypal: "PayPal",
          cartEmpty: "Your cart is empty."
        }
      };
      return translations[this.currentLang] || translations.fr;
    }
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
        console.error("Erreur Stripe:", err);
        alert(this.currentLang === "fr" ? "Impossible de créer la session Stripe." : "Unable to create Stripe session.");
      }
    },

    async checkoutPaypal() {
      try {
        localStorage.setItem("adresseLivraison", this.getAdresse());

        const order = await axios.post(
          "https://paypalbackend-production.up.railway.app/create-paypal-order",
          {
            items: this.cart,
            email: this.user.email,
            adresseLivraison: this.getAdresse(),
          }
        );

        window.location.href = order.data.approveUrl || order.data.url;
      } catch (err) {
        console.error("Erreur PayPal:", err);
        alert(this.currentLang === "fr" ? "Impossible de créer l'ordre PayPal." : "Unable to create PayPal order.");
      }
    },
  }
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
