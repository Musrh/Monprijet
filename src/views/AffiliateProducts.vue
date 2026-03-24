<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-6">Produits Partenaires</h1>

    <div v-if="products.length" class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div
        v-for="product in products"
        :key="product.id"
        class="border rounded p-4 shadow hover:shadow-lg transition"
      >
        <!-- ✅ Image principale (première image du tableau) -->
        <img
          v-if="product.image && product.image.length"
          :src="product.image[0]"
          :alt="product.title"
          class="w-full h-48 object-cover mb-3 rounded"
        />

        <!-- Titre -->
        <h2 class="font-semibold mb-2 line-clamp-2">
          {{ product.title }}
        </h2>

        <!-- ✅ Prix -->
        <p class="text-lg font-bold text-green-600 mb-3">
          {{ product.price }} €
        </p>

        <!-- Bouton -->
        <a
          :href="product.affiliateUrl"
          target="_blank"
          class="bg-orange-500 text-white px-3 py-2 rounded inline-block w-full text-center"
        >
          Voir le produit
        </a>
      </div>
    </div>

    <p v-else>Aucun produit partenaire disponible.</p>
  </div>
</template>
