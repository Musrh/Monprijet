<template>
  <section class="px-4 mt-6">
    <h2 class="text-2xl font-bold mb-4">Produits Printful</h2>

    <div v-if="products.length" class="flex flex-col md:flex-row gap-6">

      <!-- PRODUIT PRINCIPAL -->
      <div class="md:w-2/3 w-full flex flex-col items-center bg-white p-4 rounded shadow">
        <img
          :src="selectedProduct.thumbnail"
          :alt="selectedProduct.name"
          class="w-full md:h-[400px] object-cover rounded mb-4"
        />
        <h3 class="font-bold text-lg mb-2">{{ selectedProduct.name }}</h3>
        <p class="text-green-600 font-bold text-lg mb-4">{{ selectedProduct.price }} €</p>

        <!-- Tailles -->
        <div v-if="selectedProduct.availableSizes?.length" class="mb-2">
          <p class="text-sm font-semibold">Tailles :</p>
          <div class="flex flex-wrap gap-2 mt-1">
            <button
              v-for="size in selectedProduct.availableSizes"
              :key="size"
              @click="selectedSize[selectedProduct.id] = size"
              :class="[
                'px-3 py-1 border rounded text-sm',
                selectedSize[selectedProduct.id] === size ? 'bg-yellow-500 text-red-600' : 'bg-yellow-200'
              ]"
            >
              {{ size }}
            </button>
          </div>
        </div>

        <!-- Couleurs -->
        <div v-if="selectedProduct.availableColors?.length" class="mb-4">
          <p class="text-sm font-semibold">Couleurs :</p>
          <div class="flex flex-wrap gap-2 mt-1">
            <button
              v-for="color in selectedProduct.availableColors"
              :key="color"
              @click="selectedColor[selectedProduct.id] = color"
              :class="[
                'px-3 py-1 border rounded text-sm',
                selectedColor[selectedProduct.id] === color ? 'bg-yellow-500 text-red-600' : 'bg-yellow-200'
              ]"
            >
              {{ color }}
            </button>
          </div>
        </div>

        <!-- Bouton panier -->
        <button
          @click="addToCart(selectedProduct)"
          class="bg-blue-600 text-white py-2 px-6 rounded hover:bg-blue-700"
        >
          Ajouter au panier
        </button>
      </div>

      <!-- VIGNETTES -->
      <div class="md:w-1/3 w-full grid grid-cols-3 gap-2">
        <div
          v-for="product in products.filter(p => p.id !== selectedProduct.id)"
          :key="product.id"
          class="cursor-pointer border rounded hover:shadow-lg"
          @click="selectProduct(product)"
        >
          <img
            :src="product.thumbnail"
            :alt="product.name"
            class="w-full h-24 object-cover rounded"
          />
        </div>
      </div>

    </div>

    <div v-else class="text-gray-500">Aucun produit Printful disponible.</div>
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
      selectedColor: {}
    };
  },
  async mounted() {
    try {
      const res = await axios.get("https://ton-nouvel-endpoint/get-products");
      this.products = Array.isArray(res.data) ? res.data : [];
      // sélectionner automatiquement le premier produit
      if (this.products.length) this.selectedProduct = this.products[0];
    } catch (err) {
      console.error("Erreur Printful:", err);
      this.products = [];
    }
  },
  methods: {
    selectProduct(product) {
      this.selectedProduct = product;
    },
    addToCart(product) {
      const taille = this.selectedSize[product.id] || product.availableSizes?.[0] || null;
      const couleur = this.selectedColor[product.id] || product.availableColors?.[0] || null;
      const produitPanier = {
        id: product.id,
        nom: product.name,
        prix: product.price,
        images: [product.thumbnail],
        quantity: 1,
        taille,
        couleur
      };
      this.$store.dispatch("addToCart", produitPanier);
      alert(`Produit "${product.name}" ajouté au panier !`);
    }
  }
};
</script>

<style scoped>
img {
  cursor: pointer;
}
</style>
