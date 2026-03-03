<template>
  <div class="min-h-screen bg-gray-100">

    <nav class="bg-gray-800 p-4 flex items-center justify-between">
      <!-- Menu gauche -->
      <div class="flex items-center space-x-2">
        <router-link to="/" class="menu-btn">Home</router-link>
        <router-link to="/contact" class="menu-btn">Contact</router-link>
        <router-link to="/produits" class="menu-btn">Produits</router-link>
      </div>

      <!-- Menu droite -->
      <div class="flex items-center space-x-2">
        <router-link to="/panier" class="menu-btn relative">🛒</router-link>
        <router-link v-if="!isAuthenticated" to="/login" class="menu-btn">Login</router-link>
        <span v-if="isAuthenticated" class="user-badge">{{ userEmail }}</span>
        <button v-if="isAuthenticated" @click="logout" class="logout-btn">Logout</button>

        <!-- ThemeSwitcher en dernier -->
        <ThemeSwitcher />
      </div>
    </nav>

    <router-view />
    <!-- <Vitrine /> --> <!-- commenté -->
    
  </div>
</template>
