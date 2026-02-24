import { createStore } from "vuex";
import { auth, db } from "./firebase";

import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut
} from "firebase/auth";

import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp
} from "firebase/firestore";

// Images produits
import produit1 from "./assets/hero.png";
import produit2 from "./assets/hero.png";
import produit3 from "./assets/hero.png";

export default createStore({
  state: {
    user: null,
    cart: [],
    produits: [
      { id: 1, nom: "Produit A", prix: 100, image: produit1 },
      { id: 2, nom: "Produit B", prix: 200, image: produit2 },
      { id: 3, nom: "Produit C", prix: 300, image: produit3 }
    ]
  },

  getters: {
    isAuthenticated: state => !!state.user,
    isAdmin: state => state.user?.role === "admin",
    userEmail: state => state.user?.email || "",
    isActive: state => state.user?.isActive,
    cartItemCount: state =>
      state.cart.reduce((total, item) => total + item.quantity, 0),
    cartTotal: state =>
      state.cart.reduce((total, item) => total + item.prix * item.quantity, 0)
  },

  mutations: {
    SET_USER(state, user) {
      state.user = user;
    },
    ADD_TO_CART(state, produit) {
      const existing = state.cart.find(p => p.id === produit.id);
      if (existing) existing.quantity++;
      else state.cart.push({ ...produit, quantity: 1 });
    },
    REMOVE_ITEM(state, id) {
      state.cart = state.cart.filter(p => p.id !== id);
    },
    SET_QUANTITY(state, { id, quantity }) {
      const item = state.cart.find(p => p.id === id);
      if (item && quantity > 0) item.quantity = quantity;
    },
    CLEAR_CART(state) {
      state.cart = [];
    }
  },

  actions: {

    // 🔥 Initialisation au démarrage
    initAuth({ commit }) {
      return new Promise(resolve => {
        onAuthStateChanged(auth, async user => {
          if (user) {
            const snap = await getDoc(doc(db, "users", user.uid));

            if (snap.exists()) {
              const data = snap.data();

              commit("SET_USER", {
                uid: user.uid,
                email: data.email,
                role: data.role,
                isActive: data.isActive
              });
            }
          } else {
            commit("SET_USER", null);
          }

          resolve();
        });
      });
    },

    // 🔐 LOGIN
    async login({ commit }, { email, password }) {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;
      const snap = await getDoc(doc(db, "users", user.uid));

      if (snap.exists()) {
        const data = snap.data();

        // 🔒 Bloquer si compte désactivé
        if (!data.isActive) {
          await signOut(auth);
          throw new Error("Compte désactivé");
        }

        commit("SET_USER", {
          uid: user.uid,
          email: data.email,
          role: data.role,
          isActive: data.isActive
        });
      }
    },

    // 📝 REGISTER
    async register({ commit }, { email, password }) {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const uid = userCredential.user.uid;

      await setDoc(doc(db, "users", uid), {
        email: email,
        role: "user",
        isActive: true,
        createdAt: serverTimestamp()
      });

      commit("SET_USER", {
        uid: uid,
        email: email,
        role: "user",
        isActive: true
      });
    },

    // 🚪 LOGOUT
    async logout({ commit }) {
      await signOut(auth);
      commit("SET_USER", null);
    },

    // 🛒 PANIER
    addToCart({ commit }, produit) {
      commit("ADD_TO_CART", produit);
    },
    removeItem({ commit }, id) {
      commit("REMOVE_ITEM", id);
    },
    updateQuantity({ commit }, payload) {
      commit("SET_QUANTITY", payload);
    },
    clearCart({ commit }) {
      commit("CLEAR_CART");
    }
  }
});
