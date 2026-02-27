// store.js
import { createStore } from "vuex";
import { auth, db } from "@/firebase"; // ton fichier firebase.js
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

export default createStore({
  state: {
    user: null,
    cart: [],
  },
  getters: {
    isAuthenticated: (state) => !!state.user,
    userEmail: (state) => state.user?.email || "",
    isAdmin: (state) => state.user?.role === "admin",
    cartItemCount: (state) => state.cart.reduce((sum, item) => sum + item.quantity, 0),
  },
  mutations: {
    SET_USER(state, user) {
      state.user = user;
    },
    SET_CART(state, cart) {
      state.cart = cart;
    },
  },
  actions: {
    initAuth({ commit }) {
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          // 🔹 Récupérer le document Firestore pour avoir role + isActive
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            commit("SET_USER", {
              uid: user.uid,
              email: user.email,
              ...userDoc.data(), // role, isActive, etc.
            });
          } else {
            commit("SET_USER", {
              uid: user.uid,
              email: user.email,
            });
          }
        } else {
          commit("SET_USER", null);
        }
      });
    },

    logout({ commit }) {
      auth.signOut();
      commit("SET_USER", null);
    },

    // Cart actions si nécessaire
    addItem({ state, commit }, item) {
      const existing = state.cart.find((i) => i.id === item.id);
      if (existing) {
        existing.quantity += item.quantity;
      } else {
        state.cart.push(item);
      }
      commit("SET_CART", [...state.cart]);
    },
    removeItem({ state, commit }, id) {
      commit("SET_CART", state.cart.filter((i) => i.id !== id));
    },
    updateQuantity({ state, commit }, { id, quantity }) {
      const item = state.cart.find((i) => i.id === id);
      if (item) item.quantity = quantity;
      commit("SET_CART", [...state.cart]);
    },
  },
});
