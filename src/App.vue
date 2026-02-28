<router-link to="/" class="nav-link">Home</router-link>
<router-link to="/contact" class="nav-link">Contact</router-link>
<router-link to="/produits" class="nav-link">Produits</router-link>

<router-link v-if="isAdmin" to="/admin" class="nav-link">Admin</router-link>
<router-link v-if="isAdmin" to="/admin-commandes" class="nav-link">Admin-Commandes</router-link>
<router-link v-if="isAdmin" to="/upload" class="nav-link">UploadProduit</router-link>
<router-link v-if="isAdmin" to="/adminproduits" class="nav-link">Admin-Produits</router-link>

<router-link to="/panier" class="relative nav-link">
  🛒
  <span v-if="cartItemCount > 0" 
        class="absolute -top-2 -right-3 bg-black text-white text-xs px-2 py-0.5 rounded-full">
    {{ cartItemCount }}
  </span>
</router-link>
