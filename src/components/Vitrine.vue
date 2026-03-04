<template>
  <section class="vitrine my-8">
    <h2 class="text-2xl font-bold mb-4 text-center">Vitrine</h2>
    
    <!-- Message d'ajout au panier -->
    <div v-if="message" class="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded shadow z-50">
      {{ message }}
    </div>

    <div v-if="produits.length" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      <div
        v-for="p in produits"
        :key="p.id"
        class="border rounded shadow p-4 text-center relative"
      >
        <span
          v-if="p.promo"
          class="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold"
        >
          50% OFF
        </span>

        <img 
          :src="p.images?.[0] || '/placeholder.png'" 
          :alt="p.nom" 
          class="w-full h-48 object-cover rounded mb-2" 
        />

        <h3 class="font-semibold">{{ p.nom }}</h3>

        <div>
          <span v-if="p.promo" class="line-through text-gray-400 mr-2">
            {{ p.prix }} €
          </span>
          <span class="text-green-600 font-bold">
            {{ p.promo ? (p.prix / 2).toFixed(2) : p.prix }} €
          </span>
        </div>

        <button
          @click="ajouterAuPanier(p)"
          class="mt-2 bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
        >
          Ajouter au panier
        </button>
      </div>
    </div>

    <div v-else class="text-gray-500 text-center">Aucun produit à afficher.</div>
  </section>
</template>

<script>
import { ref, onMounted } from "vue";
import { collection, getDocs } from "firebase/firestore";
import { useStore } from "vuex";
import { db } from "../firebase";

export default {
  name: "Vitrine",
  setup() {
    const store = useStore();
    const produits = ref([]);
    const message = ref("");

    const ajouterAuPanier = (produit) => {
      store.dispatch("addToCart", {
        id: produit.id,
        nom: produit.nom,
        prix: produit.promo ? produit.prix / 2 : produit.prix,
        images: produit.images,
        quantity: 1,
      });

      // 🔹 Message temporaire
      message.value = `${produit.nom} a été ajouté au panier !`;
      setTimeout(() => {
        message.value = "";
      }, 2000); // disparaît après 2 secondes
    };

    const fetchProduits = async () => {
      const snapshot = await getDocs(collection(db, "products"));
      snapshot.forEach((doc) => {
        produits.value.push({ id: doc.id, ...doc.data() });
      });
    };

    onMounted(() => fetchProduits());

    return {
      produits,
      ajouterAuPanier,
      message,
    };
  },
};
</script>

<style scoped>
.vitrine img {
  display: block;
  width: 100%;
  object-fit: cover;
}

.vitrine button {
  transition: background-color 0.2s;
}
</style>
