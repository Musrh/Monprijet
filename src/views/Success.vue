<template>
  <div class="success-page">
    <h1>Paiement réussi ! ✅</h1>

    <p v-if="loading">Chargement des détails de votre commande...</p>

    <div v-else-if="order">
      <p>Merci pour votre commande, {{ order.customer_email }}.</p>
      <p>Montant total : {{ order.amount_total / 100 }} €</p>

      <h2>Produits :</h2>
      <ul>
        <li v-for="item in order.items" :key="item.id">
          {{ item.name }} - Quantité : {{ item.quantity }} - Prix : {{ item.amount / 100 }} €
        </li>
      </ul>
    </div>

    <div v-else>
      <p>Impossible de récupérer les détails de la commande.</p>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";

export default {
  setup() {
    const order = ref(null);
    const loading = ref(true);

    onMounted(async () => {
      // 🔹 Récupérer session_id depuis l'URL hash (GitHub Pages + hash mode)
      const hash = window.location.hash; // "#/success?session_id=cs_test_XXXX"
      const params = new URLSearchParams(hash.split("?")[1]);
      const sessionId = params.get("session_id");

      if (!sessionId) {
        loading.value = false;
        return;
      }

      try {
        // 🔹 Fetch des détails depuis ton backend Railway
        const res = await fetch(
          `https://stripe-backend-production-2ac4.up.railway.app/api/checkout-session?session_id=${sessionId}`
        );
        const data = await res.json();
        // data = { customer_email, amount_total, items: [{id,name,quantity,amount}] }
        order.value = data;
      } catch (err) {
        console.error("Erreur récupération commande :", err);
      } finally {
        loading.value = false;
      }
    });

    return { order, loading };
  },
};
</script>

<style scoped>
.success-page {
  max-width: 700px;
  margin: auto;
  padding: 20px;
  text-align: center;
}
ul { list-style: none; padding: 0; }
li { margin-bottom: 10px; }
</style>
