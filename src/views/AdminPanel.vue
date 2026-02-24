<template>
  <div>
    <h1>Admin Panel</h1>

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
          <td>{{ user.isActive ? "Oui" : "Non" }}</td>
          <td>
            <button @click="toggleActive(user)">
              {{ user.isActive ? "Désactiver" : "Activer" }}
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { db } from "../firebase";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";

export default {
  setup() {
    const users = ref([]);

    const fetchUsers = async () => {
      const snapshot = await getDocs(collection(db, "users"));
      users.value = snapshot.docs.map(doc => ({
        uid: doc.id,
        ...doc.data()
      }));
    };

    const toggleActive = async (user) => {
      try {
        const userRef = doc(db, "users", user.uid);
        await updateDoc(userRef, { isActive: !user.isActive });
        // Mettre à jour localement
        user.isActive = !user.isActive;
      } catch (error) {
        console.error("Erreur mise à jour isActive:", error);
      }
    };

    onMounted(fetchUsers);

    return { users, toggleActive };
  }
};
</script>
