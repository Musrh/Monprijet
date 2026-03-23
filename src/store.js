import { createStore } from "vuex";
import { auth, db } from "./firebase";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendEmailVerification,
  sendPasswordResetEmail
} from "firebase/auth";
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp
} from "firebase/firestore";

import produit1 from "./assets/hero.png";
import produit2 from "./assets/hero.png";
import produit3 from "./assets/hero.png";

export default createStore({
  state: {
    user: null,
    cart: [],
    paypalAdresseLivraison: "", // 🆕 pour PayPal
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
      const cartId = `${produit.id}-${produit.taille || ""}-${produit.couleur || ""}`;
      const existing = state.cart.find(p => p.cartId === cartId);

      if (existing) {
        existing.quantity++;
      } else {
        state.cart.push({
          cartId,
          id: produit.id,
          nom: produit.nom,
          prix: Number(produit.prix),
          images: produit.images || [],
          taille: produit.taille || null,
          couleur: produit.couleur || null,
          quantity: 1
        });
      }
    },

    REMOVE_ITEM(state, cartId) {
      state.cart = state.cart.filter(p => p.cartId !== cartId);
    },

    SET_QUANTITY(state, { cartId, quantity }) {
      const item = state.cart.find(p => p.cartId === cartId);
      if (item && quantity > 0) item.quantity = quantity;
    },

    CLEAR_CART(state) {
      state.cart = [];
      state.paypalAdresseLivraison = ""; // 🆕 réinitialisation
    },

    SET_PAYPAL_ADRESSE(state, adresse) {
      state.paypalAdresseLivraison = adresse; // 🆕 stocke l'adresse avant PayPal
    }
  },

  actions: {

    // 🔥 INIT AUTH
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
                role: data.role.trim(),
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

    async login({ commit }, { email, password }) {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await user.reload();
      if (!user.emailVerified) {
        await signOut(auth);
        throw new Error("Veuillez vérifier votre email");
      }

      const snap = await getDoc(doc(db, "users", user.uid));
      if (snap.exists()) {
        const data = snap.data();

        if (!data.isActive) {
          await signOut(auth);
          throw new Error("Compte désactivé");
        }

        commit("SET_USER", {
          uid: user.uid,
          email: data.email,
          role: data.role.trim(),
          isActive: data.isActive
        });
      }
    },

    async register(_, { email, password }) {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await sendEmailVerification(user);

      await setDoc(doc(db, "users", user.uid), {
        email,
        role: "user",
        isActive: true,
        createdAt: serverTimestamp()
      });

      await signOut(auth);
    },

    async resetPassword(_, email) {
      await sendPasswordResetEmail(auth, email);
    },

    async logout({ commit }) {
      await signOut(auth);
      commit("SET_USER", null);
    },

    addToCart({ commit }, produit) {
      commit("ADD_TO_CART", produit);
    },

    removeItem({ commit }, cartId) {
      commit("REMOVE_ITEM", cartId);
    },

    updateQuantity({ commit }, payload) {
      commit("SET_QUANTITY", payload);
    },

    clearCart({ commit }) {
      commit("CLEAR_CART");
    },

    // 🆕 pour PayPal
    setPaypalAdresse({ commit }, adresse) {
      commit("SET_PAYPAL_ADRESSE", adresse);
    }
  }
});
