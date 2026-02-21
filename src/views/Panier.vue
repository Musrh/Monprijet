<template>
  <div>
    <h2>Mon Panier</h2>

    <!-- Liste des produits dans le panier -->
    <ul v-if="panier.length">
      <li v-for="item in panier" :key="item.id" style="margin-bottom: 10px;">
        {{ item.name }} - {{ (item.amount / 100).toFixed(2) }} €
        x
        <input
          type="number"
          v-model.number="item.quantity"
          min="1"
          style="width: 50px;"
          @change="modifier(item)"
        />
        <button @click="retirer(item.id)">Supprimer</button>
      </li>
    </ul>

    <!-- Panier vide -->
    <p v-else>Votre panier est vide.</p>

    <!-- Total -->
    <p v-if="panier.length"><strong>Total : {{ totalPanier.toFixed(2) }} €</strong></p>

    <!-- Bouton payer -->
    <button v-if="panier.length" @click="checkout">Payer le panier</button>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";

export default {
  computed: {
    ...mapGetters(["panier", "totalPanier"])
  },
  methods: {
    ...mapMutations(["retirerDuPanier", "modifierQuantite", "viderPanier"]),

    // Supprimer un produit du panier
    retirer(id) {
      this.retirerDuPanier(id);
    },

    // Modifier la quantité d’un produit
    modifier(item) {
      if (item.quantity < 1) item.quantity = 1;
      this.modifierQuantite({ produitId: item.id, quantity: item.quantity });
    },

    // Checkout Stripe
    async checkout() {
      if (!this.panier.length) {
        alert("Votre panier est vide !");
        return;
      }

      // Ne garder que les champs que Stripe attend
      const itemsStripe = this.panier.map(i => ({
        name: i.name,
        amount: i.amount,
        quantity: i.quantity
      }));

      try {
        const response = await fetch(
          "https://stripe-backend-production-2ac4.up.railway.app/create-checkout-session",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ items: itemsStripe })
          }
        );

        const session = await response.json();
        console.log("Session reçue du backend :", session);

        if (session.url) {
          this.viderPanier(); // vider le panier avant redirection
          window.location.href = session.url; // redirection Stripe
        } else {
          alert("Erreur : URL Stripe manquante");
        }
      } catch (err) {
        console.error("Erreur paiement:", err);
        alert("Erreur paiement : " + err.message);
      }
    }
  }
};
</script>
