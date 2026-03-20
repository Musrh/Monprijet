<template>
  <div class="p-4 max-w-3xl mx-auto">
    <h2 class="text-xl font-bold mb-4">🛒 Mon Panier</h2>

    <div v-if="cart.length === 0">
      <p class="text-gray-500">Votre panier est vide.</p>
    </div>

    <div v-else>
      <!-- Liste des produits -->
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

      <!-- Adresse -->
      <div class="mt-4">
        <label class="font-semibold block mb-1">Adresse 1</label>
        <input v-model="address1" type="text" class="border p-2 w-full rounded mb-2" />

        <label class="font-semibold block mb-1">Adresse 2</label>
        <input v-model="address2" type="text" class="border p-2 w-full rounded mb-2" />

        <label class="font-semibold block mb-1">Ville</label>
        <input v-model="ville" type="text" class="border p-2 w-full rounded mb-2" />

        <label class="font-semibold block mb-1">Code Postal</label>
        <input v-model="codePostal" type="text" class="border p-2 w-full rounded mb-2" />

        <label class="font-semibold block mb-1">Pays</label>
        <input v-model="pays" type="text" class="border p-2 w-full mb-4 rounded" />
      </div>

      <!-- Total -->
      <h3 class="text-lg font-bold mt-4">Total : {{ total }} €</h3>

      <!-- Choix paiement -->
      <div class="mt-4">
        <label class="font-semibold block mb-2">Mode de paiement</label>
        <select v-model="paymentMethod" class="border p-2 rounded w-full">
          <option value="stripe">💳 Carte bancaire (Stripe)</option>
          <option value="paypal">🅿️ PayPal</option>
        </select>
      </div>

      <!-- Stripe -->
      <button
        v-if="paymentMethod === 'stripe'"
        @click="payerStripe"
        class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded mt-4 w-full"
      >
        Payer avec Stripe
      </button>

      <!-- PayPal -->
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
      address1: "",
      address2: "",
      ville: "",
      codePostal: "",
      pays: "",
    };
  },
  computed: {
    ...mapState(["cart", "user"]),
    total() {
      return this.cart.reduce((sum, item) => sum + item.prix * item.quantity, 0).toFixed(2);
    },
  },
  watch: {
    paymentMethod(newMethod) {
      if (newMethod === "paypal") {
        this.$nextTick(() => this.renderPaypalButton());
      }
    },
  },
  methods: {
    remove(item) {
      this.$store.dispatch("removeItem", {
        id: item.id,
        taille: item.taille,
        couleur: item.couleur,
      });
    },
    updateQuantity(item) {
      this.$store.dispatch("updateQuantity", {
        id: item.id,
        taille: item.taille,
        couleur: item.couleur,
        quantity: item.quantity,
      });
    },

    async payerStripe() {
      if (!this.user) {
        alert("Veuillez vous connecter");
        this.$router.push("/login");
        return;
      }
      if (!this.address1 || !this.ville || !this.pays) {
        alert("Veuillez remplir votre adresse");
        return;
      }

      const itemsForServer = this.cart.map((i) => ({
        id: i.id,
        nom: i.nom,
        prix: i.prix,
        quantity: i.quantity,
        taille: i.taille,
        couleur: i.couleur,
      }));

      const response = await fetch(
        "https://stripe-backend-production-2ac4.up.railway.app/create-stripe-session",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            items: itemsForServer,
            email: this.user.email,
            adresseLivraison: {
              address1: this.address1,
              address2: this.address2,
              ville: this.ville,
              codePostal: this.codePostal,
              pays: this.pays,
            },
          }),
        }
      );
      const data = await response.json();
      if (data.url) window.location.href = data.url;
    },

    async loadPaypalScript() {
      return new Promise((resolve) => {
        if (window.paypal) return resolve(window.paypal);

        const script = document.createElement("script");
        script.src =
          "https://www.paypal.com/sdk/js?client-id=YOUR_SANDBOX_CLIENT_ID&currency=EUR";
        script.onload = () => resolve(window.paypal);
        document.body.appendChild(script);
      });
    },

    async renderPaypalButton() {
      if (!this.user) {
        alert("Veuillez vous connecter pour payer avec PayPal");
        return;
      }
      if (!this.address1 || !this.ville || !this.pays) {
        alert("Veuillez remplir votre adresse");
        return;
      }

      const paypalSdk = await this.loadPaypalScript();
      const itemsForServer = this.cart.map((i) => ({
        id: i.id,
        nom: i.nom,
        prix: i.prix,
        quantity: i.quantity,
        taille: i.taille,
        couleur: i.couleur,
      }));

      paypalSdk.Buttons({
        createOrder: () => {
          return fetch(
            "https://stripe-backend-production-2ac4.up.railway.app/create-paypal-order",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                items: itemsForServer,
                email: this.user.email,
                adresseLivraison: {
                  address1: this.address1,
                  address2: this.address2,
                  ville: this.ville,
                  codePostal: this.codePostal,
                  pays: this.pays,
                },
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
                items: itemsForServer,
                user: { email: this.user.email },
                adresseLivraison: {
                  address1: this.address1,
                  address2: this.address2,
                  ville: this.ville,
                  codePostal: this.codePostal,
                  pays: this.pays,
                },
              }),
            }
          ).then(() => {
            this.$store.dispatch("clearCart");
            this.$router.push("/success");
          });
        },
      }).render("#paypal-button-container");
    },
  },
};
</script>

<style scoped>
input,
textarea,
select {
  resize: vertical;
}
img {
  object-fit: cover;
}
</style>
