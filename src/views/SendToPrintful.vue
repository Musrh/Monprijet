<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">Envoyer Commande à Printful</h1>

    <!-- Sélection de la commande -->
    <label class="block mb-2 font-semibold">Choisir une commande :</label>
    <select v-model="selectedOrderId" @change="loadOrderDetails" class="border p-2 mb-4 w-full">
      <option value="" disabled>-- Sélectionner une commande --</option>
      <option v-for="order in orders" :key="order.id" :value="order.id">
        {{ order.id }} - {{ order.email }} - {{ order.adresseLivraison }}
      </option>
    </select>

    <!-- Détails de la commande -->
    <div v-if="selectedOrder" class="border p-4 rounded bg-gray-50">
      <h2 class="text-xl font-semibold mb-2">Détails de la commande</h2>
      <p><strong>Email :</strong> {{ selectedOrder.email }}</p>
      <p><strong>Adresse :</strong> {{ selectedOrder.adresseLivraison }}</p>
      <p><strong>Pays :</strong> {{ selectedOrder.pays || 'FR' }}</p>
      <p><strong>City :</strong> {{ selectedOrder.city || '' }}</p>
      <p><strong>Zip :</strong> {{ selectedOrder.zip || '' }}</p>
      <p><strong>Devise :</strong> {{ selectedOrder.devise }}</p>

      <h3 class="mt-4 font-semibold">Produits :</h3>
      <table class="w-full border mt-2">
        <thead>
          <tr class="bg-gray-200">
            <th class="border px-2 py-1">Nom</th>
            <th class="border px-2 py-1">ID (Printful)</th>
            <th class="border px-2 py-1">Couleur</th>
            <th class="border px-2 py-1">Taille</th>
            <th class="border px-2 py-1">Quantité</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in selectedOrder.items" :key="item.id">
            <td class="border px-2 py-1">{{ item.nom }}</td>
            <td class="border px-2 py-1">{{ item.id }}</td>
            <td class="border px-2 py-1">{{ item.couleur }}</td>
            <td class="border px-2 py-1">{{ item.taille }}</td>
            <td class="border px-2 py-1">{{ item.quantity }}</td>
          </tr>
        </tbody>
      </table>

      <!-- Bouton envoyer -->
      <button
        @click="sendToPrintful"
        class="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Envoyer à Printful
      </button>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      orders: [],             // Liste des commandes depuis le backend
      selectedOrderId: "",    // Commande sélectionnée
      selectedOrder: null,    // Détails de la commande sélectionnée
    };
  },
  mounted() {
    this.fetchOrders();
  },
  methods: {
    async fetchOrders() {
      try {
        const res = await axios.get(
          "https://backendlistecommandes-production.up.railway.app/admin/orders"
        );
        this.orders = res.data;
      } catch (err) {
        console.error("Erreur récupération commandes :", err);
      }
    },
    loadOrderDetails() {
      this.selectedOrder = this.orders.find(
        (o) => o.id === this.selectedOrderId
      );
    },
    async sendToPrintful() {
      if (!this.selectedOrder) return;

      // Transformation id -> variant_id
      const itemsForPrintful = this.selectedOrder.items.map((i) => ({
        variant_id: i.id,
        quantity: i.quantity,
        name: i.nom,
      }));

      const orderForPrintful = {
        nomClient: this.selectedOrder.email,
        adresse: this.selectedOrder.adresseLivraison,
        city: this.selectedOrder.city || "",
        country: this.selectedOrder.pays || "FR",
        codePostal: this.selectedOrder.zip || "",
        items: itemsForPrintful,
      };

      try {
        const res = await axios.post(
          "https://printfulpasscommandes-production.up.railway.app/create-order",
          { order: orderForPrintful }
        );

        if (res.data.success) {
          alert("Commande envoyée à Printful ✅");
        } else {
          alert("Erreur lors de l'envoi à Printful ❌");
        }
      } catch (err) {
        console.error("Erreur envoi Printful :", err);
        alert("Erreur lors de l'envoi à Printful ❌");
      }
    },
  },
};
</script>
