<template>
  <div class="min-h-screen bg-gray-100 flex flex-col items-center justify-center text-center px-6">
    
    <h1 class="text-4xl font-bold mb-6">
      🛍️ Bienvenue sur Monprijet
    </h1>

    <p class="text-gray-600 max-w-xl mb-8">
      Découvrez nos meilleurs produits avec un design moderne et simple.
    </p>

    <router-link
      to="/produits"
      class="bg-green-500 text-white px-8 py-3 rounded-xl hover:bg-green-600 transition"
    >
      Voir les produits
    </router-link>

  </div>
</template>
