
<template>
  <section class="p-6">
    <h1 class="text-2xl font-bold mb-4">Envoyer une commande à Printful</h1>

    <div class="mb-4">
      <label class="block mb-1 font-semibold">Sélectionner une commande</label>
      <select v-model="selectedOrderId" @change="fetchOrder" class="border p-2 w-full">
        <option value="">-- Sélectionner une commande --</option>
        <option v-for="cmd in commandes" :key="cmd.id" :value="cmd.id">
          {{ cmd.id }} – {{ cmd.email }} – {{ cmd.adresseLivraison }}
        </option>
      </select>
    </div>

    <div v-if="order">
      <form @submit.prevent="sendToPrintful">
        <div class="mb-2">
          <label class="block font-semibold">Nom client</label>
          <input v-model="order.nomClient" class="border p-2 w-full" required />
        </div>

        <div class="mb-2">
          <label class="block font-semibold">Adresse</label>
          <input v-model="order.adresse" class="border p-2 w-full" required />
        </div>

        <div class="mb-2">
          <label class="block font-semibold">Ville</label>
          <input v-model="order.ville" class="border p-2 w-full" />
        </div>

        <div class="mb-2">
          <label class="block font-semibold">Code postal</label>
          <input v-model="order.codePostal" class="border p-2 w-full" />
        </div>

        <div class="mb-2">
          <label class="block font-semibold">Pays</label>
          <input v-model="order.pays" class="border p-2 w-full" required />
        </div>

        <h2 class="text-lg font-bold mt-4 mb-2">Produits</h2>
        <div v-for="(item, index) in order.items" :key="index" class="border p-2 mb-2">
          <div>Nom: {{ item.nom }}</div>
          <div>Couleur: {{ item.couleur }}</div>
          <div>Taille: {{ item.taille }}</div>
          <div>Quantité: {{ item.quantity }}</div>
        </div>

        <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded mt-2">
          Envoyer à Printful
        </button>
      </form>

      <div v-if="message" class="mt-4 p-2 border rounded" :class="messageClass">
        {{ message }}
      </div>
    </div>
  </section>
</template>

<script>
import axios from "axios";
import { db } from "../firebase"; // Ton instance Firebase

export default {
  data() {
    return {
      commandes: [],
      selectedOrderId: "",
      order: null,
      message: "",
      messageClass: "",
    };
  },
  created() {
    // Charger les commandes Firestore existantes
    db.collection("commandes")
      .orderBy("date", "desc")
      .limit(50)
      .get()
      .then((snapshot) => {
        this.commandes = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      });
  },
  methods: {
    async fetchOrder() {
      if (!this.selectedOrderId) {
        this.order = null;
        return;
      }

      // Récupérer la commande complète depuis Firestore
      const docRef = db.collection("commandes").doc(this.selectedOrderId);
      const docSnap = await docRef.get();
      if (docSnap.exists) {
        const data = docSnap.data();

        // Transformer items : id → variant_id
        const items = data.items.map((i) => ({
          variant_id: i.id,
          nom: i.nom,
          quantity: i.quantity,
          taille: i.taille,
          couleur: i.couleur,
        }));

        this.order = {
          nomClient: data.email,
          adresse: data.adresseLivraison,
          ville: "",
          codePostal: "",
          pays: "FR", // détecte automatiquement si possible
          items,
        };
      }
    },

    async sendToPrintful() {
      try {
        const res = await axios.post(
          "https://printfulpasscommandes-production.up.railway.app/create-order",
          { order: this.order }
        );

        if (res.data.success) {
          this.message = "✅ Commande envoyée avec succès à Printful !";
          this.messageClass = "bg-green-100 text-green-800";
        } else {
          this.message = `❌ Erreur Printful : ${res.data.message || "Unknown"}`;
          this.messageClass = "bg-red-100 text-red-800";
        }
      } catch (err) {
        this.message = `❌ Erreur réseau : ${err.message}`;
        this.messageClass = "bg-red-100 text-red-800";
      }
    },
  },
};
</script>

<style scoped>
/* Optionnel : styles Tailwind ou custom */
</style>
