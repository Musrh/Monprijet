import { createRouter, createWebHistory } from "vue-router"
import store from "./store"

import Home from "./views/Home.vue"
import Produits from "./views/Produits.vue"
import Panier from "./views/Panier.vue"
import Login from "./views/Login.vue"
import AdminCommandes from "./views/AdminCommandes.vue"
import Contact from "./views/Contact.vue"
import Success from "./views/Success.vue"


const routes = [
  { path: "/", component: Home },
  { path: "/produits", component: Produits },
  { path: "/panier", component: Panier },
  { path: "/login", component: Login },
  { path: "/contact", component: Contact },
  
  {
  path: '/admin',
  name: 'AdminPanel',
  component: () => import('./views/AdminPanel.vue'),
  beforeEnter: (to, from, next) => {
    const currentUser = auth.currentUser;
    if (!currentUser) return next('/login');
    const userDoc = getDoc(doc(db, 'users', currentUser.uid));
    userDoc.then(docSnap => {
      if (docSnap.exists() && docSnap.data().role === 'admin') next();
      else next('/'); // redirige si pas admin
    });
  }
},
  
  {
    path: "/admin-commandes",
    component: AdminCommandes,
    meta: { requiresAdmin: true }
  },
  { path: "/success", component: Success }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {

  if (to.meta.requiresAdmin && !store.getters.isAdmin) {
    return next("/")
  }

  if (to.meta.requiresAuth && !store.getters.isAuthenticated) {
  return next("/login")
  }

  next()
})

export default router
