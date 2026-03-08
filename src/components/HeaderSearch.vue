<template>
  <header class="bg-white border-b shadow-md relative z-20">

    <!-- Logo + Panier -->
    <div class="flex items-center justify-between px-4 py-3 max-w-7xl mx-auto">
      <div class="flex items-center gap-3">
        <img src="../assets/hero.png" alt="logo" class="h-10" />
        <span class="font-bold text-lg">EasyShoping</span>
      </div>

      <!-- Mini-panier -->
      <div class="relative">
        <button @click="toggleCartDropdown" class="flex items-center gap-2 text-purple-700 font-semibold">
          🛒
          <span>Mon Panier</span>
          <span v-if="cartItemCount > 0" class="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
            {{ cartItemCount }}
          </span>
        </button>

        <!-- Dropdown panier -->
        <div
          v-if="cartDropdownOpen"
          class="absolute right-0 mt-2 w-80 bg-white border rounded-xl shadow-lg p-4 z-50"
        >
          <!-- Panier vide -->
          <div v-if="cartItemCount === 0" class="text-gray-500">Votre panier est vide.</div>

          <!-- Panier rempli -->
          <div v-else>
            <div
              v-for="item in cartItems"
              :key="item.id"
              class="flex items-center mb-2 border-b pb-2"
            >
              <img
                :src="item.images?.[0] || item.image || '/placeholder.png'"
                :alt="item.nom"
                class="w-12 h-12 object-cover rounded mr-2"
              />
              <div class="flex-1">
                <h3 class="font-semibold">{{ item.nom }}</h3>
                <p>{{ item.prix }} €</p>
                <input
                  type="number"
                  min="1"
                  v-model.number="item.quantity"
                  @change="updateQuantity(item)"
                  class="border w-16 p-1 mt-1"
                />
              </div>
              <button
                @click="remove(item.id)"
                class="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded"
              >❌</button>
            </div>

            <!-- Total -->
            <h3 class="text-lg font-bold mt-2">Total : {{ total }} €</h3>

            <!-- Choix paiement -->
            <div class="mt-2">
              <select v-model="paymentMethod" class="border p-2 rounded w-full">
                <option value="stripe">💳 Carte bancaire (Stripe)</option>
                <option value="paypal">🅿️ PayPal</option>
              </select>
            </div>

            <!-- Bouton Stripe -->
            <button
              v-if="paymentMethod === 'stripe'"
              @click="payerStripe"
              class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded mt-2 w-full"
            >💳 Payer avec Stripe</button>

            <!-- Conteneur PayPal -->
            <div v-if="paymentMethod === 'paypal'" class="mt-2">
              <div id="paypal-button-container"></div>
            </div>

          </div>
        </div>
      </div>
    </div>

    <!-- Barre de recherche -->
    <div class="bg-gray-100 py-3">
      <div class="max-w-7xl mx-auto flex flex-wrap md:flex-nowrap items-center gap-2 px-4">

        <!-- Catégories -->
        <select v-model="categorie" @change="filterCategorie" class="border rounded px-3 py-2 bg-white flex-shrink-0">
          <option value="">Toutes catégories</option>
          <option value="phones">Téléphones</option>
          <option value="pc">PC</option>
          <option value="accessoires">Accessoires</option>
        </select>

        <!-- Champ de recherche -->
        <input
          v-model="search"
          type="text"
          placeholder="Vous cherchez quoi ?..."
          class="flex-1 min-w-0 border rounded px-3 py-2"
        />

        <!-- Bouton recherche -->
        <button @click="rechercher" class="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 flex-shrink-0">
          🔍
        </button>

        <!-- ThemeSwitcher -->
        <div class="ml-2 flex-shrink-0">
          <ThemeSwitcher />
        </div>

      </div>
    </div>

  </header>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import { useRouter } from "vue-router";
import ThemeSwitcher from './ThemeSwitcher.vue';

