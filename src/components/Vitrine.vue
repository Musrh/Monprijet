<template>
  <section class="vitrine my-8 px-4">

    <h2 class="text-2xl font-bold mb-6 text-left">
      Vitrine
    </h2>

    <div v-if="produits.length" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

      <div
        v-for="p in produits"
        :key="p.id"
        class="border rounded shadow p-4 text-center relative bg-white"
      >

        <!-- Badge promo -->
        <span
          v-if="p.promo"
          class="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 text-xs rounded"
        >
          -50%
        </span>

        <!-- Image -->
        <img
          :src="p.images && p.images[0] ? p.images[0] : '/placeholder.png'"
          :alt="p.nom"
          class="w-full h-48 object-cover rounded mb-2"
        />

        <!-- Nom -->
        <h3 class="font-semibold">
          {{ p.nom }}
        </h3>

        <!-- Prix -->
        <div class="mt-2">

          <div v-if="p.promo">
            <span class="line-through text-gray-400 mr-2">
              {{ p.prix }} €
            </span>

            <span class="text-green-600 font-bold">
              {{ prixPromo(p.prix) }} €
            </span>
          </div>

          <
