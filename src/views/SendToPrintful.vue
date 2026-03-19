<template>
  <section class="p-6">
    <h2 class="text-2xl font-bold mb-4">Envoyer commande à Printful</h2>

    <!-- Sélecteur de commande -->
    <label class="block mb-2 font-semibold">Choisir commande :</label>
    <select v-model="selectedOrderId" @change="loadOrder" class="border p-2 mb-4 w-full">
      <option disabled value="">Sélectionner une commande</option>
      <option v-for="cmd in commandes" :key="cmd.id" :value="cmd.id">
        {{ cmd.id }} - {{ cmd.email }} - {{ cmd.adresseLivraison }}
      </option>
    </select>

    <!-- Formulaire pré-rempli -->
    <div v-if="order">
      <label class="block mb-2 font-semibold">Email</label>
      <input v-model="order.email" class="border p-2 mb-4 w-full" />

      <label class="block mb-2 font-semibold">Adresse</label>
      <input v-model="order.adresseLivraison" class="border p-2 mb-4 w-full" />

      <label class="block mb-2 font-semibold">Ville</label>
      <input v-model="order.ville" class="border p-2 mb-4 w-full" />

      <label class="block mb-2 font-semibold">Code Postal</label>
      <input v-model="order.codePostal" class="border p-2 mb-4 w-full" />

      <label class="block mb-2 font-semibold">Pays</label>
      <input v-model="order.pays" class="border p-2 mb-4 w-full" />

      <label class="block mb-2 font-semibold">Produits</label>
      <div v-for="(item, index) in order.items" :key="index" class="mb-2 p-2 border">
        <div>Nom: {{ item.nom }}</div>
        <div>Variant: <input v-model="item.variant_id" class="border p-1 w-full" /></div>
        <div>Couleur: <input v-model="item.couleur" class="border p-1 w-full" /></div>
        <div>Taille: <input v-model="item.taille" class="border p-1 w-full" /></div>
        <div>Quantité: <input type="number" v-model.number="item.quantity" class="border p-1 w-full" /></div>
      </div>

      <button @click="sendToPrintful" class="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
        Envoyer à Printful
      </button>

      <div v-if="message" class="mt-4 p-2 border rounded" :class="message.success ? 'bg-green-100' : 'bg-red-100'">
        {{ message.text }}
      </div>
    </div>
  </section>
</template>

<script>
import { ref, reactive, onMounted } from "vue";

export default {
  setup() {
    const commandes = ref([]);
    const selectedOrderId = ref("");
    const order = reactive({
      email: "",
      adresseLivraison: "",
      ville: "",
      codePostal: "",
      pays: "",
      items: [],
    });
    const message = reactive({ text: "", success: false });

    // 🔹 Charger toutes les commandes Firestore (exemple via fetch)
    const loadCommandes = async () => {
      try {
        const res = await fetch("https://stripe-backend-production-2ac4.up.railway.app/admin/orders"); 
        const data = await res.json();
        commandes.value = data.commandes;
      } catch (err) {
        console.error(err);
      }
    };

    // 🔹 Charger commande sélectionnée
    const loadOrder = () => {
      const cmd = commandes.value.find(c => c.id === selectedOrderId.value);
      if (!cmd) return;
      order.email = cmd.email;
      order.adresseLivraison = cmd.adresseLivraison;
      order.ville = cmd.ville || "";
      order.codePostal = cmd.codePostal || "";
      order.pays = cmd.pays || detectCountry(order.adresseLivraison);
      order.items = cmd.items.map(i => ({
        nom: i.nom,
        variant_id: i.id, // 🔹 transforme id en variant_id
        couleur: i.couleur,
        taille: i.taille,
        quantity: i.quantity
      }));
    };

    // 🔹 Détecter pays depuis adresse
    const detectCountry = (adresse) => {
      if (!adresse) return "FR";
      const lower = adresse.toLowerCase();
      if (lower.includes("maroc")) return "MA";
      if (lower.includes("hollande")) return "NL";
      return "FR"; // par défaut
    };

    // 🔹 Envoyer la commande au backend Printful
    const sendToPrintful = async () => {
      try {
        const res = await fetch(`https://printfulpasscommandes-production.up.railway.app/admin/send-to-printful/${selectedOrderId.value}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(order),
        });
        const data = await res.json();
        message.text = data.message || "Commande envoyée avec succès";
        message.success = data.success;
      } catch (err) {
        console.error(err);
        message.text = "Erreur lors de l'envoi à Printful";
        message.success = false;
      }
    };

    onMounted(loadCommandes);

    return { commandes, selectedOrderId, order, loadOrder, sendToPrintful, message };
  }
};
</script>
