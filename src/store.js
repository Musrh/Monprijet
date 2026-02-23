import { createStore } from "vuex";
import { auth, db } from "./firebase";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

export default createStore({
  state: {
    user: null,
    cart: []
  },

  getters: {
    isAuthenticated: state => !!state.user,
    isAdmin: state => state.user?.role === "admin",
    userEmail: state => state.user?.email || "",
    isActive: state => state.user?.isActive ?? true,
    cartItemCount: state => state.cart.reduce((total, item) => total + item.quantity, 0),
    cartTotal: state => state.cart.reduce((total, item) => total + item.prix * item.quantity, 0)
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
    async initAuth({ commit }) {
      return new Promise(resolve => {
        onAuthStateChanged(auth, async user => {
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

    async login({ commit }, { email, password }) {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const snap = await getDoc(doc(db, "users", user.uid));
      const role = snap.exists() ? snap.data().role : "user";
      const isActive = snap.exists() ? snap.data().isActive : true;

      commit("SET_USER", {
        uid: user.uid,
        email: user.email,
        role,
        isActive
      });

      return { role, isActive };
    },

    async register({ commit }, { email, password }) {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      // 🔹 Crée le document Firestore pour le nouvel utilisateur
      await setDoc(doc(db, "users", userCredential.user.uid), {
        email,
        role: "user",
        isActive: true,
        createdAt: new Date()
      });

      commit("SET_USER", {
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        role: "user",
        isActive: true
      });

      return { role: "user", isActive: true };
    },

    async logout({ commit }) {
      await signOut(auth);
      commit("SET_USER", null);
    },

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
