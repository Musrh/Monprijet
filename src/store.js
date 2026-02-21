import { createStore } from "vuex";
import { auth, db } from "./firebase";
import { doc, getDoc, setDoc, addDoc, serverTimestamp } from "firebase/firestore";
import { onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";

import produit1 from "./assets/hero.png";
import produit2 from "./assets/hero.png";
import produit3 from "./assets/hero.png";

export default createStore({
  state: {
    user: null,
    role: null,
    cart: [],
    produits: [
      { id: 1, nom: "Produit A", prix: 100, image: produit1 },
      { id: 2, nom: "Produit B", prix: 200, image: produit2 },
      { id: 3, nom: "Produit C", prix: 300, image: produit3 },
    ]
  },

  getters: {
    cartItemCount: state => state.cart.reduce((t, item) => t + item.quantity, 0),
    cartTotal: state => state.cart.reduce((t, item) => t + item.prix * item.quantity, 0)
  },

  mutations: {
    SET_USER(state, user) { state.user = user },
    SET_ROLE(state, role) { state.role = role },
    ADD_TO_CART(state, produit) {
      const existing = state.cart.find(p => p.id === produit.id);
      if (existing) existing.quantity++;
      else state.cart.push({ ...produit, quantity: 1 });
    },
    SET_QUANTITY(state, { id, quantity }) {
      const item = state.cart.find(p => p.id === id);
      if (item && quantity > 0) item.quantity = quantity;
    },
    REMOVE_ITEM(state, id) { state.cart = state.cart.filter(p => p.id !== id) },
    CLEAR_CART(state) { state.cart = [] }
  },

  actions: {
    initAuth({ commit }) {
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          commit("SET_USER", user);
          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) commit("SET_ROLE", docSnap.data().role);
        }
      });
    },

    addToCart({ commit }, produit) { commit("ADD_TO_CART", produit) },
    updateQuantity({ commit }, payload) { commit("SET_QUANTITY", payload) },
    removeItem({ commit }, id) { commit("REMOVE_ITEM", id) },

    async checkout({ state, getters }) {
      if (!state.user) return alert("Vous devez être connecté");
      if (state.cart.length === 0) return alert("Panier vide");

      try {
        await addDoc(collection(db, "orders"), {
          userId: state.user.uid,
          email: state.user.email,
          items: state.cart,
          total: getters.cartTotal,
          status: "en attente",
          createdAt: serverTimestamp()
        });
        alert("Commande enregistrée ✅");
        commit("CLEAR_CART");
      } catch (err) {
        console.error(err);
        alert("Erreur commande");
      }
    }
  }
});
