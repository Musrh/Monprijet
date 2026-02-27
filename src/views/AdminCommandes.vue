<template>
  <div>
    <h1>Commandes des utilisateurs</h1>

    <p v-if="!isAdmin">Vous n'êtes pas autorisé à voir cette page.</p>

    <div v-else>
      <table border="1" cellpadding="5">
        <thead>
          <tr>
            <th>Email</th>
            <th>Montant</th>
            <th>Devise</th>
            <th>Statut</th>
            <th>Date</th>
            <th>Items</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="cmd in commandes" :key="cmd.id">
            <td>{{ cmd.email }}</td>
            <td>{{ cmd.montant.toFixed(2) }} €</td>
            <td>{{ cmd.devise.toUpperCase() }}</td>
            <td>{{ cmd.statut }}</td>
            <td>{{ formatDate(cmd.date) }}</td>
            <td>
              <ul>
                <li v-for="item in cmd.items" :key="item.id">
                  {{ item.nom }} x {{ item.quantity }}
                </li>
              </ul>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from "vue";
import { db } from "../firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { useStore } from "vuex";

export default {
  setup() {
    const store = useStore();
    const commandes = ref([]);

    const isAdmin = computed(() => store.getters.isAdmin);

    const fetchCommandes = async () => {
      try {
        const q = query(collection(db, "commandes"), orderBy("date", "desc"));
        const snapshot = await getDocs(q);
        commandes.value = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          date: doc.data().date?.toDate(), // timestamp Firestore → JS Date
        }));
      } catch (err) {
        console.error("Erreur fetchCommandes:", err);
      }
    };

    const formatDate = (date) => {
      if (!date) return "";
      return date.toLocaleString();
    };

    onMounted(() => {
      if (isAdmin.value) fetchCommandes();
    });

    return { commandes, isAdmin, formatDate };
  },
};
</script>
