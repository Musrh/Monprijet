<template>
  <div class="home">

    <!-- Popup au démarrage avec produit promo -->
    <div
      v-if="showPopup && promoPourPopup"
      class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
    >
      <div class="bg-white p-6 rounded-lg shadow-lg text-center max-w-sm relative">
        <button
          @click="closePopup"
          class="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >✕</button>

        <h2 class="text-xl font-bold mb-2">Promotion spéciale !</h2>
        <img
          :src="promoPourPopup.images"
          :alt="promoPourPopup.nom"
          class="w-full h-48 object-cover rounded mb-4"
        />
        <h3 class="font-semibold">{{ promoPourPopup.nom }}</h3>
        <p><s>{{ promoPourPopup.prix }} €</s> {{ Math.round(promoPourPopup.prix * 0.5) }} €</p>
        <button
          @click="ajouterAuPanier(promoPourPopup)"
          class="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
        >
          Ajouter au panier
        </button>
      </div>
    </div>

    <!-- Slider principal -->
    <SliderProducts :produits="produits" />

    <!-- Section produit vedette + promos -->
    <section class="flex flex-col md:flex-row gap-8 mt-8">

      <!-- Produit vedette -->
      <div class="featured w-full md:w-1/2">
        <h2 class="text-xl font-bold mb-4">Produit en vedette</h2>
        <div v-if="produitVedette" class="border p-4 rounded shadow text-center">
          <img :src="produitVedette.images" :alt="produitVedette.nom" class="w-full h-64 object-cover rounded" />
          <h3 class="font-semibold mt-2">{{ produitVedette.nom }}</h3>
          <p>{{ produitVedette.prix }} €</p>
          <p>Vendu : {{ ventes[produitVedette.id] || 0 }} fois</p>
          <button
            @click="ajouterAuPanier(produitVedette)"
            class="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg
