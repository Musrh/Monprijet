<nav class="bg-gray-800 p-4 text-white">
  <div class="flex justify-between items-center">

    <!-- Logo -->
    <router-link to="/" class="font-bold text-lg">
      MonSite
    </router-link>

    <!-- Bouton hamburger (mobile) -->
    <button 
      @click="mobileMenu = !mobileMenu"
      class="md:hidden text-2xl"
    >
      ☰
    </button>

    <!-- MENU DESKTOP -->
    <div class="hidden md:flex items-center space-x-2">

      <router-link to="/" class="menu-btn">Home</router-link>
      <router-link to="/contact" class="menu-btn">Contact</router-link>
      <router-link to="/produits" class="menu-btn">Produits</router-link>
      <router-link to="/minishop" class="menu-btn">Minishop</router-link>

      <!-- Admin -->
      <div v-if="isAdmin" class="relative"
           @mouseenter="adminDropdown=true"
           @mouseleave="adminDropdown=false">

        <button class="menu-btn flex items-center gap-1">
          Admin
        </button>

        <div v-if="adminDropdown"
             class="absolute left-0 mt-2 w-48 bg-white text-gray-800 rounded-xl shadow-lg py-2 z-50">

          <router-link to="/admin" class="dropdown-link">Admin Utilisateurs</router-link>
          <router-link to="/adminproduits" class="dropdown-link">Admin Produits</router-link>
          <router-link to="/admin-commandes" class="dropdown-link">Admin Commandes</router-link>
          <router-link to="/upload" class="dropdown-link">UploadProduit</router-link>
        </div>
      </div>

      <!-- Panier -->
      <router-link to="/panier" class="menu-btn relative">
        🛒
        <span v-if="cartItemCount > 0"
              class="absolute -top-2 -right-3 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
          {{ cartItemCount }}
        </span>
      </router-link>

      <!-- Login / Logout -->
      <router-link v-if="!isAuthenticated" to="/login" class="menu-btn">
        Login
      </router-link>

      <template v-if="isAuthenticated">
        <span class="user-badge">{{ userEmail }}</span>
        <button @click="logout" class="logout-btn">Logout</button>
      </template>

      <ThemeSwitcher />

    </div>
  </div>

  <!-- MENU MOBILE -->
  <div v-if="mobileMenu" class="md:hidden mt-4 space-y-2">

    <router-link @click="mobileMenu=false" to="/" class="mobile-link">Home</router-link>
    <router-link @click="mobileMenu=false" to="/contact" class="mobile-link">Contact</router-link>
    <router-link @click="mobileMenu=false" to="/produits" class="mobile-link">Produits</router-link>
    <router-link @click="mobileMenu=false" to="/minishop" class="mobile-link">Minishop</router-link>
    <router-link @click="mobileMenu=false" to="/panier" class="mobile-link">
      Panier ({{ cartItemCount }})
    </router-link>

    <router-link v-if="!isAuthenticated"
                 @click="mobileMenu=false"
                 to="/login"
                 class="mobile-link">
      Login
    </router-link>

    <div v-if="isAuthenticated" class="mobile-link">
      {{ userEmail }}
      <button @click="logout" class="ml-2 text-red-500">Logout</button>
    </div>

  </div>
</nav>
