<nav class="bg-gray-800 p-4 flex flex-wrap items-center">
  <!-- Logo / titre -->
  <span class="text-white font-bold text-lg mr-4">MonProjet</span>

  <!-- Liens principaux -->
  <div class="flex flex-wrap gap-2">
    <router-link to="/" class="menu-btn">Home</router-link>
    <router-link to="/contact" class="menu-btn">Contact</router-link>
    <router-link to="/produits" class="menu-btn">Produits</router-link>
    <router-link to="/minishop" class="menu-btn">Minishop</router-link>

    <!-- Admin dropdown -->
    <div v-if="isAdmin" class="relative" @mouseenter="adminDropdown=true" @mouseleave="adminDropdown=false">
      <button class="menu-btn flex items-center gap-1">
        Admin
        <svg class="w-4 h-4 opacity-60 transition-transform" :class="{'rotate-180': adminDropdown}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
        </svg>
      </button>

      <div v-if="adminDropdown" class="absolute left-0 mt-2 w-48 bg-white text-gray-800 rounded-xl shadow-lg border border-gray-200 py-2 z-50">
        <router-link @click="adminDropdown=false" to="/admin" class="block px-4 py-2 hover:bg-gray-100">Utilisateurs</router-link>
        <router-link @click="adminDropdown=false" to="/adminproduits" class="block px-4 py-2 hover:bg-gray-100">Produits</router-link>
        <router-link @click="adminDropdown=false" to="/admin-commandes" class="block px-4 py-2 hover:bg-gray-100">Commandes</router-link>
        <router-link @click="adminDropdown=false" to="/upload" class="block px-4 py-2 hover:bg-gray-100">Upload</router-link>
      </div>
    </div>
  </div>

  <!-- Éléments à droite -->
  <div class="flex items-center ml-auto gap-2">
    <router-link to="/panier" class="menu-btn relative">
      🛒
      <span v-if="cartItemCount > 0" class="absolute -top-2 -right-3 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
        {{ cartItemCount }}
      </span>
    </router-link>

    <router-link v-if="!isAuthenticated" to="/login" class="menu-btn">Login</router-link>
    <template v-else>
      <span class="user-badge">{{ userEmail }}</span>
      <button @click="logout" class="logout-btn">Logout</button>
    </template>

    <ThemeSwitcher />
  </div>
</nav>
