import { createStore } from "vuex";
import { auth, db } from "./firebase";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

// Produits exemples
import produit1 from "./assets/hero.png";
import produit2 from "./assets/hero.png";
import produit3 from "./assets/hero.png";

export default createStore({
  state: {
    user: null,  // 🔥 contient uid, email, role
    cart: [],
    produits: [
      { id: 1, nom: "Produit A", prix: 100, image: produit1 },
      { id: 2, nom: "Produit B", prix: 200, image: produit2 },
      { id: 3, nom: "Produit C", prix: 300, image: produit3 },
    ],
  },

  getters: {
    isAuthenticated: state => !!state.user,
    isAdmin: state => state.user?.role === "admin",
    userEmail: state => state.user?.email || "",
    cartItemCount: state =>
      state.cart.reduce((total, item) => total + item.quantity, 0),
    cartTotal: state =>
      state.cart.reduce((total, item) => total + item.prix * item.quantity, 0),
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
      const item
