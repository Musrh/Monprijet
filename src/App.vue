<!-- Admin Dropdown -->
<div v-if="isAdmin" class="relative" @mouseenter="adminDropdown=true" @mouseleave="adminDropdown=false">
  <button class="nav-link flex items-center gap-1 font-medium">
    Admin
    <svg class="w-4 h-4 opacity-60 group-hover:rotate-180 transition-transform"
         fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M19 9l-7 7-7-7"></path>
    </svg>
  </button>

  <div v-if="adminDropdown"
       class="absolute left-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
    <!-- Page principale Admin -->
    <router-link @click="adminDropdown=false" to="/admin" class="dropdown-item">Admin (Utilisateurs)</router-link>
    <!-- Sous-pages -->
    <router-link @click="adminDropdown=false" to="/adminproduits" class="dropdown-item">Admin-Produits</router-link>
    <router-link @click="adminDropdown=false" to="/admin-commandes" class="dropdown-item">Admin-Commandes</router-link>
    <router-link @click="adminDropdown=false" to="/upload" class="dropdown-item">UploadProduit</router-link>
  </div>
</div>
