<template>
  <div class="home container mx-auto p-4 space-y-8">

    <!-- Slider des produits -->
    <SliderProducts :produits="produits" />

    <!-- Section vedette + promos -->
    <section class="home-main flex flex-col md:flex-row gap-8">

      <!-- Produit vedette -->
      <div class="featured w-full md:w-1/2">
        <h2 class="text-xl font-bold mb-4">Produit en vedette</h2>
        <div v-if="produitVedette" class="product-card border p-4 rounded shadow text-center">
          <img :src="produitVedette.images" :alt="produitVedette.nom" class="w-full h-64 object-cover rounded" />
          <h3 class="font-semibold mt-2">{{ produitVedette.nom }}</h3>
          <p>{{ produitVedette.prix }} €</p>
          <p>Vendu : {{ ventes[produitVedette.id] }} fois</p>
        </div>
        <div v-else class="text-gray-500">Aucun produit vendu pour l'instant.</div>
      </div>

      <!-- Produits en promotion -->
      <div class="promos w-full md:w-1/2">
        <h2 class="text-xl font-bold mb-4">Promotions</h2>
        <div v-if="produitsPromo.length" class="grid grid-cols-2 gap-4">
          <div v-for="p in produitsPromo" :key="p.id" class="product-card border p-2 rounded shadow text-center">
            <img :src="p.images" :alt="p.nom" class="w-full h-48 object-cover rounded" />
            <h3 class="font-semibold mt-2">{{ p.nom }}</h3>
            <p><s>{{ p.prix }} €</s> {{ Math.round(p.prix * 0.5) }}
