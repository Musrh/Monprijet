<template>
  <div class="min-h-screen bg-gray-50">

    <!-- NAVBAR -->
    <nav class="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center">

        <!-- Logo -->
        <router-link to="/" class="text-xl font-bold tracking-tight text-gray-900">
          EasyShopping
        </router-link>

        <!-- Desktop Menu -->
        <div class="hidden md:flex items-center space-x-6">

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

          <!-- Login / User -->
          <router-link v-if="!isAuthenticated" to="/login" class="cta-btn">
            Login
          </router-link>

          <div v-if="isAuthenticated" class="relative"
               @mouseenter="dropdown=true" @mouseleave="dropdown=false">
            <button class="nav-link font-medium">{{ userEmail }}</button>

            <div v-if="dropdown" 
                 class="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2">
              <button @click="logout" class="dropdown-item text-red-500 w-full text-left">
                Logout
              </button>
            </div>
          </div>

        </div>

        <!-- Mobile Hamburger -->
        <button @click="mobileOpen=!mobileOpen" class="md:hidden">
          <svg v-if="!mobileOpen" class="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
          </svg>
          <svg v-else class="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>

      </div>

      <!-- Mobile Menu -->
      <div v-if="mobileOpen" class="md:hidden bg-white border-t border-gray-200">
        <div class="px-6 py-6 space-y-3">

          <router-link @click="mobileOpen=false" to="/" class="mobile-link">Home</router-link>
          <router-link @click="mobileOpen=false" to="/contact" class="mobile-link">Contact</router-link>
          <router-link @click="mobileOpen=false" to="/produits" class="mobile-link">Produits</router
