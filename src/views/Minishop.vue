<template>
  <div class="w-full px-4">

    <!-- Produits externes -->
    <section class="mt-6 w-full">
      <h2 class="text-xl font-bold mb-4">Produits Externes</h2>

      <div v-if="produitsExternes.length === 0">
        <p>Aucun produit externe disponible.</p>
      </div>

      <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <div
          v-for="produit in produitsExternes"
          :key="produit.id"
          class="border rounded p-4 flex flex-col items-center"
        >
          <img
            :src="produit.image"
            alt=""
            class="h-32 w-full object-cover mb-2 rounded"
          />
          <h3 class="font-bold text-center">{{ produit.nom }}</h3>
          <p class="text-center font-semibold">{{ produit.prix }} $</p>
          <button
            @click="addToCart(produit)"
            class="mt-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
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
import { useStore } from "vuex";

export default {
  setup() {
    const produitsExternes = ref([]);
    const store = useStore();

    // 🔹 Récupérer produits externes depuis Firestore
    const fetchExternalProducts = async () => {
      const snapshot = await getDocs(collection(db, "ProductsExternes"));
      const loaded = [];
      snapshot.forEach(doc => loaded.push({ id: doc.id, ...doc.data() }));
      produitsExternes.value = loaded;
    };

    onMounted(fetchExternalProducts);

    // 🔹 Ajouter au panier
    const addToCart = (produit) => {
      store.dispatch("addToCart", produit);
    };

    return { produitsExternes, addToCart };
  }
};
</script>

<style scoped>
/* Espacement entre les produits */
.grid > div {
  transition: transform 0.2s;
}
.grid > div:hover {
  transform: translateY(-2px);
}
</style>
