<template>
  <div>
    <h1>Admin Panel</h1>

    <p v-if="!isAdmin">Vous n'êtes pas autorisé à voir cette page.</p>

    <div v-else>
      <table border="1" cellpadding="5">
        <thead>
          <tr>
            <th>Email</th>
            <th>Role</th>
            <th>Actif</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.uid">
            <td>{{ user.email }}</td>
            <td>{{ user.role }}</td>
            <td>{{ user.isActive ? 'Oui' : 'Non' }}</td>
            <td>
              <button
                v-if="user.uid !== currentUser.uid"
                @click="toggleActive(user)"
              >
                {{ user.isActive ? 'Désactiver' : 'Activer' }}
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import { db } from '../firebase';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { useStore } from 'vuex';

export default {
  setup() {
    const store = useStore();
    const users = ref([]);

    const currentUser = computed(() => store.state.user || {});
    const isAdmin = computed(() => store.getters.isAdmin);

    const fetchUsers = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'users'));
        users.value = snapshot.docs.map(doc => ({
          uid: doc.id,
          ...doc.data()
        }));
      } catch (err) {
        console.error('Erreur fetchUsers:', err);
      }
    };

    const toggleActive = async (user) => {
      try {
        const userRef = doc(db, 'users', user.uid);
        await updateDoc(userRef, { isActive: !user.isActive });

        // Mise à jour immédiate côté UI
        user.isActive = !user.isActive;
        console.log('Mise à jour réussie:', user.email, user.isActive);
      } catch (err) {
        console.error('Erreur toggleActive:', err);
        alert('Impossible de modifier le compte. Vérifie les règles Firestore et le champ isAdmin.');
      }
    };

    onMounted(() => {
      if (isAdmin.value) fetchUsers();
    });

    return { users, toggleActive, currentUser, isAdmin };
  }
};
</script>
