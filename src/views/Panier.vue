<template>
  <div class="p-4 max-w-3xl mx-auto">
    <h1 class="text-2xl font-bold mb-4">
      {{ $t("panier.title") }}
    </h1>

    <div v-if="!user">
      <p class="text-red-600 font-semibold">{{ $t("panier.loginRequired") }}</p>
      <button @click="$router.push('/login')" class="bg-black text-white px-4 py-2 mt-3 rounded">
        {{ $t("panier.login") }}
      </button>
    </div>

    <div v-else-if="cart.length">
      <ul class="mb-6">
        <li v-for="item in cart" :key="item.cartId" class="flex justify-between">
          <span>{{ item.nom }} x {{ item.quantity }}</span>
          <span>{{ (item.prix * item.quantity).toFixed(2) }} €</span>
        </li>
      </ul>

      <h2 class="font-semibold mb-2">{{ $t("panier.address") }}</h2>
      <input v-model="adresse1" :placeholder="$t('panier.address1')" class="input" />
      <input v-model="adresse2" :placeholder="$t('panier.address2')" class="input" />
      <input v-model="codePostal" :placeholder="$t('panier.postalCode')" class="input" />
      <input v-model="ville" :placeholder="$t('panier.city')" class="input" />
      <input v-model="pays" :placeholder="$t('panier.country')" class="input" />

      <div class="flex gap-4 mt-4">
        <button @click="checkoutStripe" class="bg-blue-600 text-white px-4 py-2 rounded">
          Stripe
        </button>

        <button @click="checkoutPaypal" class="bg-yellow-500 text-black px-4 py-2 rounded">
          PayPal
        </button>
      </div>
    </div>

    <p v-else>{{ $t("panier.empty") }}</p>
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
    ...mapState(["cart", "user"]),
    currentLang() {
      return this.$store.getters["language/currentLanguage"];
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
        this.$store.dispatch("setPaypalAdresse", this.getAdresse());
        const order = await axios.post(
          "https://paypalbackend-production.up.railway.app/create-paypal-order",
          {
            items: this.cart,
            email: this.user.email,
            adresseLivraison: this.$store.state.paypalAdresseLivraison,
          }
        );
        window.location.href = order.data.url || order.data.approveUrl;
      } catch (err) {
        console.error("Erreur PayPal:", err);
        alert(this.currentLang === "fr" ? "Impossible de créer l'ordre PayPal." : "Unable to create PayPal order.");
      }
    },
  },
};
</script>
