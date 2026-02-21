<template>
  <div class="panier">
    <h1>Mon Panier</h1>

    <ul v-if="panier.length">
      <li v-for="(item, index) in panier" :key="index">
        {{ item.name }} - {{ item.quantity }} x {{ (item.amount / 100).toFixed(2) }} €
      </li>
    </ul>

    <p v-else>Votre panier est vide.</p>

    <p>Total : {{ total }} €</p>

    <button @click="checkout" :disabled="!panier.length">
      Payer avec Stripe
    </button>

    <button @click="testClick">
      Test bouton
    </button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      panier: [
        // Exemple de produits, tu peux remplacer par ton vrai panier
        { name: "Produit A", amount: 5000, quantity: 1 },
        { name: "Produit B", amount: 2500, quantity: 2 },
      ],
    };
  },
  computed: {
    total() {
      return (this.panier.reduce((sum, i) => sum + i.amount * i.quantity, 0) / 100).toFixed(2);
    },
  },
  methods: {
    testClick() {
      alert("Bouton fonctionne !");
      console.log("Click OK");
    },

    async checkout() {
      try {
        const response = await fetch(
          "https://ton-backend.up.railway.app/create-checkout-session",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ items: this.panier }),
          }
        );

        const session = await response.json();

        if (session.url) {
          // Redirige vers Stripe Checkout
          window.location.href = session.url;
        } else {
          alert("Erreur lors de la création de la session Stripe");
          console.error("Session Stripe manquante :", session);
        }
      } catch (err) {
        console.error("Erreur fetch backend:", err);
        alert("Erreur lors du paiement. Vérifiez la console.");
      }
    },
  },
};
</script>

<style scoped>
.panier {
  max-width: 400px;
  margin: 2rem auto;
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  text-align: center;
}

ul {
  list-style: none;
  padding: 0;
  margin-bottom: 1rem;
}

li {
  margin: 0.5rem 0;
}

button {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background-color: #6772e5;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:disabled {
  background-color: #bbb;
  cursor: not-allowed;
}
</style>
