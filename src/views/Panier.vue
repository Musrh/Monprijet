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
      <h3 class="text-lg font-bold mt-4">Total : {{ total }} €</h3>

      <!-- Choix du paiement -->
      <div class="mt-4">
        <label class="font-semibold block mb-2">Mode de paiement</label>
        <select v-model="paymentMethod" class="border p-2 rounded w-full">
          <option value="stripe">💳 Carte bancaire</option>
          <option value="paypal">🅿️ PayPal</option>
        </select>
      </div>

      <!-- Bouton Stripe -->
      <button
        v-if="paymentMethod === 'stripe'"
        @click="payerStripe"
        class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded mt-4 w-full"
      >
        💳 Payer avec Stripe
      </button>

      <!-- Conteneur PayPal -->
      <div v-if="paymentMethod === 'paypal'" id="paypal-button-container" class="mt-4"></div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    cart: { type: Array, required: true },
    userEmail: { type: String, required: true }
  },
  data() {
    return {
      paymentMethod: "stripe"
    };
  },
  computed: {
    total() {
      return this.cart.reduce((sum, item) => sum + item.prix * item.quantity, 0).toFixed(2);
    }
  },
  watch: {
    // Lorsque l'utilisateur choisit PayPal, on affiche les boutons
    paymentMethod(newMethod) {
      if (newMethod === "paypal") {
        this.renderPaypalButton();
      }
    }
  },
  methods: {
    remove(id) {
      this.$emit("remove-item", id);
    },
    updateQuantity(item) {
      this.$emit("update-quantity", item);
    },

    // Stripe
    async payerStripe() {
      try {
        const response = await fetch(
          "https://stripe-backend-production-2ac4.up.railway.app/create-stripe-session",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ items: this.cart, email: this.userEmail })
          }
        );
        const data = await response.json();
        if (data.url) window.location.href = data.url;
      } catch (err) {
        console.error("Erreur Stripe:", err);
        alert("Erreur Stripe : " + err.message);
      }
    },

    // PayPal
    renderPaypalButton() {
      if (!window.paypal) {
        console.error("Le SDK PayPal n'est pas chargé !");
        return;
      }

      // Supprime les boutons précédents si présents
      const container = document.getElementById("paypal-button-container");
      container.innerHTML = "";

      window.paypal.Buttons({
        createOrder: (data, actions) => {
          return actions.order.create({
            purchase_units: [{
              amount: { value: this.total },
              description: "Panier Mon Projet"
            }]
          });
        },
        onApprove: async (data, actions) => {
          const capture = await actions.order.capture();
          alert("Paiement PayPal réussi ! Montant : " + capture.purchase_units[0].payments.captures[0].amount.value + " €");
          // Ici tu peux appeler ton backend pour enregistrer la commande dans Firestore
        },
        onError: (err) => {
          console.error("Erreur PayPal :", err);
          alert("Erreur PayPal : " + err);
        }
      }).render("#paypal-button-container");
    }
  }
};
</script>

<style scoped>
img { object-fit: cover; }
</style>
