<!-- 🔥 Section Promo + Vedette -->
<div v-if="produitsPromo.length || produitVedette" class="my-10 px-2 md:px-6">
  <h2 class="text-2xl font-bold text-center text-red-600 mb-6">
    🔥 Produits en promotion & ⭐ Produit en vedette
  </h2>

  <div class="flex flex-col md:flex-row gap-6">
    <!-- Produits promo -->
    <div class="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-6">
      <div
        v-for="p in produitsPromo"
        :key="p.id"
        class="bg-white border rounded p-4 text-center shadow hover:shadow-lg transition relative"
      >
        <span class="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 text-xs rounded">PROMO</span>
        <img :src="p.images?.[0] || '/placeholder.png'" class="w-full h-48 object-cover rounded my-3" />
        <h3 class="font-bold">{{ p.nom }}</h3>
        <p class="text-green-600 font-bold">{{ p.prix }} €</p>
        <button @click="ajouterAuPanier(p)" class="bg-green-600 text-white px-3 py-1 rounded mt-2 hover:bg-green-700">
          Ajouter au panier
        </button>
      </div>
    </div>

    <!-- Produit vedette -->
    <div v-if="produitVedette" class="flex-1 bg-white border rounded p-4 text-center shadow hover:shadow-lg transition relative">
      <span class="absolute top-2 left-2 bg-yellow-400 text-white px-2 py-1 text-xs rounded">VED</span>
      <img :src="produitVedette.images?.[0] || '/placeholder.png'" class="w-full h-48 object-cover rounded my-3" />
      <h3 class="font-bold">{{ produitVedette.nom }}</h3>
      <p class="text-green-600 font-bold">{{ produitVedette.prix }} €</p>
      <p class="text-gray-500">Vendus : {{ ventes[produitVedette.id] || 0 }}</p>
      <button @click="ajouterAuPanier(produitVedette)" class="bg-green-600 text-white px-3 py-1 rounded mt-2 hover:bg-green-700">
        Ajouter au panier
      </button>
    </div>
  </div>
</div>
