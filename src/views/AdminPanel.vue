<template>
  <div class="p-4">
    <h1 class="text-3xl font-bold mb-6">Admin Panel - Utilisateurs</h1>

    <!-- Vérification admin -->
    <div v-if="!isAdmin">
      <p class="text-red-600 font-semibold">Accès refusé ❌</p>
    </div>

    <div v-else>
      <!-- Liste des utilisateurs -->
      <section>
        <h2 class="text-2xl font-semibold mb-4">Gestion Utilisateurs</h2>

        <div v-if="users.length === 0" class="text-gray-500">
          Aucun utilisateur trouvé
        </div>

        <ul>
          <li
            v-for="user in users"
            :key="user.uid"
            class="mb-2 flex justify-between items-center border p-2 rounded"
          >
            <span>{{ user.email }} - Rôle: {{ user.role }}</span>
            <div>
              <button
                @click="toggleAdmin(user)"
                class="mr-2 bg-blue-500 text-white px-2 py-1 rounded"
              >
                {{ user.role === "admin" ? "Retirer Admin" : "Rendre Admin" }}
              </button>

              <button
                @click="deleteUser(user.uid)"
                class="bg-red-500 text-white px-2 py-1 rounded"
              >
                Supprimer
              </button>
            </div>
          </li>
        </ul>
      </section>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue"
import { db } from "../firebase"
import { collection, getDocs, doc, deleteDoc, updateDoc } from "firebase/firestore"
import { mapGetters } from "vuex"

export default {
  setup() {
    const users = ref([])

    // 🔹 Fetch Users
    const fetchUsers = async () => {
      try {
        const snap = await getDocs(collection(db, "users"))
        users.value = snap.docs.map(d => ({ uid: d.id, ...d.data() }))
      } catch (err) {
        console.error("Erreur fetch users:", err)
      }
    }

    // 🔹 Modifier le rôle admin
    const toggleAdmin = async (user) => {
      try {
        const newRole = user.role === "admin" ? "user" : "admin"
        await updateDoc(doc(db, "users", user.uid), { role: newRole })
        fetchUsers()
      } catch (err) {
        console.error("Erreur toggle admin:", err)
      }
    }

    // 🔹 Supprimer un utilisateur
    const deleteUser = async (uid) => {
      if (!confirm("Supprimer cet utilisateur ?")) return
      try {
        await deleteDoc(doc(db, "users", uid))
        fetchUsers()
      } catch (err) {
        console.error("Erreur delete user:", err)
      }
    }

    onMounted(() => {
      fetchUsers()
    })

    return {
      users,
      toggleAdmin,
      deleteUser
    }
  },

  computed: {
    ...mapGetters(["isAdmin"])
  }
}
</script>

<style scoped>
button:hover {
  opacity: 0.8;
  cursor: pointer;
}
section {
  margin-bottom: 40px;
}
</style>
