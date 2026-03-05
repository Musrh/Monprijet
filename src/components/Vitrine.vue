<template>
  <section class="vitrine my-8 px-4">

    <!-- Titre -->
    <h2 class="text-2xl font-bold mb-6 text-left">
      Vitrine
    </h2>

    <!-- Liste produits -->
    <div
      v-if="produits.length"
      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
    >

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
          :src="p.images?.[0] || '/placeholder.png'"
          class="w-full h-48 object-cover rounded mb-2"
        />

        <!-- Nom -->
        <h3 class="font-semibold">
          {{ p.nom }}
        </h3>

        <!-- Prix -->
        <div class="mt-2">

          <!-- Ancien prix -->
          <span
            v-if="p.promo"
            class="line-through text-gray-400 mr-2"
          >
            {{ p.prix }} €
          </span>

          <!-- Prix actuel -->
          <span class="text-green-600 font-bold">
            {{ p.promo ? prixPromo(p.prix) : p.prix }} €
          </span>

        </div>

        <!-- Bouton -->
        <button
          @click="ajouterAuPanier(p)"
          class="mt-3 bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
        >
          Ajouter au panier
        </button>

      </div>

    </div>

    <!-- Aucun produit -->
    <div v-else class="text-gray-500 text-center">
      Aucun produit à afficher.
    </div>

  </section>
</template>

<script>
import { ref, onMounted } from "vue"
import { collection, getDocs } from "firebase/firestore"
import { useStore } from "vuex"
import { db } from "../firebase"

export default {
  name: "Vitrine",

  setup() {

    const store = useStore()
    const produits = ref([])

    // Calcul prix promo (-50%)
    const prixPromo = (prix) => {
      return Math.round(prix * 0.5)
    }

    // Ajouter au panier
    const ajouterAuPanier = (produit) => {

      let
