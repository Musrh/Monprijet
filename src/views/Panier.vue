<template>
  <div class="panier">
    <h2>🛒 Mon Panier</h2>

    <div v-if="cart.length === 0">
      <p>Votre panier est vide.</p>
    </div>

    <div v-else>
      <div v-for="item in cart" :key="item.id" class="cart-item">
        <img :src="item.image" width="80" />
        <div class="info">
          <h3>{{ item.nom }}</h3>
          <p>{{ item.prix }} €</p>
          <input
            type="number"
            min="1"
            v-model.number="item.quantity"
            @change="updateQuantity(item)"
          />
        </div>
        <button @click="remove(item.id)">❌</button>
      </div>

      <h3 class="total">Total : {{ total }} €</h3>

      <button class="pay-btn" @click="payer" :disabled="loading">
        <span v-if="loading">⏳ Chargement...</span>
        <span v-else>💳 Payer</span>
      </button>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex"

export default {
  data() {
    return {
      loading: false
    }
  },
  computed: {
    ...mapState(["cart"]),
    total() {
      return this.cart.reduce((sum, item) => sum + item.prix * item.quantity, 0)
    }
  },
  methods: {
    remove(id) {
      this.$store.dispatch("removeFromCart", id)
    },
    updateQuantity(item) {
      this.$store.dispatch("updateQuantity", { id: item.id, quantity: item.quantity })
    },
    async payer() {
      if (this.cart.length === 0) {
        alert("Panier vide")
        return
      }

      if (this.loading) return // empêche double clic
      this.loading = true

      try {
        console.log("🚀 Envoi panier :", this.cart)

        const response = await fetch(
          "https://stripe-backend-production-2ac4.up.railway.app/create-checkout-session",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ cart: this.cart, userId: "user123" }) // tu peux remplacer par l'ID réel
          }
        )

        console.log("📡 Status :", response.status)

        if (!response.ok) {
          const text = await response.text()
          console.error("Erreur backend :", text)
          alert("Erreur serveur : " + text)
          return
        }

        const data = await response.json()
        console.log("📦 Réponse backend :", data)

        if (data.url) {
          console.log("➡️ Redirection Stripe...")
          window.location.href = data.url
        } else {
          alert("URL Stripe manquante")
        }

      } catch (error) {
        console.error("❌ Erreur paiement :", error)
        alert("Impossible de lancer le paiement")
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
.panier {
  max-width:
