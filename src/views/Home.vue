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
            class="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Ajouter au panier
          </button>
        </div>
        <div v-else class="text-gray-500">Aucun produit vendu pour l'instant.</div>
      </div>

      <!-- Promos -->
      <div class="promos w-full md:w-1/2">
        <h2 class="text-xl font-bold mb-4">Promotions</h2>
        <div v-if="produitsPromo.length" class="relative w-full h-64 rounded shadow-lg overflow-hidden">
          <div
            class="flex transition-transform duration-500"
            :style="{ transform: `translateX(-${currentPromoIndex * 100}%)` }"
          >
            <div v-for="p in produitsPromo" :key="p.id" class="w-full flex-shrink-0 p-2 text-center">
              <img :src="p.images" :alt="p.nom" class="w-full h-48 object-cover rounded" />
              <h3 class="font-semibold mt-2">{{ p.nom }}</h3>
              <p><s>{{ p.prix }} €</s> {{ Math.round(p.prix * 0.5) }} €</p>
              <span class="badge bg-red-500 text-white px-2 py-1 rounded">Promo 50%</span>
              <button
                @click="ajouterAuPanier(p)"
                class="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
              >
                Ajouter au panier
              </button>
            </div>
          </div>

          <!-- flèches navigation -->
          <button
            @click="prevPromo"
            class="absolute top-1/2 left-2 -translate-y-1/2 bg-green-600 text-white rounded-full p-2 hover:bg-green-700"
          >‹</button>
          <button
            @click="nextPromo"
            class="absolute top-1/2 right-2 -translate-y-1/2 bg-green-600 text-white rounded-full p-2 hover:bg-green-700"
          >›</button>
        </div>
        <div v-else class="text-gray-500">Aucune promotion pour l'instant.</div>
      </div>

    </section>

    <!-- Grande image en bas -->
    <section class="mt-8">
      <img
        src="https://via.placeholder.com/1200x400/ffffff/cccccc?text=Grande+Image"
        alt="Grande Image"
        class="w-full object-cover rounded shadow-lg"
      />
    </section>

  </div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import SliderProducts from "./SliderProducts.vue";
import { useStore } from "vuex";

export default {
  components: { SliderProducts },
  setup() {
    const store = useStore();
    const produits = ref([]);
    const produitsPromo = ref([]);
    const commandes = ref([]);
    const produitVedette = ref(null);
    const ventes = ref({});
    const currentPromoIndex = ref(
