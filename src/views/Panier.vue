<template>
  <div class="panier">
    <h2>🛒 Mon Panier</h2>

    <div v-if="cart.length === 0">
      <p>Votre panier est vide</p>
    </div>

    <div v-else>
      <div v-for="item in cart" :key="item.id" class="item">
        <div>
          <strong>{{ item.nom }}</strong>
          <p>{{ item.prix }} €</p>
        </div>

        <div>
          <input
            type="number"
            min="1"
            v-model.number="item.quantity"
            @change="updateQuantity(item)"
          />
        </div>

        <button @click="remove(item.id)">❌</button>
      </div>

      <h3>Total : {{ total }} €</h3>

      <button class="pay" @click="payer">
        💳 Payer
      </button>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex"

export default {
  computed: {
    ...mapState(["cart"]),

    total() {
      return this.cart.reduce(
        (sum, item) => sum + item.prix * item.quantity,
        0
      )
    }
  },

  methods: {
    remove(id) {
      this.$store.dispatch("removeItem", id)
    },

    updateQuantity(item) {
      if (item.quantity < 1) item.quantity = 1

      this.$store.dispatch("updateQuantity", {
        id: item.id,
        quantity: item.quantity
      })
    },

    async payer() {

      console.log("🛒 Cart envoyé :", this.cart)

      if (this.cart.length === 0) {
        alert("Panier vide")
        return
      }

      try {

        const response = await fetch(
          "https://stripe-backend-production-2ac4.up.railway.app/create-checkout-session",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              items: this.cart
            })
          }
        )

        const data = await response.json()

        console.log("Réponse backend :", data)

        if (data.url) {
          window.location.href = data.url
        } else {
          alert(data.error || "Erreur Stripe")
        }

      } catch (error) {
        console.error("Erreur paiement :", error)
        alert("Impossible de lancer le paiement")
      }
    }
  }
}
</script>

<style scoped>
.panier {
  max-width: 600px;
  margin: auto;
}

.item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  border-bottom: 1px solid #ddd;
  padding-bottom: 10px;
}

.pay {
  margin-top: 20px;
  padding: 12px 25px;
  background: #42b983;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
</style>
