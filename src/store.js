import { createStore } from "vuex";

// Produits exemples
import produit1 from "./assets/hero.png";
import produit2 from "./assets/hero.png";
import produit3 from "./assets/hero.png";

export default createStore({
  state: {
    cart: [],
    produits: [
      { id: 1, nom: "Produit A", prix: 100, image: produit1 },
      { id: 2, nom: "Produit B", prix: 200, image: produit2 },
      { id: 3, nom: "Produit C", prix: 300, image: produit3 },
    ],
  },

  getters: {
    cartItemCount: state =>
      state.cart.reduce((total, item) => total + item.quantity, 0),
    cartTotal: state =>
      state.cart.reduce((total, item) => total + item.prix * item.quantity, 0),
  },

  mutations: {
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
    },
  },

  actions: {

    initAuth({ commit }) {
  onAuthStateChanged(auth, user => {
    commit("SET_USER", user);
  });
}

    
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
    },
  },
});
