<template>
  <div class="p-4 max-w-3xl mx-auto">

    <h2 class="text-xl font-bold mb-4">🛒 Mon Panier</h2>

    <!-- Panier vide -->
    <div v-if="cart.length === 0">
      <p class="text-gray-500">Votre panier est vide.</p>
    </div>

    <!-- Panier rempli -->
    <div v-else>
      <div
        v-for="item in cart"
        :key="item.id"
        class="flex items-center mb-4 border-b pb-2"
      >
        <img
          :src="item.images?.[0] || item.image || '/placeholder.png'"
          :alt="item.nom"
          class="w-20 h-20 object-cover rounded mr-4"
        />
        <div class="flex-1">
          <h3 class="font-semibold">{{ item.nom }}</h3>
          <p>{{ item.prix }} €</p>
          <input
            type="number"
            min="1"
            v-model.number="item.quantity"
            @change="updateQuantity(item)"
            class="border w-20 p-1 mt-1"
          />
        </div>
        <button
          @click="remove(item.id)"
          class="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded"
        >
          ❌
        </button>
      </div>

      <!-- TOTAL -->
      <h3 class="text-lg font-bold mt-4">Total : {{ total }} €</h3>

      <!-- Choix paiement -->
      <div class="mt-4">
        <label class="font-semibold block mb-2">
          Mode de paiement
        </label>

        <select v-model="paymentMethod"
