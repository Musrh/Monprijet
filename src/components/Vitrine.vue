<template>
  <section class="vitrine my-8">
    <h2 class="text-2xl font-bold mb-4 text-left">Vitrine</h2>
    
    <div v-if="produits.length" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      <div
        v-for="p in produits"
        :key="p.id"
        class="border rounded shadow p-4 text-center relative"
      >
        <img
          :src="p.images?.[0] || '/placeholder.png'"
          :alt="p.nom"
          class="w-full h-48 object-cover rounded mb-2"
        />

        <h3 class="font-semibold text-left">{{ p.nom }}</h3>

        <!-- 🔹 Prix et promo -->
        <div class="text-left">
          <template v-if="p.promo">
            <!-- Ancien prix -->
            <span class="text-gray-400 line-through mr-2">
              {{ p.prix }} €
            </span
