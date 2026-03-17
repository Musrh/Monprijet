<template>
  <div class="p-4 max-w-3xl mx-auto">
    <h2 class="text-xl font-bold mb-4">🛒 Mon Panier</h2>

    <div v-if="cart.length === 0">
      <p class="text-gray-500">Votre panier est vide.</p>
    </div>

    <div v-else>
      <div
        v-for="item in cart"
        :key="item.id + '-' + item.taille + '-' + item.couleur"
        class="flex items-center mb-4 border-b pb-2"
      >
        <img
          :src="item.images?.[0] || item.image || '/placeholder.png'"
          :alt="item.nom"
          class="w-20 h-20 object-cover rounded mr-4"
        />
        <div class="flex-1">
          <h3 class="font-semibold">{{ item.nom }}</h3>
          <p>{{ item.prix }} €</p>
          <p v-if="item.taille">📏 Taille : {{ item.taille }}</p>
          <p v-if="item.couleur">🎨 Couleur : {{ item.couleur }}</p>
          <input
            type="number"
            min="1"
            v-model.number="item.quantity"
            @change="updateQuantity(item)"
            class="border w-20 p-1 mt-1"
          />
        </div>
        <button
          @click="remove(item)"
          class="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded"
        >
          ❌
        </button>
      </div>

      <div class="mt-4">
        <label class="font-semibold block mb-2">Adresse de livraison</label>
        <textarea
          v-model="adresseLivraison"
          placeholder="Votre adresse complète"
          class="border p-2 w-full rounded"
        ></textarea>
      </div>

      <h3 class="text-lg font-bold mt-4">Total : {{ total }} €</h3>

      <div class="mt-4">
        <label class="font-semibold block mb-2">Mode de paiement</label>
        <select v-model="paymentMethod" class="border p-2 rounded w-full">
          <option value="stripe">💳 Carte bancaire (Stripe)</option>
          <option value="paypal">🅿️ PayPal</option>
        </select>
      </div>

      <button
        v-if="paymentMethod === 'stripe'"
        @click="payerStripe"
        class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded mt-4 w-full"
      >
        Payer
      </button>

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
      adresseLivraison: ""
    };
  },
  computed: {
    ...mapState(["cart", "user"]),
    total() {
      return this.cart.reduce((sum, i) => sum + i.prix * i.quantity, 0).toFixed(2);
    }
  },
  watch: {
    paymentMethod(newMethod) {
      if (newMethod === "paypal") {
        this.$nextTick(() => {
          if (!this.user) { alert("Connectez-vous"); this.$router.push("/login"); return; }
          if (!this.adresseLivraison) { alert("Adresse requise"); this.paymentMethod="stripe"; return; }
          this.renderPaypalButton();
        });
      }
    }
  },
  methods: {
    remove(item) {
      this.$store.dispatch("removeItem", { id: item.id, taille: item.taille, couleur: item.couleur });
    },
    updateQuantity(item) {
      this.$store.dispatch("updateQuantity", { id: item.id, taille: item.taille, couleur: item.couleur, quantity: item.quantity });
    },

    async payerStripe() {
      if (!this.user) { alert("Connectez-vous"); this.$router.push("/login"); return; }
      if (!this.adresseLivraison) { alert("Adresse requise"); return; }

      const items = this.cart.map(i => ({
        id: i.id, nom: i.nom, prix: i.prix, quantity: i.quantity,
        taille: i.taille, couleur: i.couleur, image: i.images?.[0] || i.image || "/placeholder.png"
      }));

      const res = await fetch(`${API_BASE}/create-stripe-session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items, email: this.user.email, adresseLivraison: this.adresseLivraison })
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    },

    async loadPaypalScript() {
      return new Promise(resolve => {
        if (window.paypal) return resolve(window.paypal);
        const script = document.createElement("script");
        script.src = "https://www.paypal.com/sdk/js?client-id=AfeH12AsZ1GhWJ0Ig2P2cRp98arFXAdpUDeIOaZ6g3WBFAhEcorGVjcjyBFPKQhlQ0Rw66RqJxMwtD9e&currency=EUR";
        script.onload = () => resolve(window.paypal);
        document.body.appendChild(script);
      });
    },

    async renderPaypalButton() {
      const container = document.getElementById("paypal-button-container");
      container.innerHTML = "";

      const paypalSdk = await this.loadPaypalScript();
      const items = this.cart.map(i => ({ id: i.id, nom: i.nom, prix: i.prix, quantity: i.quantity, taille: i.taille, couleur: i.couleur }));

      paypalSdk.Buttons({
        createOrder: () => fetch(`${API_BASE}/create-paypal-order`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ items, email: this.user.email, adresseLivraison: this.adresseLivraison })
        }).then(res => res.json()).then(order => order.id),

        onApprove: data => fetch(`${API_BASE}/capture-paypal-order`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId: data.orderID, items, user: { email: this.user.email }, adresseLivraison: this.adresseLivraison })
        })
        .then(res => res.json())
        .then(() => { this.$store.dispatch("clearCart"); this.$router.push("/success"); })
      }).render(container);
    }
  }
};
</script>

<style scoped>
img { object-fit: cover; }
textarea { resize: vertical; }
</style>
