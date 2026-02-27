<template>
  <div class="p-6 max-w-6xl mx-auto">
    <h1 class="text-3xl font-bold mb-6 text-gray-800">Nos Produits</h1>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      <div v-for="item in produits" :key="item.id" class="bg-white rounded-2xl shadow-md p-5 hover:shadow-xl transition">
        <img :src="item.image" class="rounded-xl mb-4" />
        <h2 class="text-xl font-semibold mb-2">{{ item.nom }}</h2>
        <p class="text-gray-600 mb-4">{{ item.description }}</p>
        <div class="flex justify-between items-center">
          <span class="text-lg font-bold text-green-600">{{ item.prix }} €</span>
          <button @click="$store.dispatch('addToCart', item)" 
                  class="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-700">
            Ajouter
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      produits: [
        { id: 1, nom: 'Produit A', description: 'Description courte', prix: 49, image: 'https://via.placeholder.com/300' },
        { id: 2, nom: 'Produit B', description: 'Description courte', prix: 59, image: 'https://via.placeholder.com/300' },
        { id: 3, nom: 'Produit C', description: 'Description courte', prix: 39, image: 'https://via.placeholder.com/300' },
      ]
    }
  }
}
</script>
