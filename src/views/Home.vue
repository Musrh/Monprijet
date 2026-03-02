<template>
  <div class="home">

    <!-- Slider -->
    <SliderProducts :produits="produits" />

    <!-- Section vedette + promos -->
    <section class="flex flex-col md:flex-row gap-8 mt-8">

      <!-- Produit vedette -->
      <div class="w-full md:w-1/2">
        <h2 class="text-xl font-bold mb-4">Produit en vedette</h2>

        <div v-if="produitVedette" class="border p-4 rounded shadow text-center">
          <img
            :src="produitVedette.images"
            :alt="produitVedette.nom"
            class="w-full h-64 object-cover rounded"
          />
          <h3 class="font-semibold mt-2">{{ produitVedette.nom }}</h3>
          <p>{{ produitVedette.prix }} €</p>
          <p>Vendu : {{ ventes[produitVedette.id] || 0 }} fois</p>
        </div>

        <div v-else class="text-gray-500">
          Aucun produit vendu.
        </div>
      </div>

      <!-- Promotions -->
      <div class="w-full md:w-1/2">
        <h2 class="text-xl font-bold mb-4">Promotions</h2>

        <div
          v-if="produitsPromo.length > 0"
          class="relative w-full h-64 rounded shadow overflow-hidden"
        >
          <div
            class="flex transition-transform duration-500"
            :style="{ transform: `translateX(-${currentPromoIndex * 100}%)` }"
          >
            <div
              v-for="p in produitsPromo"
              :key="p.id"
              class="w-full flex-shrink-0 p-2 text-center"
            >
              <img
                :src="p.images"
                :alt="p.nom"
                class="w-full h-48 object-cover rounded"
              />
              <h3 class="font-semibold mt-2">{{ p.nom }}</h3>
              <p>
                <s>{{ p.prix }} €</s>
                {{ Math.round(p.prix * 0.5) }} €
              </p>
              <span class="bg-red-500 text-white px-2 py-1 rounded">
                Promo 50%
              </span>
            </div>
          </div>

          <!-- Boutons -->
          <button
            @click="prevPromo"
            class="absolute top-1/2 left-2 -translate-y-1/2 bg-green-600 text-white rounded-full px-3 py-1"
          >
            ‹
          </button>

          <button
            @click="nextPromo"
            class="absolute top-1/2 right-2 -translate-y-1/2 bg-green-600 text-white rounded-full px-3 py-1"
          >
            ›
          </button>
        </div>

        <div v-else class="text-gray-500">
          Aucune promotion disponible.
        </div>
      </div>

    </section>

    <!-- Image bas -->
    <section class="mt-8">
      <img
        src="https://via.placeholder.com/1200x400"
        alt="Bannière"
        class="w-full object-cover rounded shadow"
      />
    </section>

  </div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import SliderProducts from "./SliderProducts.vue";

export default {
  components: { SliderProducts },

  setup() {
    const produits = ref([]);
    const produitsPromo = ref([]);
    const commandes = ref([]);
    const produitVedette = ref(null);
    const ventes = ref({});
    const currentPromoIndex = ref(0);
    let intervalId = null;

    const fetchProduits = async () => {
      const snapshot = await getDocs(collection(db, "products"));
      snapshot.forEach((doc) => {
        const data = { id: doc.id, ...doc.data() };
        produits.value.push(data);
        if (data.promo) produitsPromo.value.push(data);
      });
    };

    const fetchCommandes = async () => {
      const snapshot = await getDocs(collection(db, "commandes"));
      snapshot.forEach((doc) => {
        commandes.value.push(doc.data());
      });
    };

    const calculVentes = () => {
      commandes.value.forEach((cmd) => {
        if (cmd.statut === "payé" && cmd.items) {
