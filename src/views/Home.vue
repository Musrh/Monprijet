<template>
  <div class="w-full px-4">

    <!-- Slider + Pub -->
    <section class="flex flex-col md:flex-row w-full gap-0">

      <div class="md:w-2/3 w-full">
        <SliderProducts :produits="produitsPromos" />
      </div>

      <div class="md:w-1/3 w-full">
        <div class="h-full min-h-[320px] bg-yellow-200 flex items-center justify-center">
          Publicité
        </div>
      </div>

    </section>

    <!-- Résultats filtrés -->
    <section class="mt-4 w-full">

      <div v-if="hasFilter">

        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-bold">Résultats filtrés</h2>

          <button
            @click="clearFilter"
            class="bg-gray-600 text-white px-3 py-1 rounded"
          >
            Retour accueil
          </button>

        </div>

        <div v-if="filteredProducts.length === 0">
          Aucun produit trouvé
        </div>

        <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">

          <div
            v-for="produit in filteredProducts"
            :key="produit.id"
            class="border rounded p-4"
          >

            <img
              :src="produit.images[0]"
              class="h-32 w-full object-cover mb-2 rounded"
            />

            <h3 class="font-bold">{{ produit.nom }}</h3>

            <p>{{ produit.description }}</p>

            <p class="font-semibold">{{ produit.prix }} $</p>

          </div>

        </div>

      </div>

      <!-- Vitrine normale -->
      <div v-else>
        <Vitrine />
      </div>

    </section>

  </div>
</template>

<script>
import { ref, onMounted, computed, watch } from "vue"
import { collection, getDocs } from "firebase/firestore"
import { db } from "../firebase"
import { useRoute, useRouter } from "vue-router"

import SliderProducts from "../components/SliderProducts.vue"
import Vitrine from "../components/Vitrine.vue"

export default {

  components: {
    SliderProducts,
    Vitrine
  },

  setup() {

    const produits = ref([])
    const produitsPromos = ref([])
    const filteredProducts = ref([])

    const route = useRoute()
    const router = useRouter()

    const hasFilter = computed(() => {
      return route.query.search || route.query.categorie
    })

    const fetchProduits = async () => {

      const snapshot = await getDocs(collection(db, "products"))

      produits.value = []
      produitsPromos.value = []

      snapshot.forEach((doc) => {

        const produit = {
          id: doc.id,
          ...doc.data()
        }

        produits.value.push(produit)

        if (produit.promo) {
          produitsPromos.value.push(produit)
        }

      })

    }

    const applyFilter = () => {

      const search = (route.query.search || "").toLowerCase().trim()
      const categorie = (route.query.categorie || "").toLowerCase().trim()

      filteredProducts.value = produits.value.filter((p) => {

        const nom = (p.nom || "").toLowerCase()
        const description = (p.description || "").toLowerCase()
        const cat = (p.categorie || "").toLowerCase().trim()

        const matchText =
          search === "" ||
          nom.includes(search) ||
          description.includes(search)

        const matchCategorie =
          categorie === "" ||
          cat === categorie

        return matchText && matchCategorie

      })

    }

    const clearFilter = () => {
      router.push("/")
    }

    onMounted(async () => {

      await fetchProduits()

      applyFilter()

    })

    watch(() => route.query, () => {
      applyFilter()
    })

    return {
      produitsPromos,
      filteredProducts,
      hasFilter,
      clearFilter
    }

  }

}
</script>
