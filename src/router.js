import { createRouter, createWebHashHistory } from "vue-router";
import store from "./store";

import Home from "./views/Home.vue";
import Produits from "./views/Produits.vue";
import Panier from "./views/Panier.vue";
import Login from "./views/Login.vue";
import Contact from "./views/Contact.vue";
import Success from "./views/Success.vue";
import AdminPanel from "./views/AdminPanel.vue";

const routes = [
  { path: "/", component: Home },
  { path: "/produits", component: Produits },
  { path: "/panier", component: Panier },
  { path: "/login", component: Login },
  { path: "/contact", component: Contact },
  { path: "/success", component: Success },
  {
    path: "/admin",
    component: AdminPanel,
    meta: { requiresAdmin: true }
  },
  // fallback pour rediriger vers home si route inconnue
  { path: "/:pathMatch(.*)*", redirect: "/" }
];

const router = createRouter({
  history: createWebHashHistory(), // 🔹 hash mode pour GitHub Pages
  routes
});

// Guard pour protéger les routes admin
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAdmin && !store.getters.isAdmin) {
    return next("/"); // redirige si pas admin
  }
  next();
});

export default router;
