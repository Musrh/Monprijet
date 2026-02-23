import { createRouter, createWebHistory } from "vue-router";
import store from "./store";

import Home from "./views/Home.vue";
import Produits from "./views/Produits.vue";
import Panier from "./views/Panier.vue";
import Login from "./views/Login.vue";
import Contact from "./views/Contact.vue";
import Success from "./views/Success.vue";
import AdminPanel from "./views/AdminPanel.vue";
import Dashboard from "./views/Dashboard.vue"

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
    component: Dashboard
  },

  {
    path: "/admin",
    component:AdminPanel,
    meta: { requiresAdmin: true }
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAdmin && !store.getters.isAdmin) {
    return next("/");
  }
  next();
});

export default router;
