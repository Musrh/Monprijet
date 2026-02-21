// store.js
import { createStore } from "vuex";

export default createStore({
  state: {
    cart: [],
    produits: [
      { id: 1, nom: "Produit A", prix: 100, image: "hero.png" },
      { id: 2, nom: "Produit B", prix: 200, image: "hero.png" },
      { id: 3, nom: "Produit C", prix: 300, image: "hero.png" }
    ]
  },

  getters: {
    cartItemCount: state => state.cart.reduce((total, item) => total + item.quantity, 0),
    cartTotal: state => state.cart.reduce((total, item) => total + item.prix * item.quantity, 0)
  },

  mutations: {
    // Ajouter un produit au panier
    ADD_TO_CART(state, produit) {
      const existing = state.cart.find(p => p.id === produit.id);
      if (existing) {
        existing.quantity++;
      } else {
        state.cart.push({ ...produit, quantity: 1 });
      }
    },

    // Mettre à jour la quantité
    SET_QUANTITY(state, { id, quantity }) {
      const item = state.cart.find(p => p.id === id);
      if (item && quantity > 0) {
        item.quantity = quantity;
      }
    },

    // Supprimer un produit
    REMOVE_ITEM(state, id) {
      state.cart =
