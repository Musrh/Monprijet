import { createStore } from "vuex"
import { auth, db } from "./firebase"

import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  collection,
  addDoc,
  serverTimestamp
} from "firebase/firestore"

import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut
} from "firebase/auth"

import produit1 from "./assets/hero.png"
import produit2 from "./assets/hero.png"
import produit3 from "./assets/hero.png"

export default createStore({
  state: {
    user: null,
    role: null,
    cart: [],

    produits: [
      { id: 1, nom: "Produit A", prix: 100, image: produit1 },
      { id: 2, nom: "Produit B", prix: 200, image: produit2 },
      { id: 3, nom: "Produit C", prix: 300, image: produit3 }
    ]
  },

  getters: {
    isAuthenticated: state => !!state.user,
    isAdmin: state => state.role === "admin",

    cartItemCount: state =>
      state.cart.reduce((total, item) => total + item.quantity, 0),

    cartTotal: state =>
      state.cart.reduce((total, item) => total + item.prix * item.quantity, 0)
  },

  mutations: {
    SET_USER(state, user) {
      state.user = user
    },

    SET_ROLE(state, role) {
      state.role = role
    },

    LOGOUT(state) {
      state.user = null
      state.role = null
      state.cart = []
    },

    ADD_TO_CART(state, produit) {
      const existing = state.cart.find(p => p.id === produit.id)
      if (existing) {
        existing.quantity++
      } else {
        state.cart.push({ ...produit, quantity: 1 })
      }
    },

    REMOVE_ITEM(state, id) {
      state.cart = state.cart.filter(p => p.id !== id)
    },

    CLEAR_CART(state) {
      state.cart = []
    },

    SET_QUANTITY(state, { id, quantity }) {
      const item = state.cart.find(p => p.id === id)
      if (item && quantity > 0) {
        item.quantity = quantity
      }
    }
  },

  actions: {
    // 🔹 Auth
    initAuth({ commit }) {
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          commit("SET_USER", user)
          const docRef = doc(db, "users", user.uid)
          const docSnap = await getDoc(docRef)
          if (docSnap.exists()) commit("SET_ROLE", docSnap.data().role)
        }
      })
    },

    async register({ commit }, { email, password }) {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const user = userCredential.user
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        role: "user",
        createdAt: serverTimestamp()
      })
      commit("SET_USER", user)
      commit("SET_ROLE", "user")
    },

    async login({ commit }, { email, password }) {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const user = userCredential.user
      commit("SET_USER", user)
      const docRef = doc(db, "users", user.uid)
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) commit("SET_ROLE", docSnap.data().role)
    },

    async logout({ commit }) {
      await signOut(auth)
      commit("LOGOUT")
    },

    // 🔹 Panier
    addToCart({ commit }, produit) {
      commit("ADD_TO_CART", produit)
    },

    removeItem({ commit }, id) {
      commit("REMOVE_ITEM", id)
    },

    clearCart({ commit }) {
      commit("CLEAR_CART")
    },

    updateQuantity({ commit }, payload) {
      commit("SET_QUANTITY", payload)
    },

    // 🔹 Checkout → enregistre commande
