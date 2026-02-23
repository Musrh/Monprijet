import { createRouter, createWebHashHistory } from "vue-router";
import store from "./store";

// Import des vues
import Home from "./views/Home.vue";
import Produits from "./views/Produits.vue";
import Panier from "./views/Panier.vue";
import Login from "./views/Login.vue";
import Contact from "./views/Contact.vue";
import Success from "./views/Success.vue";
import AdminPanel from "./views/AdminPanel.vue";
import Dashboard from "./views/Dashboard.vue";

const routes = [
  { path: "/", component: Home },
  { path: "/produits", component: Produits },
  { path: "/panier", component: Panier },
  { path: "/login", component: Login },
  { path: "/contact", component: Contact },
  { path: "/success", component: Success },

  {
    path: "/dashboard",
    name: "Dashboard",
    component: Dashboard,
    meta: { requiresAuth: true } // si tu veux protéger le dashboard pour les utilisateurs connectés
  },

  {
    path: "/admin",
    component: AdminPanel,
    meta: { requiresAdmin: true }
  },

  // Fallback pour rediriger vers Home si route inconnue
  { path: "/:pathMatch(.*)*", redirect: "/" }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

// 🛡️ Guard pour protéger routes admin et dashboard
router.beforeEach((to, from, next) => {
  // Route admin
  if (to.meta.requiresAdmin && !store.getters.isAdmin) {
    return next("/"); // redirige vers la page d'accueil si pas admin
  }

  // Route dashboard
  if (to.meta.requiresAuth && !store.getters.isAuthenticated) {
    return next("/login"); // redirige vers login si pas connecté
  }

  next();
});

export default router;
