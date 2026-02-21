<template>
  <div>
    <h1>Panier</h1>
    <ul>
      <li v-for="(item, index) in panier" :key="index">
        {{ item.nom }} - {{ item.quantite }} x {{ item.prix }}€
      </li>
    </ul>
    <button @click="payer">Payer avec Stripe</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      panier: [
        { nom: "Produit A", prix: 20, quantite: 1 },
        { nom: "Produit B", prix: 15, quantite: 2 }
      ]
    }
  },
  methods: {
    async payer() {
      try {
        if (!window.Stripe) {
          console.error("Stripe.js n'est pas chargé !")
          return
        }

        // Création de la session Checkout côté backend
        const res = await fetch('https://ton-backend.up.railway.app/create-checkout-session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ panier: this.panier })
        })

        const data = await res.json()
        if (!data.id) {
          console.error("Erreur création session:", data)
          return
        }

        // Redirection vers Stripe Checkout
        const stripe = Stripe('pk_test_51T20K6AwgHqDmd0F8LcnioXKpuzSyQv7aPkDhhmtPEH9BA98KOzf6F43K2O4A5WjhHHVlguyp48W0bmqMbwSvcDm00YINXIME3')
        const { error } = await stripe.redirectToCheckout({ sessionId: data.id })

        if (error) console.error("Erreur redirection Stripe:", error)

      } catch (err) {
        console.error("Erreur paiement:", err)
      }
    }
  }
}
</script>

<!-- ⚠️ Assure-toi que Stripe.js est chargé dans ton index.html -->
<!-- <script src="https://js.stripe.com/v3/"></script> -->
