import { createRouter, createWebHashHistory } from "vue-router";
import store from "./store";

import Home from "./views/Home.vue";
import Produits from "./views/Produits.vue";
import Panier from "./views/Panier.vue";
import Login from "./views/Login.vue";
import Contact from "./views/Contact.vue";
import Success from "./views/Success.vue";
import AdminCommandes from "./views/AdminCommandes.vue";
import Upload from "./views/Upload.vue";
import AdminProduits from "./views/Adminproduits.vue";

const routes = [
  { path: "/", component: Home },
  { path: "/produits", component: Produits },
  { path: "/panier", component: Panier },
  { path: "/login", component: Login },
  { path: "/contact", component: Contact },
  { path: "/success", component: Success },

  {
    path: "/admin",
    component: () => import("./views/AdminPanel.vue"),
    meta: { requiresAdmin: true }
  },
  {
    path: "/admin-commandes",
    component: AdminCommandes,
    meta: { requiresAdmin: true },
  },
  {
  path: "/upload",
  component: Upload,
  meta: { requiresAdmin: true }
},
  {
  path: "/adminproduits",
  component: AdminProduits,
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
