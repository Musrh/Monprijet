<template>
  <div class="p-4">
    <h1 class="text-3xl font-bold mb-6">Admin Panel - Utilisateurs</h1>

    <!-- Vérification admin -->
    <div v-if="!isAdmin">
      <p class="text-red-600 font-semibold">Accès refusé ❌</p>
    </div>

    <div v-else>
      <div v-if="users.length === 0">Aucun utilisateur trouvé</div>

      <ul>
        <li
          v-for="userItem in users"
          :key="userItem.uid"
          class="mb-2 flex justify-between items-center border p-2 rounded"
        >
          <span>{{ userItem.email }} ({{ userItem.role || "user" }})</span>
          <div>
            <button @click="toggleAdmin(userItem)" class="mr-2 bg-blue-500 text-white px-2 rounded">
              {{ userItem.role === 'admin' ? 'Retirer Admin' : 'Rendre Admin' }}
            </button>
            <button @click="deleteUser(userItem.uid)" class="bg-red-500 text-white px-2 rounded">
              Supprimer
            </button>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue"
import { db } from "../firebase"
import { collection, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore"
import { mapGetters } from "vuex"

export default {
  setup() {
    const users = ref([])

    // 🔹 Récupération des utilisateurs
    const fetchUsers = async () => {
      try {
        const snap = await getDocs(collection(db, "users"))
        console.log("Users fetched:", snap.docs.map(d => ({ uid: d.id, ...d.data() })))
        users.value = snap.docs.map(d => ({ uid: d.id, ...d.data() }))
      } catch (error) {
        console.error("Erreur fetchUsers:", error)
      }
    }

    const toggleAdmin = async (userItem) => {
      try {
        const newRole = userItem.role === "admin" ? "user" : "admin"
        await updateDoc(doc(db, "users", userItem.uid), { role: newRole })
        fetchUsers()
      } catch (error) {
        console.error("Erreur toggleAdmin:", error)
      }
    }

    const deleteUser = async (uid) => {
      if (confirm("Supprimer cet utilisateur ?")) {
        try {
          await deleteDoc(doc(db, "users", uid))
          fetchUsers()
        } catch (error) {
          console.error("Erreur deleteUser:", error)
        }
      }
    }

    onMounted(() => {
      fetchUsers()
    })

    return { users, toggleAdmin, deleteUser }
  },

  computed: {
    ...mapGetters(["isAdmin"])
  }
}
</script>

<style scoped>
button:hover { opacity: 0.8; cursor: pointer; }
</style>
