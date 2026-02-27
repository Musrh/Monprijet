<template>
  <div class="max-w-6xl mx-auto px-6 py-12 text-center">
    <!-- Hero -->
    <h1 class="text-4xl md:text-5xl font-bold mb-6">
      🛍️ Bienvenue sur Monprijet
    </h1>

    <p class="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
      Découvrez nos produits sélectionnés avec soin.
      Qualité, simplicité et design moderne.
    </p>

    <router-link
      to="/produits"
      class="bg-green-500 text-white px-8 py-3 rounded-xl text-lg hover:bg-green-600 transition"
    >
      Voir les Produits
    </router-link>

    <!-- Section avantages -->
    <div class="grid md:grid-cols-3 gap-8 mt-16 text-left">
      <div class="bg-white p-6 rounded-2xl shadow">
        <h3 class="font-bold text-lg mb-2">🚚 Livraison rapide</h3>
        <p class="text-gray-600">Expédition rapide et sécurisée.</p>
      </div>

      <div class="bg-white p-6 rounded-2xl shadow">
        <h3 class="font-bold text-lg mb-2">💳 Paiement sécurisé</h3>
        <p class="text-gray-600">Transactions 100% sécurisées.</p>
      </div>

      <div class="bg-white p-6 rounded-2xl shadow">
        <h3 class="font-bold text-lg mb-2">⭐ Qualité garantie</h3>
        <p class="text-gray-600">Produits sélectionnés avec soin.</p>
      </div>
    </div>
  </div>
</template>
