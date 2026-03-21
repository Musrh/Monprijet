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
        <img :src="item.images?.[0] || item.image || '/placeholder.png'" :alt="item.nom"
          class="w-20 h-20 object-cover rounded mr-4"/>
        <div class="flex-1">
          <h3 class="font-semibold">{{ item.nom }}</h3>
          <p>{{ item.prix }} €</p>
          <p v-if="item.taille">📏 Taille : {{ item.taille }}</p>
          <p v-if="item.couleur">🎨 Couleur : {{ item.couleur }}</p>
          <input type="number" min="1" v-model.number="item.quantity" @change="updateQuantity(item)"
            class="border w-20 p-1 mt-1"/>
        </div>
        <button @click="remove(item)" class="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded">❌</button>
      </div>

      <!-- Adresse détaillée -->
      <div class="mt-4 space-y-2">
        <label class="font-semibold block">Adresse de livraison</label>
        <input v-model="adresse1" placeholder="Adresse ligne 1" class="border p-2 w-full rounded"/>
        <input v-model="adresse2" placeholder="Adresse ligne 2" class="border p-2 w-full rounded"/>
        <input v-model="codePostal" placeholder="Code postal" class="border p-2 w-full rounded"/>
        <input v-model="ville" placeholder="Ville" class="border p-2 w-full rounded"/>
        <input v-model="pays" placeholder="Pays" class="border p-2 w-full rounded"/>
      </div>

      <h3 class="text-lg font-bold mt-4">Total : {{ total }} €</h3>

      <!-- Bouton Stripe -->
      <button @click="payerStripe"
        class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded mt-4 w-full">
        Payer avec Stripe
      </button>

      <!-- Bouton PayPal -->
      <div class="mt-4" id="paypal-container">
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
    ...mapState(["cart","user"]),
    total() {
      return this.cart.reduce((sum,item)=>sum+item.prix*item.quantity,0).toFixed(2);
    },
    adresseLivraison() {
      return `${this.adresse1}, ${this.adresse2}, ${this.codePostal} ${this.ville}, ${this.pays}`;
    }
  },
  mounted() {
    this.renderPaypalButton();
  },
  methods: {
    remove(item){ this.$store.dispatch("removeItem",{id:item.id,taille:item.taille,couleur:item.couleur}); },
    updateQuantity(item){ this.$store.dispatch("updateQuantity",{id:item.id,taille:item.taille,couleur:item.couleur,quantity:item.quantity}); },

    async payerStripe() {
      if(!this.user){ alert("Connectez-vous d'abord"); return; }
      if(!this.adresse1){ alert("Adresse obligatoire"); return; }

      const items=this.cart.map(p=>({id:p.id,nom:p.nom,prix:p.prix,quantity:p.quantity,taille:p.taille,couleur:p.couleur,image:p.images?.[0]||p.image||"/placeholder.png"}));

      const res=await fetch("https://stripe-backend-production-2ac4.up.railway.app/create-stripe-session",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({items,email:this.user.email,adresseLivraison:this.adresseLivraison})
      });
      const data=await res.json();
      if(data.url) window.location.href=data.url;
    },

    async loadPaypalScript() {
      if(window.paypal) return window.paypal;
      return new Promise(resolve=>{
        const script=document.createElement("script");
        script.src="https://www.paypal.com/sdk/js?client-id=YOUR_PAYPAL_CLIENT_ID&currency=EUR";
        script.onload=()=>resolve(window.paypal);
        document.body.appendChild(script);
      });
    },

    async renderPaypalButton() {
      const paypalSdk=await this.loadPaypalScript();
      const container=document.getElementById("paypal-button-container");
      container.innerHTML="";

      paypalSdk.Buttons({
        createOrder:()=>fetch("https://stripe-backend-production-2ac4.up.railway.app/create-paypal-order",{
          method:"POST",
          headers:{"Content-Type":"application/json"},
          body:JSON.stringify({items:this.cart,email:this.user?.email,adresseLivraison:this.adresseLivraison})
        }).then(res=>res.json()).then(order=>order.id),

        onApprove:(data)=>fetch("https://stripe-backend-production-2ac4.up.railway.app/capture-paypal-order",{
          method:"POST",
          headers:{"Content-Type":"application/json"},
          body:JSON.stringify({orderId:data.orderID,email:this.user?.email,adresseLivraison:this.adresseLivraison})
        }).then(res=>res.json()).then(()=>{ this.$store.dispatch("clearCart"); this.$router.push("/success"); })
      }).render(container);
    }
  }
}
</script>

<style scoped>
input{width:100%;margin-top:2px;}
textarea{resize:vertical;}
</style>
