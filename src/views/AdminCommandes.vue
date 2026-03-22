<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold mb-4">Commandes des utilisateurs</h1>

    <div v-if="loading" class="text-gray-600">Chargement des commandes...</div>
    <div v-else-if="commandes.length === 0" class="text-red-500">Aucune commande trouvée...</div>

    <table v-else class="min-w-full border border-gray-300">
      <thead>
        <tr class="bg-gray-200">
          <th class="border p-2">Email</th>
          <th class="border p-2">Montant</th>
          <th class="border p-2">Statut</th>
          <th class="border p-2">Date</th>
          <th class="border p-2">Items</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="commande in commandes" :key="commande.id">
          <td class="border p-2">{{ commande.email }}</td>
          <td class="border p-2">{{ commande.montant }} €</td>
          <td class="border p-2">{{ commande.status }}</td>
          <td class="border p-2">{{ commande.createdAt?.toDate().toLocaleString() }}</td>
          <td class="border p-2">
            <ul>
              <li v-for="item in commande.items" :key="item.id">
                {{ item.nom }} × {{ item.quantity }}
              </li>
            </ul>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { db } from "../firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";

export default {
  setup() {
    const commandes = ref([]);
    const loading = ref(true);

    const fetchCommandes = async () => {
      loading.value = true;
      try {
        // 🔹 Attention ici : champ "createdAt" et non "date"
        const q = query(collection(db, "commandes"), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        commandes.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      } catch (err) {
        console.error("Erreur fetchCommandes:", err);
      } finally {
        loading.value = false;
      }
    };

    onMounted(fetchCommandes);

    return { commandes, loading };
  }
};
</script>
