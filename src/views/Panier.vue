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
          <p>💰 {{ item.prix }} €</p>
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
          @click="remove(item.id, item.taille, item.couleur)"
          class="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded"
        >
          ❌
        </button>
      </div>

      <!-- Adresse de livraison -->
      <div class="mt-4">
        <label class="font-semibold block mb-2">Adresse de livraison</label>
        <textarea
          v-model="adresseLivraison"
          placeholder="Votre adresse complète"
          class="border p-2 w-full rounded"
        ></textarea>
      </div>

      <!-- TOTAL -->
      <h3 class="text-lg font-bold mt-4">Total : {{ total }} €</h3>

      <!-- Choix paiement -->
      <div class="mt-4">
        <label class="font-semibold block mb-2">Mode de paiement</label>
        <select v-model="paymentMethod" class="border p-2 rounded w-full">
          <option value="stripe">💳 Carte bancaire (Stripe)</option>
          <option value="paypal">🅿️ PayPal</option>
        </select>
      </div>

      <!-- Bouton Payer Stripe -->
      <button
        v-if="paymentMethod === 'stripe'"
        @click="payerStripe"
        class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded mt-4 w-full"
      >
        Payer
      </button>

      <!-- Bouton PayPal -->
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
    remove(id, taille, couleur) {
      this.$store.dispatch("removeItem", { id, taille, couleur });
    },
    updateQuantity(item) {
      this.$store.dispatch("updateQuantity", {
        id: item.id,
        taille: item.taille,
        couleur: item.couleur,
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
        alert("Veuillez saisir une adresse de livraison.");
        return;
      }

      const itemsPourCommande = this.cart.map((p) => ({
        id: p.id,
        nom: p.nom,
        prix: p.prix,
        quantity: p.quantity,
        taille: p.taille,
        couleur: p.couleur,
        image: p.images?.[0] || p.image || "/placeholder.png",
      }));

      try {
        const response = await fetch(
          "https://stripe-backend-production-2ac4.up.railway.app/create-stripe-session",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              items: itemsPourCommande,
              email: this.user.email,
              adresseLivraison: this.adresseLivraison,
            }),
          }
        );
        const data = await response.json();
        if (data.url) window.location.href = data.url;
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

      // Vider le conteneur pour éviter doublons
      const container = document.getElementById("paypal-button-container");
      container.innerHTML = "";

      const itemsPourCommande = this.cart.map((p) => ({
        id: p.id,
        nom: p.nom,
        prix: p.prix,
        quantity: p.quantity,
        taille: p.taille,
        couleur: p.couleur,
      }));

      paypalSdk.Buttons({
        style: { layout: "vertical", color: "blue", shape: "rect", label: "paypal" },

        createOrder: (data, actions) => {
          return fetch(
            "https://stripe-backend-production-2ac4.up.railway.app/create-paypal-order",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                items: itemsPourCommande,
                email: this.user.email,
                adresseLivraison: this.adresseLivraison,
              }),
            }
          )
            .then((res) => res.json())
            .then((order) => order.id);
        },

        onApprove: (data) => {
          return fetch(
            "https://stripe-backend-production-2ac4.up.railway.app/capture-paypal-order",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                orderId: data.orderID,
                items: itemsPourCommande,
                user: { email: this.user.email },
                adresseLivraison: this.adresseLivraison,
              }),
            }
          )
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
textarea {
  resize: vertical;
}
</style>
