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
        const res = await fetch('https://ton-backend.up.railway.app/create-checkout-session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(this.panier) // ⚠️ envoie directement le tableau
        })
        const data = await res.json()
        const stripe = Stripe('pk_test_XXXXXX') // ta clé publique Stripe
        await stripe.redirectToCheckout({ sessionId: data.id })
      } catch (err) {
        console.error("Erreur paiement:", err)
      }
    }
  }
}
</script>
