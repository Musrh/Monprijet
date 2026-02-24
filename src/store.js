import { createStore } from "vuex";
import { auth, db } from "./firebase";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut
} from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";

export default createStore({
  state: {
    user: null
  },

  getters: {
    isAuthenticated: state => !!state.user,
    isAdmin: state => state.user?.role === "admin",
    userEmail: state => state.user?.email || ""
  },

  mutations: {
    SET_USER(state, user) {
      state.user = user;
    }
  },

  actions: {
    // 🔹 Initialise l'utilisateur depuis Firestore
    async initAuth({ commit }) {
      return new Promise(resolve => {
        onAuthStateChanged(auth, async (user) => {
          if (user) {
            const snap = await getDoc(doc(db, "users", user.uid));
            commit("SET_USER", {
              uid: user.uid,
              email: user.email,
              role: snap.exists() ? snap.data().role : "user",
              isActive: snap.exists() ? snap.data().isActive : true
            });
          } else {
            commit("SET_USER", null);
          }
          resolve();
        });
      });
    },

    // 🔹 Login
    async login({ commit }, { email, password }) {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const snap = await getDoc(doc(db, "users", user.uid));

      commit("SET_USER", {
        uid: user.uid,
        email: user.email,
        role: snap.exists() ? snap.data().role : "user",
        isActive: snap.exists() ? snap.data().isActive : true
      });

      return {
        role: snap.exists() ? snap.data().role : "user",
        isActive: snap.exists() ? snap.data().isActive : true
      };
    },

    // 🔹 Register
    async register({ commit }, { email, password }) {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;

      // Ajouter dans Firestore avec isActive = true
      await setDoc(doc(db, "users", uid), {
        email,
        role: "user",
        isActive: true,
        createdAt: serverTimestamp()
      });

      commit("SET_USER", {
        uid,
        email,
        role: "user",
        isActive: true
      });
    },

    // 🔹 Logout
    async logout({ commit }) {
      await signOut(auth);
      commit("SET_USER", null);
    }
  }
});
