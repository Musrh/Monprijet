<template>
  <div class="p-4">
    <h1 class="text-3xl font-bold mb-6">Admin Panel - Utilisateurs</h1>

    <!-- Vérification admin -->
    <div v-if="!isAdmin">
      <p class="text-red-600 font-semibold">Accès refusé ❌</p>
    </div>

    <div v-else>
      <div v-if="users.length === 0">Aucun utilisateur trouvé</div>

      <ul v-else>
        <li
          v-for="user in users"
          :key="user.uid"
          class="mb-2 flex justify-between items-center border p-2 rounded"
        >
          <span>{{ user.email }} - {{ user.role }}</span>
          <div>
            <button
              @click="toggleAdmin(user)"
              class="mr-2 bg-blue-500 text-white px-2 rounded"
            >
              {{ user.role === "admin" ? "Retirer Admin" : "Rendre Admin" }}
            </button>
            <button
              @click="deleteUser(user.uid)"
              class="bg-red-500 text-white px-2 rounded"
            >
              Supprimer
            </button>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { db } from "../firebase";
import { collection, getDocs, updateDoc, doc, deleteDoc } from "firebase/firestore";
import { mapGetters } from "vuex";

export default {
  setup() {
    const users = ref([]);

    // 🔹 Récupérer les utilisateurs
    const fetchUsers = async () => {
      try {
        const snap = await getDocs(collection(db, "users"));
        users.value = snap.docs.map(d => ({ uid: d.id, ...d.data() }));
        console.log("Utilisateurs:", users.value); // Pour vérifier en console
      } catch (err) {
        console.error("Erreur fetchUsers:", err);
      }
    };

    // 🔹 Modifier rôle admin
    const toggleAdmin = async (user) => {
      const newRole = user.role === "admin" ? "user" : "admin";
      await updateDoc(doc(db, "users", user.uid), { role: newRole });
      fetchUsers();
    };

    // 🔹 Supprimer utilisateur
    const deleteUser = async (uid) => {
      if (confirm("Supprimer cet utilisateur ?")) {
        await deleteDoc(doc(db, "users", uid));
        fetchUsers();
      }
    };

    onMounted(() => {
      fetchUsers();
    });

    return { users, toggleAdmin, deleteUser };
  },

  computed: {
    ...mapGetters(["isAdmin"])
  }
};
</script>

<style scoped>
button:hover { opacity: 0.8; cursor: pointer; }
section { margin-bottom: 40px; }
</style>
