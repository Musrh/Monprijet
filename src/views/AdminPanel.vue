<template>
  <div>
    <h1>Admin Panel</h1>

    <!-- Vérification admin -->
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
            <td>{{ user.isActive ? "Oui" : "Non" }}</td>
            <td>
              <!-- On empêche l'admin de se désactiver lui-même -->
              <button
                v-if="user.uid !== currentUser.uid"
                @click="toggleActive(user)"
              >
                {{ user.isActive ? "Désactiver" : "Activer" }}
              </button>
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
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { useStore } from "vuex";

export default {
  setup() {
    const store = useStore();
    const users = ref([]);

    // Current user connecté
    const currentUser = computed(() => store.state.user || {});

    // Vérification admin
    const isAdmin = computed(() => store.getters.isAdmin);

    // Récupérer tous les utilisateurs
    const fetchUsers = async () => {
      try {
        const snapshot = await getDocs(collection(db, "users"));
        users.value = snapshot.docs.map((doc) => ({
          uid: doc.id,
          ...doc.data()
        }));
        console.log("Users loaded:", users.value);
      } catch (error) {
        console.error("Erreur fetchUsers:", error);
      }
    };

    // Activer ou désactiver un utilisateur
    const toggleActive = async (user) => {
      try {
        const userRef = doc(db, "users", user.uid);
        await updateDoc(userRef, { isActive: !user.isActive });
        // Mise à jour locale
        user.isActive = !user.isActive;
      } catch (error) {
        console.error("Erreur toggleActive:", error);
      }
    };

    onMounted(() => {
      if (isAdmin.value) fetchUsers();
    });

    return {
      users,
      toggleActive,
      currentUser,
      isAdmin
    };
  }
};
</script>
