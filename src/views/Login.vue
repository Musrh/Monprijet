<template>
  <div>
    <h2>Authentication</h2>

    <!-- REGISTER -->
    <div>
      <h3>Register</h3>
      <input v-model="regEmail" placeholder="Email" />
      <input v-model="regPassword" type="password" placeholder="Password" />
      <button @click="register">Register</button>
    </div>

    <hr />

    <!-- LOGIN -->
    <div>
      <h3>Login</h3>
      <input v-model="logEmail" placeholder="Email" />
      <input v-model="logPassword" type="password" placeholder="Password" />
      <button @click="login">Login</button>
    </div>

    <p v-if="error" style="color:red">{{ error }}</p>
  </div>
</template>

<script>
import { ref } from "vue"
import { auth, db } from "@/firebase"
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword 
} from "firebase/auth"
import { doc, setDoc } from "firebase/firestore"

export default {
  setup(_, { emit }) {
    const regEmail = ref("")
    const regPassword = ref("")
    const logEmail = ref("")
    const logPassword = ref("")
    const error = ref("")

    // 🔹 REGISTER
    const register = async () => {
      error.value = ""
      try {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          regEmail.value,
          regPassword.value
        )

        const user = userCredential.user

        // Ajouter dans Firestore
        await setDoc(doc(db, "users", user.uid), {
          email: user.email,
          role: "user",
          isActive: true,
          createdAt: new Date()
        })

        window.location.href = "/dashboard"

      } catch (err) {
        error.value = err.message
      }
    }

    // 🔹 LOGIN
    const login = async () => {
      error.value = ""
      try {
        await signInWithEmailAndPassword(
          auth,
          logEmail.value,
          logPassword.value
        )

        window.location.href = "/dashboard"

      } catch (err) {
        error.value = err.message
      }
    }

    return {
      regEmail,
      regPassword,
      logEmail,
      logPassword,
      register,
      login,
      error
    }
  }
}
</script>
