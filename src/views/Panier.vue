<template>
  <div>
    <h2>Mon Panier</h2>
    <ul>
      <li v-for="(item, index) in panier" :key="index">
        {{ item.name }} - {{ (item.amount/100).toFixed(2) }}€ x {{ item.quantity }}
      </li>
    </ul>
    <button type="button" @click="checkout">Payer avec Stripe</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      panier: [
        { name: "Produit A", amount: 2000, quantity: 1 },
        { name: "Produit B", amount: 3500, quantity: 2 }
      ]
    };
  },
  methods: {
    async checkout() {
      try {
        const response = await fetch(
          'https://stripe-backend-production-2ac4.up.railway.app/create-checkout-session',
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ items: this.panier })
          }
        );

        const session = await response.json();
        console.log("Session reçue du backend :", session);

        if (session.url) {
          window.location.href = session.url; // Stripe 2026
        } else {
          alert("Erreur : URL Stripe manquante");
        }

      } catch (error) {
        console.error("Erreur paiement:", error);
        alert("Erreur paiement : " + error.message);
      }
    }
  }
}
</script>
