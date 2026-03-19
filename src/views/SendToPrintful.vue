<template>
  <section class="p-4">
    <h2 class="text-2xl font-bold mb-4">Envoyer une commande à Printful</h2>

    <!-- Sélection de la commande -->
    <div class="mb-4">
      <label class="block mb-1 font-semibold">Choisir une commande :</label>
      <select v-model="selectedOrderId" class="border p-2 w-full">
        <option disabled value="">Sélectionner une commande</option>
        <option v-for="order in commandes" :key="order.id" :value="order.id">
          {{ order.email }} – {{ order.adresseLivraison }} – {{ order.date.toDate().toLocaleString() }}
        </option>
      </select>
    </div>

    <div v-if="selectedOrder">
      <h3 class="font-bold mb-2">Détails de la commande :</h3>
      <ul class="mb-4">
        <li v-for="(item, index) in selectedOrder.items" :key="index">
          {{ item.nom }} – {{ item.quantity }} × {{ item.couleur || '' }} {{ item.taille || '' }}
        </li>
      </ul>

      <!-- Modifier infos si besoin -->
      <div class="mb-4">
        <label class="block mb-1 font-semibold">Adresse :</label>
        <input v-model="selectedOrder.adresseLivraison" class="border p-2 w-full" />
      </div>

      <div class="mb-4">
        <label class="block mb-1 font-semibold">Ville :</label>
        <input v-model="selectedOrder.ville" class="border p-2 w-full" />
      </div>

      <div class="mb-4">
        <label class="block mb-1 font-semibold">Code postal :</label>
        <input v-model="selectedOrder.codePostal" class="border p-2 w-full" />
      </div>

      <div class="mb-4">
        <label class="block mb-1 font-semibold">Pays :</label>
        <input v-model="selectedOrder.pays" class="border p-2 w-full" />
      </div>

      <button
        @click="sendToPrintful"
        class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Envoyer à Printful
      </button>
    </div>

    <p v-if="message" class="mt-4 font-semibold">{{ message }}</p>
  </section>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      commandes: [],
      selectedOrderId: "",
      message: "",
    };
  },
  computed: {
    selectedOrder() {
      return this.commandes.find((o) => o.id === this.selectedOrderId) || null;
    },
  },
  async mounted() {
    try {
      const res = await axios.get(
        "https://backendlistecommandes-production.up.railway.app/list-orders"
      );
      this.commandes = res.data.commandes || [];
    } catch (err) {
      console.error("Erreur récupération commandes:", err);
    }
  },
  methods: {
    async sendToPrintful() {
      if (!this.selectedOrder) return;

      try {
        const orderForPrintful = {
          nomClient: this.selectedOrder.email || "Client",
          adresse: this.selectedOrder.adresseLivraison,
          ville: this.selectedOrder.ville || "",
          pays: this.selectedOrder.pays || "FR",
          codePostal: this.selectedOrder.codePostal || "",
          items: this.selectedOrder.items.map((i) => ({
            variant_id: i.id, // ✅ important pour Printful
            quantity: i.quantity,
            name: i.nom,
          })),
        };

        const res = await axios.post(
          "https://printfulpasscommandes-production.up.railway.app/create-order",
          { order: orderForPrintful }
        );

        if (res.data.success) {
          this.message = "✅ Commande envoyée à Printful avec succès !";
        } else {
          this.message = "❌ Échec de l'envoi à Printful : " + res.data.message;
        }
      } catch (err) {
        console.error("Erreur envoi Printful:", err);
        this.message = "❌ Erreur lors de l'envoi à Printful";
      }
    },
  },
};
</script>

<style scoped>
/* simple styling */
</style>
