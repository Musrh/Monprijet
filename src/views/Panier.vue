<template>
  <div class="panier">
    <h1>Mon Panier</h1>

    <ul>
      <li v-for="(item, index) in panier" :key="index">
        {{ item.name }} - {{ item.quantity }} x {{ (item.amount / 100).toFixed(2) }} €
      </li>
    </ul>

    <p>Total : {{ total }} €</p>

    <button @click="checkout">
      Payer avec Stripe
    </button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      panier: [
        { name: "Formation Premium", amount: 5000, quantity: 1 },
        { name: "Coaching", amount: 3000, quantity: 1 },
      ],
    };
  },

  computed: {
    total() {
      return (this.panier.reduce((sum, i) => sum + i.amount * i.quantity, 0) / 100).toFixed(2);
    },
  },

  methods: {
    async checkout() {
      try {
        const response = await fetch(
          "https://stripe-backend-production-2ac4.up.railway.app/create-checkout-session",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ items: this.panier }),
          }
        );

        const session = await response.json();

        if (session.url) {
          window.location.href = session.url;
        } else {
          alert("Erreur création session Stripe");
        }

      } catch (err) {
        console.error("Erreur :", err);
        alert("Erreur paiement");
      }
    },
  },
};
</script>

<style scoped>
.panier {
  max-width: 400px;
  margin: 40px auto;
  text-align: center;
}
button {
  padding: 10px 20px;
  background: #6772e5;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}
</style>
