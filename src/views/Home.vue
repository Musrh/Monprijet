<template>
  <div class="home">

    <!-- POPUP AU DEMARRAGE -->
    <div v-if="showPopup && promoPourPopup" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div class="bg-white p-6 rounded-lg shadow-lg text-center max-w-sm relative">
        <button @click="closePopup" class="absolute top-2 right-2 text-gray-500 hover:text-gray-700">✕</button>

        <h2 class="text-xl font-bold mb-2">Promotion spéciale !</h2>
        <img :src="promoPourPopup.images" :alt="promoPourPopup.nom" class="w-full h-48 object-cover rounded mb-4" />
        <h3 class="font-semibold">{{ promoPourPopup.nom }}</h3>
        <p><s>{{ promoPourPopup.prix }} €</s> {{ Math.round(promoPourPopup.prix * 0.5) }} €</p>

        <div class="mt-4 flex justify-center gap-2">
          <button @click="ajouterAuPanier(promoPourPopup)" class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition">
            Ajouter au panier
          </button>
          <button @click="voirPanier" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
            Voir panier
          </button>
        </div>
      </div>
    </div>

    <!-- SLIDER PRINCIPAL -->
    <SliderProducts :produits="produits" />

    <!-- SECTION PRODUIT VEDette + PROMOS -->
    <section class="flex flex-col md:flex-row gap-8 mt-8">

      <!-- PRODUIT VEDette -->
      <div class="featured w-full md:w-1/2">
        <h2 class="text-xl font-bold mb-4">Produit en vedette</h2>
        <div v-if="produitVedette" class="border p-4 rounded shadow text-center">
          <img :src="produitVedette.images" :alt="produitVedette.nom" class="w-full h-64 object-cover rounded" />
          <h3 class="font-semibold mt-2">{{ produitVedette.nom }}</h3>
          <p>{{ produitVedette.prix }} €</p>
          <p>Vendu : {{ ventes[produitVedette.id] }} fois</p>
          <button @click="ajouterAuPanier(produitVedette)" class="mt-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition">
            Ajouter au panier
          </button>
        </div>
        <div v-else class="text-gray-500">Aucun produit vendu pour l'instant.</div>
      </div>

      <!-- PRODUITS EN PROMO -->
      <div class="promos w-full md:w-1/2">
        <h2 class="text-xl font-bold mb-4">Promotions</h2>
        <div v-if="produitsPromo.length" class="relative w-full h-64 rounded shadow-lg overflow-hidden">
          <div class="flex transition-transform duration-500" :style="{ transform: `translateX(-${currentPromoIndex * 100}%)` }">
            <div v-for="p in produitsPromo" :key="p.id" class="w-full flex-shrink-0 p-2 text-center">
              <img :src="p.images" :alt="p.nom" class="w-full h-48 object-cover rounded" />
              <h3 class="font-semibold mt-2">{{ p.nom }}</h3>
              <p><s>{{ p.prix }} €</s> {{ Math.round(p.prix * 0.5) }} €</p>
              <span class="badge bg-red-500 text-white px-2 py-1 rounded">Promo 50%</span>
              <button @click="ajouterAuPanier(p)" class="mt-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition">
                Ajouter au panier
