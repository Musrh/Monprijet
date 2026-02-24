import { createRouter, createWebHashHistory } from "vue-router";
import store from "./store";

const routes = [
  { path: "/", component: () => import("./views/Home.vue") },
  { path: "/produits", component: () => import("./views/Produits.vue") },
  { path: "/panier", component: () => import("./views/Panier.vue") },
  { path: "/login", component: () => import("./views/Login.vue") },
  { path: "/contact", component: () => import("./views/Contact.vue") },
  { path: "/success", component: () => import("./views/Success.vue") },
  {
    path: "/admin",
    component: () => import("./views/AdminPanel.vue"),
    meta: { requiresAdmin: true }
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

// 🔹 Protection route admin
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAdmin && !store.getters.isAdmin) {
    return next("/login");  // ou "/" si tu préfères
  }
  next();
});

export default router;
