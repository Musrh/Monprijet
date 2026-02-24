<template>
  <div>
    <h1>Paiement réussi !</h1>
    <p>Merci pour votre commande.</p>
    <p v-if="orderId">ID de la commande : {{ orderId }}</p>
  </div>
</template>

<script>
import { useRoute } from "vue-router";

export default {
  setup() {
    const route = useRoute();
    const orderId = route.query.orderId || null;

    return { orderId };
  }
};
</script>
