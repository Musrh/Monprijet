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

      <!-- Adresse de livraison -->
      <div class="mt-4 grid grid-cols-1 gap-2">
        <label class="font-semibold">Adresse 1</label>
        <input v-model="adresse1" class="border p-2 rounded w-full" />

        <label class="font-semibold">Adresse 2</label>
        <input v-model="adresse2" class="border p-2 rounded w-full" />

        <label class="font-semibold">Code postal</label>
        <input v-model="codePostal" class="border p-2 rounded w-full" />

        <label class="font-semibold">Ville</label>
        <input v-model="ville" class="border p-2 rounded w-full" />

        <label class="font-semibold">Pays</label>
        <input v-model="pays" class="border p-2 rounded w-full" />
      </div>

      <!-- Total -->
      <h3 class="text-lg font-bold mt-4">Total : {{ total }} €</h3>

      <!-- Liste boutons paiement -->
      <div class="mt-4 space-y-2">
        <!-- Stripe -->
        <button
          @click="payerStripe"
          class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded w-full"
        >
          💳 Payer avec Stripe
        </button>

        <!-- PayPal -->
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
      adresse1: "",
      adresse2: "",
      codePostal: "",
      ville: "",
      pays: ""
    };
  },

  computed: {
    ...mapState(["cart", "user"]),
    total() {
      return this.cart
        .reduce((sum, item) => sum + item.prix * item.quantity, 0)
        .toFixed(2);
    },
    adresseLivraison() {
      return `${this.adresse1}, ${this.adresse2}, ${this.codePostal} ${this.ville}, ${this.pays}`;
    }
  },

  watch: {
    cart: {
      immediate: true,
      handler() {
        this.$nextTick(() => {
          this.renderPaypalButton();
        });
      }
    }
  },

  methods: {
    remove(item) {
      this.$store.dispatch("removeItem", {
        id: item.id,
        taille: item.taille,
        couleur: item.couleur
      });
    },

    updateQuantity(item) {
      this.$store.dispatch("updateQuantity", {
        id: item.id,
        taille: item.taille,
        couleur: item.couleur,
        quantity: item.quantity
      });
    },

    async payerStripe() {
      if (!this.user) return alert("Connectez-vous pour payer.");
      if (!this.adresse1 || !this.codePostal || !this.ville || !this.pays)
        return alert("Veuillez remplir votre adresse complète.");

      const itemsCommande = this.cart.map(p => ({
        id: p.id,
        nom: p.nom,
        prix: p.prix,
        quantity: p.quantity,
        taille: p.taille,
        couleur: p.couleur,
        image: p.images?.[0] || p.image || "/placeholder.png"
      }));

      try {
        const res = await fetch(
          "https://stripe-backend-production-2ac4.up.railway.app/create-stripe-session",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              items: itemsCommande,
              email: this.user.email,
              adresseLivraison: this.adresseLivraison
            })
          }
        );
        const data = await res.json();
        if (data.url) window.location.href = data.url;
      } catch (err) {
        console.error(err);
        alert("Erreur Stripe.");
      }
    },

    async loadPaypalScript() {
      if (window.paypal) return window.paypal;
      return new Promise(resolve => {
        const script = document.createElement("script");
        script.src =
          "https://www.paypal.com/sdk/js?client-id=YOUR_PAYPAL_CLIENT_ID&currency=EUR";
        script.onload = () => resolve(window.paypal);
        document.body.appendChild(script);
      });
    },

    async renderPaypalButton() {
      if (!this.user || !this.cart.length) return;
      const paypalSdk = await this.loadPaypalScript();
      const container = document.getElementById("paypal-button-container");
      if (!container) return;
      container.innerHTML = "";

      const itemsCommande = this.cart.map(p => ({
        id: p.id,
        nom: p.nom,
        prix: p.prix,
        quantity: p.quantity,
        taille: p.taille,
        couleur: p.couleur
      }));

      paypalSdk.Buttons({
        createOrder: () =>
          fetch(
            "https://stripe-backend-production-2ac4.up.railway.app/create-paypal-order",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                items: itemsCommande,
                email: this.user.email,
                adresseLivraison: this.adresseLivraison
              })
            }
          )
            .then(res => res.json())
            .then(order => order.id),

        onApprove: data =>
          fetch(
            "https://stripe-backend-production-2ac4.up.railway.app/capture-paypal-order",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                orderId: data.orderID,
                email: this.user.email,
                adresseLivraison: this.adresseLivraison,
                items: itemsCommande
              })
            }
          )
            .then(res => res.json())
            .then(() => {
              this.$store.dispatch("clearCart");
              this.$router.push("/success");
            })
      }).render(container);
    }
  }
};
</script>

<style scoped>
img {
  object-fit: cover;
}
input {
  width: 100%;
}
</style>
