<template>
  <div class="bg-white border-b">

    <div class="max-w-6xl mx-auto flex items-center justify-between py-4 px-4">

      <!-- Logo -->
      <div class="flex items-center">
        <img src="/logo.png" class="h-10" />
      </div>

      <!-- Recherche -->
      <div class="flex items-center w-1/2 border rounded overflow-hidden">

        <!-- Catégories -->
        <select class="px-3 py-2 bg-gray-100 border-r outline-none">
          <option>Catégories</option>
          <option>Electronique</option>
          <option>Accessoires</option>
        </select>

        <!-- Input -->
        <input
          type="text"
          placeholder="Vous cherchez quoi ?"
          class="flex-1 px-3 py-2 outline-none"
        />

        <!-- Bouton -->
        <button class="bg-purple-600 text-white px-4 py-2 hover:bg-purple-700">
          🔍
        </button>

      </div>

      <!-- Panier -->
      <div class="flex items-center gap-2">

        <div class="relative">
          👜
          <span
            class="absolute -top-2 -right-2 bg-purple-600 text-white text-xs px-1 rounded-full"
          >
            0
          </span>
        </div>

        <div>
          <p class="text-sm">Mon Panier</p>
          <p class="font-bold">0,00 MAD</p>
        </div>

      </div>

    </div>

  </div>
</template>
