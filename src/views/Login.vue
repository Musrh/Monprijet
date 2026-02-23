<template>
  <div>
    <h2>Register</h2>
    <input v-model="regEmail" placeholder="Email" />
    <input v-model="regPassword" type="password" placeholder="Password" />
    <button @click="register">Register</button>
    <p v-if="error" style="color:red">{{ error }}</p>
  </div>
</template>

<script>
import { ref } from "vue"
import { auth, db } from "../firebase"
import { createUserWithEmailAndPassword } from "firebase/auth"
import { doc, setDoc } from "firebase/firestore"

export default {
  setup() {
    const regEmail = ref("")
    const regPassword = ref("")
    const error = ref("")

    const register = async () => {
      error.value = ""
      try {
        // 🔹 Crée le compte Auth
        const userCredential = await createUserWithEmailAndPassword(auth, regEmail.value, regPassword.value)
        const user = userCredential.user
        console.log("Utilisateur Auth créé :", user.uid)

        // 🔹 Ajoute dans Firestore collection users
        await setDoc(doc(db, "users", user.uid), {
          email: user.email,
          role: "user",
          isActive: true,
          createdAt: new Date()
        })
        console.log("Document users ajouté ✅")
      } catch (err) {
        console.error(err)
        error.value = err.message
      }
    }

    return { regEmail, regPassword, register, error }
  }
}
</script>
