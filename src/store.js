import { createStore } from "vuex";
import { auth, db } from "../firebase"; // 🔹 chemin relatif
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

// Exemple produits (chemins relatifs)
import produit1 from "../assets/hero.png";
import produit2 from "../assets/hero.png";
import produit3 from "../assets/hero.png";

export default createStore({
  state: {
    user: null,
    cart: [],
    produits: [
      { id: 1, nom: "Produit A", prix: 100, image: produit1 },
      { id: 2, nom: "Produit B", prix: 200, image: produit2 },
      { id: 3, nom: "Produit C", prix: 300, image: produit3 },
    ]
  },

  getters: {
    isAuthenticated: state => !!state.user,
    isAdmin: state => state.user?.role === "admin",
    userEmail: state => state.user?.email || "",
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
    },

    async register({ commit }, { email, password }) {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;

      // 🔹 Ajouter le document Firestore
      await setDoc(doc(db, "users", uid), {
        email,
        role: "user",
        isActive: true,
        createdAt: new Date().toISOString()
      });

      commit("SET_USER", {
        uid,
        email,
        role: "user",
        isActive: true
      });
    },

    async logout({ commit }) {
      await signOut(auth);
      commit("SET_USER", null);
    },

    addToCart({ commit }, produit) {
      commit("ADD_TO_CART", produit);
    },
    removeItem({ commit }, id
