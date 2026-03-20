<template>
  <div class="p-4 max-w-3xl mx-auto">
    <h2 class="text-xl font-bold mb-4">🛒 Mon Panier</h2>

    <div v-if="cart.length === 0">
      <p class="text-gray-500">Votre panier est vide.</p>
    </div>

    <div v-else>
      <!-- PRODUITS -->
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

      <!-- ADRESSE -->
      <div class="mt-4 space-y-2">
        <h3 class="font-semibold">Adresse de livraison</h3>

        <input v-model="address1" placeholder="Adresse 1" class="border p-2 w-full rounded" />
        <input v-model="address2" placeholder="Adresse 2" class="border p-2 w-full rounded" />
        <input v-model="ville" placeholder="Ville" class="border p-2 w-full rounded" />
        <input v-model="codePostal" placeholder="Code Postal" class="border p-2 w-full rounded" />
        <input v-model="pays" placeholder="Pays" class="border p-2 w-full rounded" />
      </div>

      <!-- TOTAL -->
      <h3 class="text-lg font-bold mt-4">
        Total : {{ total }} €
      </h3>

      <!-- MODE PAIEMENT -->
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
      return this.cart
        .reduce((sum, item) => sum + item.prix * item.quantity, 0)
        .toFixed(2);
    },
  },

  watch: {
    paymentMethod(newVal) {
      if (newVal === "paypal") {
        this.$nextTick(() => {
          if (!this.validateAdresse()) {
            this.paymentMethod = "stripe";
            return;
          }
          this.renderPaypalButton();
        });
      }
    },
  },

  methods: {
    validateAdresse() {
      if (!this.user) {
        alert("Veuillez vous connecter.");
        this.$router.push("/login");
        return false;
      }

      if (!this.address1 || !this.ville || !this.codePostal || !this.pays) {
        alert("Veuillez remplir tous les champs d'adresse.");
        return false;
      }

      return true;
    },

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
      if (!this.validateAdresse()) return;

      const itemsPourCommande = this.cart.map((p) => ({
        id: p.id,
        nom: p.nom,
        prix: p.prix,
        quantity: p.quantity,
        taille: p.taille,
        couleur: p.couleur,
      }));

      const response = await fetch(
        "https://stripe-backend-production-2ac4.up.railway.app/create-stripe-session",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            items: itemsPourCommande,
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
      return new Promise((resolve, reject) => {
        if (window.paypal) return resolve(window.paypal);

        const script = document.createElement("script");
        script.src =
          "https://www.paypal.com/sdk/js?client-id=TON_CLIENT_ID_PAYPAL&currency=EUR";
        script.async = true;

        script.onload = () => resolve(window.paypal);
        script.onerror = () => reject("Erreur chargement PayPal");

        document.body.appendChild(script);
      });
    },

    async renderPaypalButton() {
      const container = document.getElementById("paypal-button-container");
      container.innerHTML = "";

      const paypalSdk = await this.loadPaypalScript();

      const itemsPourCommande = this.cart.map((p) => ({
        id: p.id,
        nom: p.nom,
        prix: p.prix,
        quantity: p.quantity,
        taille: p.taille,
        couleur: p.couleur,
      }));

      paypalSdk
        .Buttons({
          createOrder: () => {
            return fetch(
              "https://stripe-backend-production-2ac4.up.railway.app/create-paypal-order",
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  items: itemsPourCommande,
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
              .then(() => {
                this.$store.dispatch("clearCart");
                this.$router.push("/success");
              });
          },
        })
        .render(container);
    },
  },
};
</script>

<style scoped>
img {
  object-fit: cover;
}
</style>
