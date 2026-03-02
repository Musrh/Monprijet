<template>
  <div class="minishop p-4 relative">
    <h2 class="text-2xl font-bold mb-4">Mini Shop - Produits Externes</h2>

    <!-- Notification toast -->
    <transition name="fade">
      <div
        v-if="message"
        class="toast fixed top-4 right-4 bg-green-600 text-white px-4 py-2 rounded shadow-lg z-50"
      >
        {{ message }}
      </div>
    </transition>

    <div v-if="produitsExternes.length" class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div v-for="p in produitsExternes" :key="p.id" class="border rounded shadow p-2 text-center">
        <img
          :src="p.images ? p.images[0] : p.image"
          :alt="p.nom"
          class="w-full h-48 object-cover rounded"
        />
        <h3 class="font-semibold mt-2">{{ p.nom }}</h3>
        <p class="text-lg font-bold">{{ p.prix }} €</p>
        <button
          @click="ajouterAuPanier(p)"
          class="mt-2 bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
        >
          Ajouter au panier
        </button>
      </div>
    </div>

    <div v-else class="text-gray-500">Aucun produit externe pour l'instant.</div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { collection, getDocs } from "firebase/firestore";
import { useStore } from "vuex";
import { db } from "../firebase";

export default {
  name: "MiniShop",
  setup() {
    const store = useStore();
    const produitsExternes = ref([]);
    const message = ref("");

    const ajouterAuPanier = (produit) => {
      store.dispatch("addToCart", {
        id: produit.id,
        nom: produit.nom,
        prix: produit.prix,
        image: produit.images ? produit.images[0] : produit.image,
        quantity: 1,
      });

      // Afficher le message
      message.value = `"${produit.nom}" ajouté au panier !`;
      setTimeout(() => {
        message.value = "";
      }, 2500);
    };

    const fetchProduitsExternes = async () => {
      const snapshot = await getDocs(collection(db, "ProductsExternes"));
      produitsExternes.value = [];
      snapshot.forEach((doc) => {
        produitsExternes.value.push({ id: doc.id, ...doc.data() });
      });
    };

    onMounted(() => {
      fetchProduitsExternes();
    });

    return { produitsExternes, ajouterAuPanier, message };
  },
};
</script>

<style scoped>
.minishop img {
  display: block;
  width: 100%;
  object-fit: cover;
}

/* Animation du toast */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.4s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
.toast {
  min-width: 200px;
  text-align: center;
}
</style>
