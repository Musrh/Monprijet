<template>
  <header class="bg-white border-b shadow-md relative z-20">

    <!-- Logo + ThemeSwitcher -->
    <div class="flex items-center justify-between px-4 py-3 max-w-7xl mx-auto">
      <div class="flex items-center gap-3">
        <img src="../assets/hero.png" alt="logo" class="h-10" />
        <span class="font-bold text-lg">EasyShoping</span>
      </div>

      <ThemeSwitcher />
    </div>

    <!-- Barre catégories + recherche -->
    <div class="bg-gray-100 py-2">
      <div class="max-w-7xl mx-auto flex flex-col gap-2 px-4">

        <!-- Catégories -->
        <div class="flex gap-2 flex-wrap">
          <select
            v-model="categorie"
            @change="filterCategorie"
            class="border rounded px-3 py-2 bg-white"
          >
            <option value="">Toutes catégories</option>
            <option value="phones">Téléphones</option>
            <option value="pc">PC</option>
            <option value="accessoires">Accessoires</option>
          </select>
        </div>

        <!-- Recherche (ligne en dessous + largeur réduite) -->
        <div class="flex justify-center mt-1">
          <div class="flex gap-2 w-full max-w-md">

            <input
              v-model="search"
              type="text"
              placeholder="Vous cherchez quoi ?..."
              class="w-full border rounded px-3 py-2"
            />

            <button
              @click="rechercher"
              class="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
            >
              🔍
            </button>

          </div>
        </div>

      </div>
    </div>

  </header>
</template>
