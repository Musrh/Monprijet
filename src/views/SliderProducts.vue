<template>
  <div class="slider-wrapper w-full md:w-3/4 mx-auto">
    <div class="slider-container relative overflow-hidden">

      <div
        class="slider-track flex transition-transform duration-500"
        :style="{ transform: `translateX(-${currentIndex * 100}%)` }"
      >
        <div
          v-for="produit in produitsPromos"
          :key="produit.id"
          class="slider-item w-full flex-shrink-0 p-2 text-center relative bg-white rounded shadow"
        >
          <!-- Image -->
          <img
            :src="produit.images?.[0]"
            :alt="produit.nom"
            class="w-full h-48 object-cover rounded"
          />

          <!-- Nom -->
          <h3 class="mt-2 font-semibold">{{ produit.nom }}</h3>

          <!-- Prix -->
          <div class="mt-1">
            <span v-if="produit.promo" class="line-through text-gray-400 mr-2">
              {{ produit.prix }} €
            </span>
            <span class="text-green-600 font-bold">
              {{ produit.promo ? Math.round(produit.prix * 0.5) : produit.prix }} €
            </span>
          </div>

          <!-- Bouton Ajouter au panier -->
          <button
            @click="ajouterAuPanier(produit)"
            class="mt-2 bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
          >
            {{ titles.addToCart }}
          </button>

          <!-- Badge promo -->
          <span
            v-if="produit.promo"
            class="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs"
          >
            {{ titles.promo }}
          </span>
        </div>
      </div>

      <!-- Flèches -->
      <button
        @click="prev"
        class="absolute top-1/2 left-2 -translate-y-1/2 bg-green-600 text-white p-2 rounded-full hover:bg-green-700"
      >
        ‹
      </button>
      <button
        @click="next"
        class="absolute top-1/2 right-2 -translate-y-1/2 bg-green-600 text-white p-2 rounded-full hover:bg-green-700"
      >
        ›
      </button>

    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onBeforeUnmount, watch } from "vue";
import { useStore } from "vuex";

export default {
  name: "SliderProducts",
  props: {
    produits: { type: Array, required: true, default: () => [] },
    auto: { type: Boolean, default: true },
    interval: { type: Number, default: 3000 },
  },

  data() {
    return {
      currentIndex: 0,
      timer: null
    };
  },

  computed: {
    // 🔹 Langue depuis Vuex
    currentLang() {
      return this.$store.getters["language/currentLanguage"] || "fr";
    },

    // 🔹 Traductions
    titles() {
      const translations = {
        fr: { addToCart: "Ajouter au panier", promo: "PROMO" },
        en: { addToCart: "Add to Cart", promo: "SALE" },
      };
      return translations[this.currentLang] || translations.fr;
    },

    // 🔹 Produits promo uniquement
    produitsPromos() {
      return this.produits.filter((p) => p.promo === true);
    }
  },

  methods: {
    next() {
      if (!this.produitsPromos.length) return;
      this.currentIndex = (this.currentIndex + 1) % this.produitsPromos.length;
    },

    prev() {
      if (!this.produitsPromos.length) return;
      this.currentIndex =
        (this.currentIndex - 1 + this.produitsPromos.length) % this.produitsPromos.length;
    },

    ajouterAuPanier(produit) {
      const store = this.$store;
      const prix = produit.promo ? Math.round(produit.prix * 0.5) : produit.prix;
      store.dispatch("addToCart", {
        id: produit.id,
        nom: produit.nom,
        prix,
        images: produit.images,
        quantity: 1,
      });
      alert(`${this.titles.addToCart}: "${produit.nom}"`);
    }
  },

  mounted() {
    if (this.auto) this.timer = setInterval(this.next, this.interval);
  },

  beforeUnmount() {
    if (this.timer) clearInterval(this.timer);
  },

  watch: {
    produits() {
      this.currentIndex = 0;
    }
  }
};
</script>

<style scoped>
.slider-wrapper { margin: 0; }
@media (min-width: 768px) { .slider-wrapper { width: 75%; } }
.slider-container { position: relative; }
.slider-track { display: flex; width: 100%; }
.slider-item { position: relative; }
.slider-item img { transition: transform 0.3s; }
.slider-item img:hover { transform: scale(1.05); }
</style>
