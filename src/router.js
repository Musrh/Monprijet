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
import AdminProduits from "./views/AdminProduits.vue";
import Minishop from "./views/Minishop.vue";
import PasswordReset from "./views/PasswordReset.vue";
import Test3D from "./views/Test3D.vue";
import Conditions from "./views/Conditions.vue";
import Details from "./views/Details.vue"; // ✅ CORRIGÉ

import SendToPrintful from "./views/SendToPrintful.vue"; 

import AffiliateProducts from "./views/AffiliateProducts.vue";

import SearchResults from "../views/SearchResults.vue";



const routes = [
  { path: "/", component: Home },
  { path: "/produits", component: Produits },
  { path: "/panier", component: Panier },
  { path: "/login", component: Login },
  { path: "/contact", component: Contact },
  { path: "/success", component: Success },
  { path: "/minishop", component: Minishop },

  {
  path: "/categorie/:slug",
  name: "CategoryResults",
  component: () => import("./views/CategoryResults.vue")
},
  
  {
  path: "/search",
  name: "SearchResults",
  component: SearchResults
  },
  
{ path: "/affiliateproducts", component: AffiliateProducts },
  
{
  path: "/paypal-success",
  name: "PayPalSuccess",
  component: () => import("./views/SuccessPayPal.vue")
},

  
 
  { path: "/sendtoprintful", 
   component: SendToPrintful,
   meta: { requiresAdmin: true }
  },

  // ✅ ROUTE DETAILS CORRIGÉE
  {
    path: "/details/:slug",
    name: "Details",
    component: Details
  },

  { path: "/conditions", component: Conditions },

  {
    path: "/test3d",
    name: "test3d",
    component: Test3D
  },

  {
    path: "/admin",
    component: () => import("./views/AdminPanel.vue"),
    meta: { requiresAdmin: true }
  },
  {
    path: "/admin-commandes",
    component: AdminCommandes,
    meta: { requiresAdmin: true }
  },
  {
    path: "/upload/:id?",
    component: Upload,
    meta: { requiresAdmin: true }
  },
  {
    path: "/adminproduits",
    component: AdminProduits,
    meta: { requiresAdmin: true }
  },
  {
    path: "/password-reset",
    component: PasswordReset
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

router.beforeEach((to, from, next) => {

  // 🔒 protection admin
  if (to.meta.requiresAdmin && !store.getters.isAdmin) {
    alert("Accès réservé à l'administrateur");
    return next("/");
  }

  next();
});

export default router;
