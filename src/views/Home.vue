<template>
  <div class="home">

    <!-- Slider principal -->
    <SliderProducts :produits="produits" />

    <!-- Section produit vedette + promos -->
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
          Aucun produit vendu pour l'instant.
        </div>
      </div>

      <!-- Promotions -->
      <div class="w-full md:w-1/2">
        <h2 class="text-xl font-bold mb-4">Promotions</h2>

        <div
          v-if="produitsPromo.length"
          class="relative w-full h-64 rounded shadow-lg overflow-hidden"
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

          <!-- Flèches -->
          <button
            @click="prevPromo"
            class="absolute top-1/2 left-2 -translate-y-1/2 bg-green-600 text-white rounded-full p-2"
          >
            ‹
          </button>

          <button
            @click="nextPromo"
            class="absolute top-1/2 right-2 -translate-y-1/2 bg-green-600 text-white rounded-full p-2"
          >
            ›
          </button>
        </div>

        <div v-else class="text-gray-500">
          Aucune promotion pour l'instant.
        </div>
      </div>

    </section>

    <!-- Image bas -->
    <section class="mt-8">
      <img
        src="https://via.placeholder.com/1200x400"
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

export default {
  components: { SliderProducts },

  setup() {
    const produits = ref([]);
    const produitsPromo = ref([]);
    const commandes = ref([]);
    const produitVedette = ref(null);
    const ventes = ref({});
    const currentPromoIndex = ref(0);
    let promoInterval = null;

    const fetchProduits = async () => {
      const snapshot = await getDocs(collection(db, "products"));

      snapshot.forEach((doc) => {
        const p = { id: doc.id, ...doc.data() };
        produits.value.push(p);
        if (p.promo) produitsPromo.value.push(p);
      });
    };

    const fetchCommandes = async () => {
      const snapshot = await getDocs(collection(db, "commandes"));
      snapshot.forEach((doc) => commandes.value.push(doc.data()));
    };

    const calculVentes = () => {
      commandes.value.forEach((cmd) => {
        if (cmd.statut === "payé" && cmd.items?.length) {
          cmd.items.forEach((item) => {
            if (!ventes.value[item.id]) ventes.value[item.id] = 0;
            ventes.value[item.id] += item.quantity;
          });
        }
      });

      let max = 0;
      let bestId = null;

      for (const id in ventes.value) {
        if (ventes.value[id] > max) {
          max = ventes.value[id];
          bestId = id;
        }
      }

      if (bestId) {
        produitVedette.value =
          produits.value.find((p) => p.id === bestId) || null;
      }
    };

    const nextPromo = () => {
      if (produitsPromo.value.length > 0) {
