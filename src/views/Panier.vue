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
          :src="item.images?.[0] || item.image || '/placeholder.png'"
          :alt="item.nom"
          class="w-20 h-20 object-cover rounded mr-4"
        />

        <div class="flex-1">
          <h3 class="font-semibold">{{ item.nom }}</h3>
          <p>{{ item.prix }} €</p>
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

      <!-- Total -->
      <h3 class="text-lg font-bold mt-4">Total : {{ total.toFixed(2) }} €</h3>

      <!-- Choix paiement -->
      <div class="mt-4">
        <label class="font-semibold block mb-2">Mode de paiement</label>
        <select v-model="paymentMethod" class="border p-2 rounded w-full">
          <option disabled value="">Choisir paiement</option>
          <option value="stripe">💳 Carte bancaire</option>
          <option value="paypal">🅿️ PayPal</option>
        </select>
      </div>

      <!-- Stripe -->
      <button
        v-if="paymentMethod==='stripe'"
        @click="payerStripe"
        class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded mt-4 w-full"
      >
        💳 Payer avec Stripe
      </button>

      <!-- PayPal -->
      <div id="paypal-button-container" class="mt-4"></div>

    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  data() {
    return { paymentMethod: "" };
  },

  computed: {
    ...mapState(["cart", "user"]),
    total() {
      return this.cart.reduce(
        (sum, item) => sum + (Number(item.prix) || 0) * (Number(item.quantity) || 1),
        0
      );
    }
  },

  watch: {
    paymentMethod(newVal) {
      if (newVal === "paypal") {
        this.$nextTick(() => this.renderPaypal());
      }
    }
  },

  methods: {
    remove(id) { this.$store.dispatch("removeItem", id); },
    updateQuantity(item) { this.$store.dispatch("updateQuantity", { id: item.id, quantity: item.quantity }); },

    async payerStripe() {
      if (!this.user) { alert("Connectez-vous"); this.$router.push("/login"); return; }
      if (!this.cart.length) { alert("Panier vide"); return; }

      const items = this.cart.map(p => ({ id: p.id, nom: p.nom, prix: p.prix, quantity: p.quantity }));
      try {
        const res = await fetch("https://stripe-backend-production-2ac4.up.railway.app/create-checkout-session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ items, email: this.user.email })
        });
        const data = await res.json();
        if (data.url) window.location.href = data.url;
      } catch (err) { console.error(err); alert("Erreur Stripe"); }
    },

    renderPaypal() {
      if (!window.paypal) { console.error("SDK PayPal non chargé"); return; }

      const items = this.cart.map(p => ({ id: p.id, nom: p.nom, prix: p.prix, quantity: p.quantity }));

      const container = document.getElementById("paypal-button-container");
      container.innerHTML = ""; // Supprime anciens boutons si existants

      window.paypal.Buttons({
        createOrder: (data, actions) => {
          return actions.order.create({
            purchase_units: [{ amount: { value: this.total.toFixed(2) } }]
          });
        },
        onApprove: async (data, actions) => {
          const details = await actions.order.capture();
          alert(`Paiement PayPal réussi : ${details.payer.name.given_name}`);

          // Enregistrer commande dans Firestore
          await fetch("https://stripe-backend-production-2ac4.up.railway.app/capture-paypal-order", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ orderId: data.orderID, user: this.user, items })
          });

          this.$store.dispatch("clearCart");
        }
      }).render("#paypal-button-container");
    }
  }
};
</script>

<style scoped>
img { object-fit: cover; }
</style>
