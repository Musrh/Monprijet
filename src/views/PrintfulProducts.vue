<template>
  <section class="px-4 mt-6">
    <h2 class="text-2xl font-bold mb-4">
      {{ t("title") }}
    </h2>

    <div v-if="products.length" class="flex flex-col md:flex-row gap-6">

      <!-- PRODUIT PRINCIPAL -->
      <div class="md:flex-[0_0_60%] w-full flex flex-col items-center bg-white p-4 rounded-xl shadow">

        <img
          :src="selectedProduct.thumbnail || '/placeholder.png'"
          :alt="selectedProduct.name"
          class="w-full md:h-[400px] object-cover rounded border mb-4"
        />

        <h3 class="font-bold text-lg mb-2 text-center">
          {{ selectedProduct.name }}
        </h3>

        <p class="text-green-600 font-bold text-xl mb-4">
          {{ selectedVariantPrice(selectedProduct) }} €
        </p>

        <!-- Tailles -->
        <div v-if="selectedProduct.availableSizes?.length" class="mb-3 w-full">
          <p class="text-sm font-semibold">{{ t("sizes") }}</p>
          <div class="flex flex-wrap gap-2 mt-2">
            <button
              v-for="size in selectedProduct.availableSizes"
              :key="size"
              @click="selectedSize[selectedProduct.id] = size"
              :class="sizeButtonClass(size)"
            >
              {{ size }}
            </button>
          </div>
        </div>

        <!-- Couleurs -->
        <div v-if="selectedProduct.availableColors?.length" class="mb-4 w-full">
          <p class="text-sm font-semibold">{{ t("colors") }}</p>
          <div class="flex flex-wrap gap-2 mt-2">
            <button
              v-for="color in selectedProduct.availableColors"
              :key="color"
              @click="selectedColor[selectedProduct.id] = color"
              :class="colorButtonClass(color)"
            >
              {{ color }}
            </button>
          </div>
        </div>

        <!-- Bouton panier -->
        <button
          :disabled="isSelectionInvalid"
          @click="addToCart(selectedProduct)"
          class="w-full py-2 px-6 rounded text-black font-bold transition"
          :class="isSelectionInvalid 
            ? 'bg-yellow-200 cursor-not-allowed' 
            : 'bg-yellow-300 hover:bg-yellow-400'"
        >
          {{ t("addToCart") }}
        </button>

        <!-- Message success -->
        <transition name="fade">
          <p v-if="successMessage" class="text-green-600 mt-3 text-center">
            {{ successMessage }}
          </p>
        </transition>

      </div>

      <!-- VIGNETTES -->
      <div class="md:flex-[0_0_40%] w-full grid grid-cols-3 gap-2">
        <div
          v-for="product in products.filter(p => p.id !== selectedProduct.id)"
          :key="product.id"
          class="cursor-pointer border rounded-lg hover:shadow-md transition"
          @click="selectProduct(product)"
        >
          <img
            :src="product.thumbnail || '/placeholder.png'"
            :alt="product.name"
            class="w-full h-24 object-cover rounded"
          />
        </div>
      </div>

    </div>

    <div v-else class="text-gray-500">
      {{ t("empty") }}
    </div>
  </section>
</template>

<script>
import axios from "axios";

export default {
  name: "PrintfulProducts",

  data() {
    return {
      products: [],
      selectedProduct: null,
      selectedSize: {},
      selectedColor: {},
      successMessage: ""
    };
  },

  computed: {
    currentLang() {
      return this.$store.getters["language/currentLanguage"];
    },

    isSelectionInvalid() {
      const product = this.selectedProduct;
      if (!product) return true;

      if (product.availableSizes?.length && !this.selectedSize[product.id])
        return true;

      if (product.availableColors?.length && !this.selectedColor[product.id])
        return true;

      return false;
    }
  },

  async mounted() {
    try {
      const res = await axios.get(
        "https://printfulapi-production.up.railway.app/printful/products"
      );

      const list = Array.isArray(res.data.products)
        ? res.data.products
        : [];

      this.products = list.map(p => ({
        ...p,
        price: Number(p.price)
      }));

      if (this.products.length)
        this.selectedProduct = this.products[0];

    } catch (err) {
      console.error("Erreur Printful:", err);
      this.products = [];
    }
  },

  methods: {

    t(key) {
      const translations = {
        fr: {
          title: "Produits Printful",
          sizes: "Tailles :",
          colors: "Couleurs :",
          addToCart: "Ajouter au panier",
          empty: "Aucun produit Printful disponible.",
          added: "Produit ajouté au panier !"
        },
        en: {
          title: "Printful Products",
          sizes: "Sizes:",
          colors: "Colors:",
          addToCart: "Add to cart",
          empty: "No Printful products available.",
          added: "Product added to cart!"
        }
      };

      return translations[this.currentLang][key];
    },

    selectedVariantPrice(product) {
      const size = this.selectedSize[product.id];
      const color = this.selectedColor[product.id];

      if (product.variants?.length) {
        const variant = product.variants.find(
          v =>
            (!size || v.size === size) &&
            (!color || v.color === color)
        );
        return variant ? variant.price : product.price;
      }

      return product.price;
    },

    addToCart(product) {
      const taille = this.selectedSize[product.id] || null;
      const couleur = this.selectedColor[product.id] || null;

      const prix = this.selectedVariantPrice(product);

      const produitPanier = {
        id: product.id,
        nom: product.name,
        prix,
        images: [product.thumbnail],
        quantity: 1,
        taille,
        couleur
      };

      this.$store.dispatch("addToCart", produitPanier);

      this.successMessage = this.t("added");

      setTimeout(() => {
        this.successMessage = "";
      }, 2000);
    },

    selectProduct(product) {
      this.selectedProduct = product;
    },

    sizeButtonClass(size) {
      return [
        "px-3 py-1 border rounded text-sm transition font-semibold",
        this.selectedSize[this.selectedProduct.id] === size
          ? "bg-yellow-400 text-black"
          : "bg-yellow-200 text-black hover:bg-yellow-300"
      ];
    },

    colorButtonClass(color) {
      return [
        "px-3 py-1 border rounded text-sm transition font-semibold",
        this.selectedColor[this.selectedProduct.id] === color
          ? "bg-yellow-400 text-black"
          : "bg-yellow-200 text-black hover:bg-yellow-300"
      ];
    }

  }
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
