<template>
  <div>
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
import { useRoute } from "vue-router";

export default {
  setup() {
    const route = useRoute();
    const sessionId = route.query.session_id || null;

    const order = ref(null);
    const loading = ref(true);

    onMounted(async () => {
      if (!sessionId) {
        loading.value = false;
        return;
      }

      try {
        // 🔹 Ton backend Stripe Railway
        const res = await fetch(`https://stripe-backend-production-2ac4.up.railway.app/api/checkout-session?session_id=${sessionId}`);
        const data = await res.json();

        // Exemple de structure attendue
        // data = { customer_email, amount_total, items: [ { id, name, quantity, amount } ] }
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
