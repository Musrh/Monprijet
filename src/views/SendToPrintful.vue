<template>
  <div class="p-6 max-w-3xl mx-auto">
    <h2 class="text-2xl font-bold mb-4">Envoyer une commande à Printful</h2>

    <!-- Sélection de la commande -->
    <div class="mb-4">
      <label class="block mb-1 font-semibold">Choisir une commande :</label>
      <select
        v-model="selectedOrderId"
        @change="onSelectOrder"
        class="border rounded px-3 py-2 w-full"
      >
        <option value="">-- Sélectionner une commande --</option>
        <option
          v-for="commande in commandes"
          :key="commande.id"
          :value="commande.id"
        >
          {{ commande.id }} - {{ commande.email }} - {{ commande.montant }}€
        </option>
      </select>
    </div>

    <!-- Formulaire de modification / vérification -->
    <div v-if="selectedOrder">
      <label class="block mb-1 font-semibold">Adresse :</label>
      <input
        v-model="selectedOrder.adresse"
        type="text"
        class="border rounded px-3 py-2 w-full mb-2"
      />

      <label class="block mb-1 font-semibold">Ville :</label>
      <input
        v-model="selectedOrder.city"
        type="text"
        class="border rounded px-3 py-2 w-full mb-2"
      />

      <label class="block mb-1 font-semibold">Code Postal :</label>
      <input
        v-model="selectedOrder.zip"
        type="text"
        class="border rounded px-3 py-2 w-full mb-2"
      />

      <label class="block mb-1 font-semibold">Pays :</label>
      <input
        v-model="selectedOrder.pays"
        type="text"
        class="border rounded px-3 py-2 w-full mb-4"
      />

      <h3 class="font-semibold mb-2">Produits :</h3>
      <table class="w-full border mb-4">
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
          <tr v-for="(item, index) in selectedOrder.items" :key="index">
            <td class="border px-2 py-1">{{ item.nom }}</td>
            <td class="border px-2 py-1">{{ item.id }}</td>
            <td class="border px-2 py-1">{{ item.couleur || "" }}</td>
            <td class="border px-2 py-1">{{ item.taille || "" }}</td>
            <td class="border px-2 py-1">{{ item.quantity }}</td>
          </tr>
        </tbody>
      </table>

      <button
        @click="sendToPrintful"
        class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Envoyer à Printful
      </button>
    </div>

    <div v-if="message" class="mt-4 p-2 border rounded bg-green-100">
      {{ message }}
    </div>

    <div v-if="error" class="mt-4 p-2 border rounded bg-red-100">
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
      error: "",
    };
  },
  methods: {
    async fetchCommandes(token) {
      try {
        const res = await axios.get(
          "https://backendlistecommandes-production.up.railway.app/list-orders",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        this.commandes = res.data.commandes || [];
      } catch (err) {
        console.error("Erreur récupération commandes:", err);
        this.error = "Impossible de récupérer les commandes.";
      }
    },

    onSelectOrder() {
      this.selectedOrder =
        this.commandes.find((c) => c.id === this.selectedOrderId) || null;

      // Détecter le pays automatiquement si possible
      if (this.selectedOrder && !this.selectedOrder.pays) {
        const address = this.selectedOrder.adresse || "";
        if (address.toLowerCase().includes("maroc")) this.selectedOrder.pays = "MA";
        else if (address.toLowerCase().includes("hollande")) this.selectedOrder.pays = "NL";
        else this.selectedOrder.pays = "FR"; // défaut
      }

      // Initialiser city et zip si inexistants
      this.selectedOrder.city = this.selectedOrder.city || "";
      this.selectedOrder.zip = this.selectedOrder.zip || "";
    },

    async sendToPrintful() {
      if (!this.selectedOrder) return;

      // Transformer id → variant_id
      const itemsForPrintful = this.selectedOrder.items.map((i) => ({
        variant_id: i.id, // ici l'id devient variant_id
        quantity: i.quantity,
        name: i.nom,
        color: i.couleur || "",
        size: i.taille || "",
      }));

      const orderForPrintful = {
        nomClient: this.selectedOrder.email,
        adresse: this.selectedOrder.adresse,
        city: this.selectedOrder.city,
        country: this.selectedOrder.pays,
        codePostal: this.selectedOrder.zip,
        items: itemsForPrintful,
      };

      try {
        const res = await axios.post(
          "https://printfulpasscommandes-production.up.railway.app/create-order",
          { order: orderForPrintful }
        );

        if (res.data.success) {
          this.message = `Commande ${this.selectedOrder.id} envoyée à Printful ✅`;
          this.error = "";
        } else {
          this.error = res.data.message || "Erreur lors de l'envoi à Printful ❌";
          this.message = "";
        }
      } catch (err) {
        console.error("Erreur envoi Printful :", err);
        this.error = "Erreur lors de l'envoi à Printful ❌";
        this.message = "";
      }
    },
  },

  mounted() {
    const auth = getAuth();
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const token = await user.getIdToken();
        this.fetchCommandes(token);
      }
    });
  },
};
</script>

<style scoped>
/* Style simple */
</style>