export default {
  name: "HeaderSearch",
  components: { ThemeSwitcher },
  data() {
    return {
      search: "",
      categorie: "",
      cartDropdownOpen: false,
      paymentMethod: "stripe"
    };
  },
  computed: {
    ...mapGetters(["cartItemCount"]),
    ...mapState(["cart", "user"]),
    cartItems() { return this.cart; },
    total() { return this.cart.reduce((sum, i) => sum + i.prix * i.quantity, 0); }
  },
  setup() { const router = useRouter(); return { router }; },
  watch: {
    paymentMethod(newMethod) {
      if (newMethod === "paypal" && this.cartDropdownOpen) {
        this.$nextTick(() => this.renderPaypalButton());
      }
    }
  },
  methods: {
    toggleCartDropdown() {
      this.cartDropdownOpen = !this.cartDropdownOpen;
      if (this.cartDropdownOpen && this.paymentMethod === "paypal") {
        this.$nextTick(() => {
          const container = document.getElementById("paypal-button-container");
          if(container) container.innerHTML = "";
          this.renderPaypalButton();
        });
      }
    },
    remove(id) { this.$store.dispatch("removeItem", id); },
    updateQuantity(item) { this.$store.dispatch("updateQuantity", { id: item.id, quantity: item.quantity }); },

    // STRIPE
    async payerStripe() {
      if (!this.user) return alert("Connectez-vous d'abord");
      if (!this.cart.length) return alert("Panier vide");

      const items = this.cart.map(i => ({ id: i.id, nom: i.nom, prix: i.prix, quantity: i.quantity }));
      try {
        const res = await fetch("https://stripe-backend-production-2ac4.up.railway.app/create-stripe-session", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ items, email: this.user.email })
        });
        const data = await res.json();
        if(data.url) window.location.href = data.url;
      } catch(err){ console.error(err); alert("Erreur Stripe : "+err.message); }
    },

    // PAYPAL
    async loadPaypalScript() {
      return new Promise((resolve, reject) => {
        if(window.paypal) return resolve(window.paypal);
        const script = document.createElement("script");
        script.src = "https://www.paypal.com/sdk/js?client-id=AfeH12AsZ1GhWJ0Ig2P2cRp98arFXAdpUDeIOaZ6g3WBFAhEcorGVjcjyBFPKQhlQ0Rw66RqJxMwtD9e&currency=EUR";
        script.onload = () => resolve(window.paypal);
        script.onerror = reject;
        document.body.appendChild(script);
      });
    },
    async renderPaypalButton() {
      if(!this.cart.length || !this.user) return;

      const paypalSdk = await this.loadPaypalScript();
      const items = this.cart.map(i => ({ id: i.id, nom: i.nom, prix: i.prix, quantity: i.quantity }));

      paypalSdk.Buttons({
        createOrder: (data, actions) => {
          return fetch("https://stripe-backend-production-2ac4.up.railway.app/create-paypal-order", {
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body: JSON.stringify({ items, email: this.user.email })
          })
          .then(res => res.json())
          .then(order => order.id);
        },
        onApprove: (data) => {
          return fetch("https://stripe-backend-production-2ac4.up.railway.app/capture-paypal-order", {
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body: JSON.stringify({ orderId: data.orderID, items, user: { email: this.user.email } })
          })
          .then(res => res.json())
          .then(()=> { alert("Paiement PayPal réussi !"); this.$store.dispatch("clearCart"); });
        },
        onError: (err) => { console.error("PayPal error:", err); alert("Erreur PayPal : "+err.message); }
      }).render("#paypal-button-container");
    },

    // Recherche
    rechercher() { this.router.push({ path:"/", query:{ search:this.search } }); },
    filterCategorie() { this.router.push({ path:"/", query:{ categorie:this.categorie, search:this.search } }); }
  }
};
</script>

<style scoped>
input { min-width: 0; }
.flex-shrink-0 { flex-shrink: 0; }
</style>
