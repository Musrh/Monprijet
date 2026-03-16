<template>
  <div class="w-full px-4">

    <!-- 1️⃣ Slider principal -->
    <section class="mb-4">
      <SliderProducts :produits="produitsPromos" />
    </section>

    <!-- 2️⃣ Produits Printful -->
    <section class="mb-4">
      <PrintfulProducts @add-to-cart="addToCart" />
    </section>

    <!-- 3️⃣ Vitrine locale (organisée comme Printful) -->
    <section class="mb-4">
      <h2 class="text-xl font-bold mb-2">Vitrine</h2>
      <div v-if="produits.length === 0">
        <p>Aucun produit disponible.</p>
      </div>
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <div
          v-for="produit in produits"
          :key="produit.id"
          class="border rounded-lg p-4 bg-white shadow flex flex-col"
        >
          <!-- Image -->
          <img
            :src="produit.thumbnail || produit.images?.[0]"
            class="h-40 w-full object-cover rounded mb-3"
            alt="produit.nom"
          />

          <!-- Nom -->
          <h3 class="font-bold text-lg">{{ produit.nom }}</h3>

          <!-- Description -->
          <p class="text-gray-600 text-sm mb-2">{{ produit.description }}</p>

          <!-- Prix -->
          <p class="text-green-600 font-bold text-lg mb-3">{{ produit.prix }} $</p>

          <!-- Bouton panier -->
          <button
            @click="addToCart(produit)"
            class="mt-auto bg-green-600 text-white py-2 rounded hover:bg-green-700"
          >
            Ajouter au panier
          </button>
        </div>
      </div>
    </section>

  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import SliderProducts from "../components/SliderProducts.vue";
import PrintfulProducts from "../components/PrintfulProducts.vue";
import { useStore } from "vuex";

export default {
  components: { SliderProducts, PrintfulProducts },

  setup() {
    const produits = ref([]);
    const produitsPromos = ref([]);
    const store = useStore();

    const fetchProduits = async () => {
      const snapshot = await getDocs(collection(db, "products"));
      snapshot.forEach((doc) => {
        const produit = { id: doc.id, ...doc.data() };
        produits.value.push(produit);
        if (produit.promo) produitsPromos.value.push(produit);
      });
    };

    const addToCart = (produit) => {
      store.dispatch("addToCart", {
        id: produit.id,
        name: produit.nom || produit.name,
        price: produit.prix || produit.price,
        thumbnail: produit.thumbnail || produit.images?.[0],
      });
    };

    onMounted(() => {
      fetchProduits();
    });

    return { produits, produitsPromos, addToCart };
  },
};
</script>

<style scoped>
section + section {
  margin-top: 1rem;
}
</style>
