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
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "@/firebase";

export default {
  data() {
    return {
      regEmail: "",
      regPassword: "",
      logEmail: "",
      logPassword: "",
      error: ""
    };
  },
  methods: {
    // ================= REGISTER =================
    async register() {
      try {
        // 1️⃣ Créer l'utilisateur dans Firebase Auth
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          this.regEmail,
          this.regPassword
        );
        const user = userCredential.user;

        // 2️⃣ Ajouter le document dans Firestore collection 'users'
        await setDoc(doc(db, "users", user.uid), {
          email: user.email,
          role: "user",
          createdAt: new Date(),
          isActive: true
        });

        // 3️⃣ Redirection après inscription
        this.$router.push("/dashboard");

      } catch (err) {
        this.error = err.message;
        console.error("Erreur register :", err);
      }
    },

    // ================= LOGIN =================
    async login() {
      try {
        // 1️⃣ Authentification Firebase
        const userCredential = await signInWithEmailAndPassword(
          auth,
          this.logEmail,
          this.logPassword
        );
        const user = userCredential.user;

        // 2️⃣ Vérifier si le compte est actif
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (!userDoc.exists()) {
          this.error = "Utilisateur non trouvé dans Firestore";
          await auth.signOut();
          return;
        }

        const userData = userDoc.data();
        if (userData.isActive === false) {
          this.error = "Compte désactivé. Contactez l'administrateur.";
          await auth.signOut();
          return;
        }

        // 3️⃣ Redirection après login
        this.$router.push("/dashboard");

      } catch (err) {
        this.error = err.message;
        console.error("Erreur login :", err);
      }
    }
  }
};
</script>
