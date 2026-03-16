<template>
  <div class="p-4 max-w-3xl mx-auto">

    <h2 class="text-xl font-bold mb-4">🛒 Mon Panier</h2>

    <!-- Panier vide -->
    <div v-if="cart.length === 0">
      <p class="text-gray-500">Votre panier est vide.</p>
    </div>

    <!-- Panier rempli -->
    <div v-else>

      <!-- PRODUITS -->
      <div
        v-for="item in cart"
        :key="item.id + item.size + item.color"
        class="flex items-center mb-4 border-b pb-2"
      >
        <img
          :src="item.thumbnail || item.image || '/placeholder.png'"
          class="w-20 h-20 object-cover rounded mr-4"
        />

        <div class="flex-1">
          <h3 class="font-semibold">{{ item.nom }}</h3>

          <p v-if="item.size">Taille : {{ item.size }}</p>
          <p v-if="item.color">Couleur : {{ item.color }}</p>

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
          @click="remove(item)"
          class="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded"
        >
          ❌
        </button>
      </div>

      <!-- TOTAL -->
      <h3 class="text-lg font-bold mt-4">
        Total : {{ total }} €
      </h3>

      <!-- ADRESSE LIVRAISON -->
      <div class="mt-6 border p-4 rounded bg-gray-50">
        <h3 class="font-bold mb-2">Adresse de livraison</h3>

        <input v-model="adresse.nom" placeholder="Nom complet"
          class="border p-2 mb-2 w-full rounded" />

        <input v-model="adresse.rue" placeholder="Adresse"
          class="border p-2 mb-2 w-full rounded" />

        <input v-model="adresse.ville" placeholder="Ville"
          class="border p-2 mb-2 w-full rounded" />

        <input v-model="adresse.codePostal" placeholder="Code postal"
          class="border p-2 mb-2 w-full rounded" />

        <input v-model="adresse.pays" placeholder="Pays"
          class="border p-2 w-full rounded" />
      </div>

      <!-- PAIEMENT -->
      <div class="mt-4">
        <label class="font-semibold block mb-2">Mode de paiement</label>

        <select v-model="paymentMethod" class="border p-2 rounded w-full">
          <option value="stripe">💳 Carte bancaire (Stripe)</option>
          <option value="paypal">🅿️ PayPal</option>
        </select>
      </div>

      <!-- STRIPE -->
      <button
        v-if="paymentMethod === 'stripe'"
        @click="payerStripe"
        class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded mt-4 w-full"
      >
        Payer
      </button>

      <!-- PAYPAL -->
      <div v-if="paymentMethod === 'paypal'" class="mt-4">
        <div id="paypal-button-container"></div>
      </div>

    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  data() {
    return {
      paymentMethod: "stripe",
      adresse: {
        nom: "",
        rue: "",
        ville: "",
        codePostal: "",
        pays: ""
      }
    };
  },

  computed: {
    ...mapState(["cart", "user"]),

    total() {
      return this.cart
        .reduce((sum, item) => sum + item.prix * item.quantity, 0)
        .toFixed(2);
    },

    isPrintful() {
      return this.cart.some(p => p.source === "Printful");
    },

    API_BASE() {
      return this.isPrintful
        ? "https://printfulapi-production.up.railway.app"
        : "https://stripe-backend-production-2ac4.up.railway.app";
    }
  },

  watch: {
    paymentMethod(newVal) {
      if (newVal === "paypal") {
        this.$nextTick(() => {
          this.renderPaypalButton();
        });
      }
    }
  },

  methods: {
    remove(item) {
      this.$store.dispatch("removeItem", item);
    },

    updateQuantity(item) {
      this.$store.dispatch("updateQuantity", item);
    },

    validateAdresse() {
      return (
        this.adresse.nom &&
        this.adresse.rue &&
        this.adresse.ville &&
        this.adresse.codePostal &&
        this.adresse.pays
      );
    },

    // ---------------- STRIPE ----------------
    async payerStripe() {
      if (!this.user) {
        alert("Veuillez vous connecter");
        return;
      }

      if (!this.validateAdresse()) {
        alert("Veuillez remplir l'adresse de livraison");
        return;
      }

      const response = await fetch(
        `${this.API_BASE}/create-stripe-session`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            items: this.cart,
            email: this.user.email,
            adresseLivraison: this.adresse
          })
        }
      );

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      }
    },

    // ---------------- PAYPAL ----------------
    async loadPaypalScript() {
      return new Promise((resolve, reject) => {
        if (window.paypal) return resolve(window.paypal);

        const script = document.createElement("script");
        script.src =
          `https://www.paypal.com/sdk/js?client-id=${import.meta.env.VITE_PAYPAL_CLIENT_ID}&currency=EUR`;
        script.onload = () => resolve(window.paypal);
        script.onerror = reject;
        document.body.appendChild(script);
      });
    },

    async renderPaypalButton() {
      if (!this.user || !this.cart.length) return;

      if (!this.validateAdresse()) {
        alert("Veuillez remplir l'adresse avant paiement");
        return;
      }

      const paypalSdk = await this.loadPaypalScript();

      document.getElementById("paypal-button-container").innerHTML = "";

      paypalSdk.Buttons({

        createOrder: async () => {
          const res = await fetch(
            `${this.API_BASE}/create-paypal-order`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ items: this.cart })
            }
          );
          const data = await res.json();
          return data.id;
        },

        onApprove: async (data) => {
          await fetch(
            `${this.API_BASE}/capture-paypal-order`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                orderId: data.orderID,
                user: { email: this.user.email },
                items: this.cart,
                adresseLivraison: this.adresse
              })
            }
          );

          this.$store.dispatch("clearCart");
          this.$router.push("/success");
        },

        onError: (err) => {
          console.error("PayPal error:", err);
          alert("Erreur PayPal");
        }

      }).render("#paypal-button-container");
    }
  }
};
</script>

<style scoped>
img {
  object-fit: cover;
}
</style>
