<template>
  <div>
    <h1>Admin Panel</h1>

    <p v-if="loading">Chargement...</p>

    <div v-else>
      <p>Email: {{ user?.email }}</p>
      <p>Role: {{ user?.role }}</p>

      <div v-if="isAdmin">
        <h2>Bienvenue Admin 👑</h2>
      </div>

      <div v-else>
        <h2>Accès refusé ❌</h2>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue"
import { auth, db } from "@/firebase"
import { onAuthStateChanged } from "firebase/auth"
import { doc, getDoc } from "firebase/firestore"

export default {
  setup() {
    const user = ref(null)
    const isAdmin = ref(false)
    const loading = ref(true)

    onMounted(() => {
      onAuthStateChanged(auth, async (currentUser) => {
        if (!currentUser) {
          loading.value = false
          return
        }

        const snap = await getDoc(doc(db, "users", currentUser.uid))

        if (snap.exists()) {
          user.value = snap.data()
          isAdmin.value = snap.data().role === "admin"
        }

        loading.value = false
      })
    })

    return { user, isAdmin, loading }
  }
}
</script>
