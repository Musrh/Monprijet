<template>
  <section class="px-4 mt-6">

    <h2 class="text-2xl font-bold mb-4">Produits Printful</h2>

    <div
      v-if="products.length"
      class="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
    >

      <div
        v-for="product in products"
        :key="product.id"
        class="border rounded shadow p-3 bg-white hover:shadow-lg transition flex flex-col"
      >

        <!-- Image principale -->
        <img
          :src="product.thumbnail"
          :alt="product.name"
          class="w-full h-40 object-cover rounded mb-2"
        />

        <!-- Nom -->
        <h3 class="font-semibold text-sm mb-1">
          {{ product.name }}
        </h3>

        <!-- Prix principal -->
        <div class="text-green-600 font-bold mb-2">
          {{ product.price }} €
        </div>

        <!-- Tailles / Couleurs visibles -->
        <div class="flex flex-wrap gap-1 mb-2">
          <button
            v-for="variant in product.variants"
            :key="variant.id"
            @click="selectVariant(product.id, variant)"
            class="text-xs border px-2 py-1 rounded hover:bg-gray-200"
            :class="{
              'bg-blue-600 text-white':
                selectedVariant[product.id]?.id === variant.id
            }"
          >
            {{ variant.size }} {{ variant.color }}
          </button>
        </div>

        <!-- Ajouter au panier -->
        <button
          @click="addToCart(product)"
          class="mt-auto bg-blue-600 text-white py-1 rounded hover:bg-blue-700 text-sm"
        >
          Ajouter au panier
        </button>

      </div>
    </div>

    <div v-else class="text-center text-gray-500">
      Chargement des produits...
    </div>

  </section>
</template>

<script>
import axios from "axios";
import { useStore } from "vuex";
import { ref, onMounted } from "vue";

export default {
  name: "PrintfulProducts",

  setup() {
    const store = useStore();
    const products = ref([]);
    const selectedVariant = ref({});

    const fetchProducts = async () => {
      try {
        const res = await axios.get(
          "https://printfulapi-production.up.railway.app/printful/products"
        );
        products.value = res.data.products;
      } catch (err) {
        console.error("Erreur Printful:", err);
      }
    };

    const selectVariant = (productId, variant) => {
      selectedVariant.value[productId] = variant;
    };

    const addToCart = (product) => {
      const variant = selectedVariant.value[product.id];

      if (!variant) {
        alert("Veuillez sélectionner une taille.");
        return;
      }

      // ✅ Format EXACT comme ta Vitrine
       
store.dispatch("addToCart", {
  id: product.id,
  nom: product.name,
  prix: selectedVariant.price,
  images: [selectedVariant.thumbnail],
  taille: selectedVariant.size,
  couleur: selectedVariant.color
});
      

      alert(`"${product.name}" ajouté au panier !`);
    };

    onMounted(fetchProducts);

    return {
      products,
      selectedVariant,
      selectVariant,
      addToCart,
    };
  },
};
</script>

<style scoped>
img {
  display: block;
  width: 100%;
}
</style>
