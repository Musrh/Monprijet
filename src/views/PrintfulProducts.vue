<template>
  <section class="px-4 mt-6">
    <h2 class="text-2xl font-bold mb-4">Produits Printful</h2>

    <div v-if="products.length" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      <div
        v-for="product in products"
        :key="product.id"
        class="border rounded shadow p-3 flex flex-col bg-white"
      >
        <!-- IMAGE -->
        <img
          :src="product.thumbnail || '/placeholder.png'"
          :alt="product.name"
          class="w-full h-40 object-cover rounded mb-2"
        />

        <!-- NOM -->
        <h3 class="font-semibold text-sm mb-1">{{ product.name }}</h3>

        <!-- PRIX -->
        <p class="text-green-600 font-bold mb-2">{{ product.price }} €</p>

        <!-- TAILLES -->
        <div v-if="product.availableSizes?.length" class="mb-2">
          <p class="text-xs font-semibold">Tailles :</p>
          <div class="flex flex-wrap gap-1 mt-1">
            <button
              v-for="size in product.availableSizes"
              :key="size"
              @click="selectedSize[product.id] = size"
              :class="[
                'px-2 py-1 text-xs border rounded',
                selectedSize[product.id] === size
                  ? 'bg-black text-white'
                  : 'bg-gray-100'
              ]"
            >
              {{ size }}
            </button>
          </div>
        </div>

        <!-- COULEURS -->
        <div v-if="product.availableColors?.length" class="mb-2">
          <p class="text-xs font-semibold">Couleurs :</p>
          <div class="flex flex-wrap gap-1 mt-1">
            <button
              v-for="color in product.availableColors"
              :key="color"
              @click="selectedColor[product.id] = color"
              :class="[
                'px-2 py-1 text-xs border rounded',
                selectedColor[product.id] === color
                  ? 'bg-black text-white'
                  : 'bg-gray-100'
              ]"
            >
              {{ color }}
            </button>
          </div>
        </div>

        <!-- BOUTON PANIER -->
        <button
          @click="addToCart(product)"
          class="mt-auto bg-blue-600 text-white py-2 rounded hover:bg-blue-700 text-sm"
        >
          Ajouter au panier
        </button>
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
      selectedSize: {},
      selectedColor: {},
    };
  },
  async mounted() {
    try {
      const res = await axios.get(
        "https://printfulapi-production.up.railway.app/printful/products"
      );
      this.products = res.data.products.map(p => ({
        ...p,
        price: Number(p.price),
      }));
    } catch (err) {
      console.error("Erreur Printful:", err);
    }
  },
  methods: {
    addToCart(product) {
      const taille = this.selectedSize[product.id] || product.availableSizes?.[0] || null;
      const couleur = this.selectedColor[product.id] || product.availableColors?.[0] || null;

      const produitPanier = {
        id: product.id,
        nom: product.name,
        prix: Number(product.price),
        images: [product.thumbnail],
        quantity: 1,
        taille,
        couleur,
      };

      this.$store.dispatch("addToCart", produitPanier);
      alert(`Produit "${product.name}" ajouté au panier !`);
    },
  },
};
</script>

<style scoped>
button {
  transition: background-color 0.2s;
}
</style>
