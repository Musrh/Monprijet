<template>
  <div class="p-6 max-w-3xl mx-auto">
    <h2 class="text-2xl font-bold mb-4">
      Envoyer une commande à Printful
    </h2>

    <!-- Sélection commande -->
    <div class="mb-4">
      <label class="block mb-1 font-semibold">
        Choisir une commande :
      </label>

      <select
        v-model="selectedOrderId"
        @change="onSelectOrder"
        class="border rounded px-3 py-2 w-full"
      >
        <option value="">-- Sélectionner --</option>
        <option
          v-for="commande in commandes"
          :key="commande.id"
          :value="commande.id"
        >
          {{ commande.id }} - {{ commande.email }} - {{ commande.montant }}€
        </option>
      </select>
    </div>

    <!-- Détails -->
    <div v-if="selectedOrder">

      <p><strong>Email :</strong> {{ selectedOrder.email }}</p>
      <p><strong>Adresse :</strong> {{ selectedOrder.adresseLivraison }}</p>

      <h3 class="font-semibold mt-4 mb-2">Produits :</h3>

      <div
        v-for="(item, index) in selectedOrder.items"
        :key="index"
        class="border p-3 mb-2 rounded"
      >
        <p><strong>Nom :</strong> {{ item.nom }}</p>
        <p><strong>Quantité :</strong> {{ item.quantity }}</p>
        <p><strong>Couleur :</strong> {{ item.couleur }}</p>
        <p><strong>Taille :</strong> {{ item.taille }}</p>
        <p><strong>ID :</strong> {{ item.id }}</p>
      </div>

      <button
        @click="sendToPrintful"
        class="bg-blue-600 text-white px-4 py-2 rounded mt-4"
      >
        Envoyer à Printful
      </button>

    </div>

    <div v-if="message" class="mt-4 text-green-600">
      {{ message }}
    </div>

    <div v-if="error" class="mt-4 text-red-600">
      {{ error }}
    </div>

  </div>
</template>

<script>
import { getAuth, onAuthStateChanged } from "firebase/auth";
import axios from "axios";

export default {
  name: "SendToPrintful",

  data() {
    return {
      commandes: [],
      selectedOrderId: "",
      selectedOrder: null,
      message: "",
      error: ""
    };
  },

  methods: {
    async fetchCommandes(token) {
      try {
        const res = await axios.get(
          "https://backendlistecommandes-production.up.railway.app/list-orders",
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        this.commandes = res.data.commandes || [];
      } catch (err) {
        console.error(err);
        this.error = "Impossible de récupérer les commandes.";
      }
    },

    onSelectOrder() {
      this.selectedOrder =
        this.commandes.find(c => c.id === this.selectedOrderId) || null;
    },

    async sendToPrintful() {
      if (!this.selectedOrder) return;

      try {
        console.log("📦 Envoi vers backend Printful :", this.selectedOrder);

        const res = await axios.post(
          `https://printfulpasscommandes-production.up.railway.app/admin/send-to-printful/${this.selectedOrder.id}`,
          this.selectedOrder
        );

        if (res.data.success) {
          this.message = "Commande envoyée à Printful ✅";
          this.error = "";
        } else {
          this.error = res.data.message;
          this.message = "";
        }

      } catch (err) {
        console.error(err.response?.data || err.message);
        this.error = "Erreur lors de l'envoi à Printful ❌";
        this.message = "";
      }
    }
  },

  mounted() {
    const auth = getAuth();

    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const token = await user.getIdToken();
        this.fetchCommandes(token);
      }
    });
  }
};
</script>
