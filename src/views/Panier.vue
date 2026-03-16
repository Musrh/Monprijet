<template>
  <div class="p-4 max-w-3xl mx-auto">
    <h2 class="text-xl font-bold mb-4">🛒 Mon Panier</h2>

    <!-- Panier vide -->
    <div v-if="cart.length === 0">
      <p class="text-gray-500">Votre panier est vide.</p>
    </div>

    <!-- Panier rempli -->
    <div v-else>
      <div
        v-for="item in cart"
        :key="item.id"
        class="flex items-center mb-4 border-b pb-2"
      >
        <img
          :src="item.image || '/placeholder.png'"
          :alt="item.nom"
          class="w-20 h-20 object-cover rounded mr-4"
        />
        <div class="flex-1">
          <h3 class="font-semibold">{{ item.nom }}</h3>
          <p>{{ item.prix }} €</p>
          <p v-if="item.size">Taille : {{ item.size }}</p>
          <p v-if="item.color">Couleur : {{ item.color }}</p>
          <input
            type="number"
            min="1"
            v-model.number="item.quantity"
            @change="updateQuantity(item)"
            class="border w-20 p-1 mt-1"
          />
        </div>
        <button
          @click="remove(item.id)"
          class="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded"
        >
          ❌
        </button>
      </div>

      <!-- TOTAL -->
      <h3 class="text-lg font-bold mt-4">Total : {{ total }} €</h3>

      <!-- Adresse de livraison -->
      <div class="mt-4">
        <label class="font-semibold block mb-2">Adresse de livraison</label>
        <textarea
          v-model="adresseLivraison"
          placeholder="Entrez votre adresse complète"
          class="border p-2 rounded w-full"
        ></textarea>
      </div>

      <!-- Choix paiement -->
      <div class="mt-4">
        <label class="font-semibold block mb-2">Mode de paiement</label>
        <select v-model="paymentMethod" class="border p-2 rounded w-full">
          <option value="stripe">💳 Carte bancaire (Stripe)</option>
          <option value="paypal">🅿️ PayPal</option>
        </select>
      </div>

      <!-- Bouton Stripe -->
      <button
        v-if="paymentMethod === 'stripe'"
        @click="payerStripe"
        class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded mt-4 w-full"
      >
        Payer
      </button>

      <!-- Conteneur PayPal -->
      <div v-if="paymentMethod === 'paypal'" class="mt-4">
        <div id="paypal-button-container"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

const API_BASE = "https://printfulapi-production.up.railway.app";

export default {
  data() {
    return {
      paymentMethod: "stripe",
      adresseLivraison: "",
    };
  },
  computed: {
    ...mapState(["cart", "user"]),
    total() {
      return this.cart
        .reduce((sum, item) => sum + item.prix * item.quantity, 0)
        .toFixed(2);
    },
  },
  watch: {
    paymentMethod(newMethod) {
      if (newMethod === "paypal") {
        this.$nextTick(() => {
          if (!this.user) {
            alert("Veuillez vous connecter avant de payer");
            this.$router.push("/login");
            return;
          }
          this.renderPaypalButton();
        });
      }
    },
  },
  methods: {
    remove(id) {
      this.$store.dispatch("removeItem", id);
    },
    updateQuantity(item) {
      this.$store.dispatch("updateQuantity", {
        id: item.id,
        quantity: item.quantity,
      });
    },

    // ---------------- STRIPE ----------------
    async payerStripe() {
      if (!this.user) {
        alert("Veuillez vous connecter avant de payer");
        this.$router.push("/login");
        return;
      }
      if (!this.cart.length) {
        alert("Panier vide");
        return;
      }
      if (!this.adresseLivraison) {
        alert("Veuillez entrer votre adresse de livraison");
        return;
      }

      const itemsPourCommande = this.cart.map((i) => ({
        id: i.id,
        nom: i.nom,
        prix: i.prix,
        quantity: i.quantity,
        image: i.image,
        size: i.size,
        color: i.color,
      }));

      try {
        const response = await fetch(`${API_BASE}/create-stripe-session`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            items: itemsPourCommande,
            email: this.user.email,
            adresseLivraison: this.adresseLivraison,
          }),
        });
        const data = await response.json();
        if (data.url) {
          window.location.href = data.url;
        }
      } catch (err) {
        console.error("Stripe error:", err);
        alert("Erreur lors du paiement Stripe : " + err.message);
      }
    },

    // ---------------- PAYPAL ----------------
    async loadPaypalScript() {
      return new Promise((resolve, reject) => {
        if (window.paypal) return resolve(window.paypal);
        const script = document.createElement("script");
        script.src = `https://www.paypal.com/sdk/js?client-id=${import.meta.env.VITE_PAYPAL_CLIENT_ID}&currency=EUR`;
        script.onload = () => resolve(window.paypal);
        script.onerror = reject;
        document.body.appendChild(script);
      });
    },

    async renderPaypalButton() {
      if (!this.cart.length || !this.user || !this.adresseLivraison) return;

      const paypalSdk = await this.loadPaypalScript();

      const itemsPourCommande = this.cart.map((i) => ({
        id: i.id,
        nom: i.nom,
        prix: i.prix,
        quantity: i.quantity,
        size: i.size,
        color: i.color,
      }));

      paypalSdk.Buttons({
        createOrder: () => {
          return fetch(`${API_BASE}/create-paypal-order`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              items: itemsPourCommande,
              email: this.user.email,
            }),
          })
            .then((res) => res.json())
            .then((order) => order.id);
        },
        onApprove: (data) => {
          return fetch(`${API_BASE}/capture-paypal-order`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              orderId: data.orderID,
              user: { email: this.user.email },
              items: itemsPourCommande,
              adresseLivraison: this.adresseLivraison,
            }),
          })
            .then((res) => res.json())
            .then(() => {
              this.$store.dispatch("clearCart");
              this.$router.push("/success");
            });
        },
        onError: (err) => {
          console.error("Erreur PayPal:", err);
          alert("Erreur PayPal : " + err.message);
        },
      }).render("#paypal-button-container");
    },
  },
};
</script>

<style scoped>
img {
  object-fit: cover;
}
</style>
