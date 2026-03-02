<template>
  <div class="home">

    <!-- Slider principal -->
    <SliderProducts :produits="produits" />

    <!-- Section produit vedette + promos -->
    <section class="flex flex-col md:flex-row gap-8 mt-8">

      <!-- Produit vedette -->
      <div class="featured w-full md:w-1/2">
        <h2 class="text-xl font-bold mb-4">Produit en vedette</h2>
        <div v-if="produitVedette" class="border p-4 rounded shadow text-center">
          <img 
            :src="produitVedette.images" 
            :alt="produitVedette.nom" 
            class="w-full h-64 object-cover rounded" 
          />
          <h3 class="font-semibold mt-2">{{ produitVedette.nom }}</h3>
          <p>{{ produitVedette.prix }} €</p>
          <p>Vendu : {{ ventes[produitVedette.id] || 0 }} fois</p>
          <button
            @click="ajouterAuPanier(produitVedette)"
            class="mt-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
          >
            Ajouter au panier
          </button>
        </div>
        <div v-else class="text-gray-500">
          Aucun produit vendu pour l'instant.
        </div>
      </div>

      <!-- Promos -->
      <div class="promos w-full md:w-1/2">
        <h2 class="text-xl font-bold mb-4">Promotions</h2>
        <div v-if="produitsPromo.length" class="relative w-full h-64 rounded shadow-lg overflow-hidden">
          <div
            class="flex transition-transform duration-500"
            :style="{ transform: `translateX(-
