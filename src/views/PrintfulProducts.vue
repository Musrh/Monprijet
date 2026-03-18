<template>
  <section class="px-4 mt-6">
    <h2 class="text-2xl font-bold mb-4">Produits Printful</h2>

    <div
      v-if="products.length"
      class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4 w-full"
    >
      <div
        v-for="product in products"
        :key="product.id"
        class="border rounded shadow p-3 flex flex-col bg-white hover:shadow-lg transition transform hover:-translate-y-1"
      >
        <!-- IMAGE avec click -->
        <img
          :src="product.thumbnail || '/placeholder.png'"
          :alt="product.name"
          class="w-full h-32 object-cover rounded mb-2 cursor-pointer"
          @click="showDescription(product)"
        />

        <!-- NOM -->
        <h3 class="font-semibold text-sm mb-1">{{ product.name }}</h3>

        <!-- PRIX -->
        <p class="text-green-600 font-bold mb-2">
          {{ selectedVariantPrice(product) }} €
        </p>

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
                selectedSize[product.id] === size ? 'bg-yellow text-red' : 'bg-yellow'
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
                selectedColor[product.id] === color ? 'bg-yellow text-red' : 'bg-yellow'
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
import { useRouter } from "vue-router";

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
        "https://ton-nouvel-endpoint/get-products" // endpoint qui renvoie un tableau de produits
      );
      // sécuriser si API ne renvoie pas un tableau
      this.products = Array.isArray(res.data)
        ? res.data.map(p => ({
            ...p,
            price: Number(p.price || 0),
          }))
        : [];
    } catch (err) {
      console.error("Erreur Printful:", err);
      this.products = [];
    }
  },
  setup() {
    const router = useRouter();
    return { router };
  },
  methods: {
    selectedVariantPrice(product) {
      const size = this.selectedSize[product.id];
      const color = this.selectedColor[product.id];
      if (product.variants?.length) {
        const variant = product.variants.find(
          v => (!size || v.size === size) && (!color || v.color === color)
        );
        return variant ? variant.price : product.price;
      }
      return product.price;
    },
    addToCart(product) {
      const taille = this.selectedSize[product.id] || product.availableSizes?.[0] || null;
      const couleur = this.selectedColor[product.id] || product.availableColors?.[0] || null;

      let prix = product.price;
      if (product.variants?.length) {
        const variant = product.variants.find(
          v => (!taille || v.size === taille) && (!couleur || v.color === couleur)
        );
        if (variant) prix = variant.price;
      }

      const produitPanier = {
        id: product.id,
        nom: product.name,
        prix,
        images: [product.thumbnail],
        quantity: 1,
        taille,
        couleur,
      };

      this.$store.dispatch("addToCart", produitPanier);
      alert(`Produit "${product.name}" ajouté au panier !`);
    },
    showDescription(product) {
      this.router.push({
        name: "Description",
        params: { id: product.id, productData: product }
      });
    }
  },
};
</script>

<style scoped>
button {
  transition: background-color 0.2s;
}
img {
  cursor: pointer;
}
</style>
