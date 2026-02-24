import { createRouter, createWebHashHistory } from "vue-router";
import store from "./store";

// Import des vues
import Home from "./views/Home.vue";
import Produits from "./views/Produits.vue";
import Panier from "./views/Panier.vue";
import Login from "./views/Login.vue";
import Contact from "./views/Contact.vue";
import Success from "./views/Success.vue";
import Dashboard from "./views/Dashboard.vue";
import AdminPanel from "./views/AdminPanel.vue";

const routes = [
  { path: "/", component: Home },
  { path: "/produits", component: Produits },
  { path: "/panier", component: Panier },
  { path: "/login", component: Login },
  { path: "/contact", component: Contact },
  { path: "/success", component: Success },
  { path: "/dashboard", component: Dashboard },

  // Route admin protégée
  {
    path: "/admin",
    component: AdminPanel,
    meta: { requiresAdmin: true }
  },

  // Redirection pour toute route inconnue
  { path: "/:catchAll(.*)", redirect: "/" }
];

const router = createRouter({
  history: createWebHashHistory(), // ⚡ important pour GitHub Pages
  routes
});

// 🔹 Protection route admin
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAdmin && !store.getters.isAdmin) {
    return next("/"); // redirige vers home si pas admin
  }
  next();
});

export default router;
