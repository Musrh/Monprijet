<template>
  <header class="bg-white border-b shadow-md relative z-20">

    <!-- Logo + Panier -->
    <div class="flex items-center justify-between px-4 py-3 max-w-7xl mx-auto">
      <div class="flex items-center gap-3">
        <img src="../assets/hero.png" alt="logo" class="h-10" />
        <span class="font-bold text-lg">EasyShoping</span>
      </div>

      <!-- Panier déroulant -->
      <div class="relative">
        <button @click="toggleCartDropdown" class="flex items-center gap-2 text-purple-700 font-semibold">
          🛒
          <span>Mon Panier</span>
          <span v-if="cartItemCount > 0" class="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
            {{ cartItemCount }}
          </span>
        </button>

        <!-- Dropdown panier -->
        <div v-if="cartDropdownOpen" class="absolute right-0 mt-2 w-80 bg-white shadow-lg border rounded-lg p-4 z-50 max-h-96 overflow-y-auto">
          <div v-if="cartItemCount === 0">
            <p class="text-gray-500">Votre panier est vide.</p>
          </div>
          <div v-else>
            <div v-for="item in cart" :key="item.id" class="flex items-center mb-3 border-b pb-2">
              <img :src="item.images?.[0] || item.image || '/placeholder.png'" alt="" class="w-12 h-12 object-cover rounded mr-3" />
              <div class="flex-1">
                <p class="font-semibold">{{ item.nom }}</p>
                <p>{{ item.prix }} € x {{ item.quantity }}</p>
              </div>
              <button @click="remove(item.id)" class="text-red-500 font-bold">❌</button>
            </div>

            <div class="mt-2 font-bold text-lg">Total: {{ total }} €</div>

            <!-- Choix paiement -->
            <select v-model="paymentMethod" class="border p-2 rounded w-full mt-2">
              <option value="stripe">💳 Carte bancaire (Stripe)</option>
              <option value="paypal">🅿️ PayPal</option>
            </select>

            <!-- Bouton Stripe -->
            <button v-if="paymentMethod==='stripe'" @click="payerStripe" class="bg-green-500 text-white w-full py-2 rounded mt-2 hover:bg-green-600">
              💳 Payer avec Stripe
            </button>

            <!-- Bouton PayPal -->
            <div v-if="paymentMethod==='paypal'" class="mt-2">
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
        <input v-model="search" type="text" placeholder="Vous cherchez quoi ?..." class="flex-1 min-w-0 border rounded px-3 py-2"/>

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
import ThemeSwitcher from './ThemeSwitcher.vue';

export default {
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
    total() {
      return this.cart.reduce((sum, item) => sum + item.prix * item.quantity, 0);
    }
  },
  methods: {
    toggleCartDropdown() {
      this.cartDropdownOpen = !this.cartDropdownOpen;
      if(this.cartDropdownOpen && this.paymentMethod==='paypal'){
        this.$nextTick(() => this.renderPaypalButton());
      }
    },
    remove(id) { this.$store.dispatch("removeItem", id); },

    // Recherche
    rechercher() {
      this.$router.push({ path:"/", query:{ search: this.search }});
    },
    filterCategorie() {
      this.$router.push({ path:"/", query:{ categorie:this.categorie, search:this.search }});
    },

    // Stripe paiement
    async payerStripe() {
      if(!this.user){ alert("Veuillez vous connecter avant de payer"); this.$router.push("/login"); return; }
      if(!this.cart.length){ alert("Panier vide"); return; }
      const items = this.cart.map(p=>({ id:p.id, nom:p.nom, prix:p.prix, quantity:p.quantity, image:p.images?.[0]||p.image||'/placeholder.png' }));
      const res = await fetch("https://stripe-backend-production-2ac4.up.railway.app/create-stripe-session",{
        method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({items, email:this.user.email})
      });
      const data = await res.json();
      if(data.url) window.location.href = data.url;
    },

    // PayPal paiement
    async loadPaypalScript(){
      return new Promise((resolve,reject)=>{
        if(window.paypal) return resolve(window.paypal);
        const s=document.createElement("script");
        s.src="https://www.paypal.com/sdk/js?client-id=AfeH12AsZ1GhWJ0Ig2P2cRp98arFXAdpUDeIOaZ6g3WBFAhEcorGVjcjyBFPKQhlQ0Rw66RqJxMwtD9e&currency=EUR";
        s.onload=()=>resolve(window.paypal); s.onerror=reject; document.body.appendChild(s);
      });
    },
    async renderPaypalButton(){
      if(!this.user || !this.cart.length) return;
      const paypalSdk = await this.loadPaypalScript();
      const items = this.cart.map(p=>({ id:p.id, nom:p.nom, prix:p.prix, quantity:p.quantity }));
      paypalSdk.Buttons({
        createOrder:(data,actions)=>{
          return fetch("https://stripe-backend-production-2ac4.up.railway.app/create-paypal-order",{
            method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({items,email:this.user.email})
          }).then(r=>r.json()).then(order=>order.id);
        },
        onApprove:(data)=>fetch("https://stripe-backend-production-2ac4.up.railway.app/capture-paypal-order",{
          method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({orderId:data.orderID,items,user:{email:this.user.email}})
        }).then(r=>r.json()).then(()=>{ alert("Paiement PayPal réussi !"); this.$store.dispatch("clearCart"); }),
        onError:(err)=>{ console.error("PayPal error:",err); alert("Erreur PayPal: "+err.message); }
      }).render("#paypal-button-container");
    }
  }
}
</script>

<style scoped>
input{ min-width:0; }
.flex-shrink-0{ flex-shrink:0; }
</style>
