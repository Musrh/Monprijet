<!-- 🔥 Produits en promotion -->
<div v-if="produitsPromo.length" class="my-10 px-6">
  <h2 class="text-2xl font-bold text-center text-red-600 mb-6">
    🔥 Produits en promotion
  </h2>

  <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
    <div
      v-for="p in produitsPromo"
      :key="p.id"
      class="bg-white border rounded p-4 text-center shadow hover:shadow-lg transition relative"
    >
      
      <!-- 🔥 Badge -50% -->
      <span class="absolute top-2 left-2 bg-red-600 text-white px-3 py-1 text-xs font-bold rounded-full shadow">
        -50%
      </span>

      <img
        :src="p.images?.[0] || '/placeholder.png'"
        class="w-full h-48 object-cover rounded my-3"
      />

      <h3 class="font-bold">{{ p.nom }}</h3>

      <!-- 💰 Prix -->
      <div class="mt-2">
        <p class="text-gray-400 line-through text-sm">
          {{ p.prix }} €
        </p>

        <p class="text-red-600 font-bold text-lg">
          {{ (p.prix / 2).toFixed(2) }} €
        </p>
      </div>

      <button
        @click="ajouterAuPanier({ ...p, prix: p.prix / 2 })"
        class="bg-red-600 text-white px-3 py-1 rounded mt-3 hover:bg-red-700"
      >
        Acheter en promo
      </button>
    </div>
  </div>
</div>
