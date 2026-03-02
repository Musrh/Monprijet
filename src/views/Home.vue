<template>
  <div class="home">

    <!-- Slider principal -->
    <SliderProducts :produits="produits" />

    <!-- Section produit promos -->
    <section class="mt-8">
      <h2 class="text-xl font-bold mb-4">Promotions</h2>
      <div v-if="produitsPromo.length" class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div v-for="p in produitsPromo" :key="p.id" class="border p-4 rounded shadow text-center">
          <img :src="p.images" :alt="p.nom" class="w-full h-48 object-cover rounded mb-2" />
          <h3 class="font-semibold">{{ p.nom }}</h3>
          <p><s>{{ p.prix }} €</s> {{ Math.round(p.prix * 0.5) }} €</p>
          <button
            @click="ajouterAuPanier(p)"
            class="mt-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
          >
            Ajouter au panier
          </button>
        </div>
      </div>
      <div v-else class="text-gray-500">Aucune promotion pour l'instant.</div>
    </section>

  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { useStore } from "vuex";
import SliderProducts from "./SliderProducts.vue";

export default {
  components: { SliderProducts },
  setup() {
    const store = useStore();
    const produits = ref([]);
    const produitsPromo = ref([]);

    const fetchProduits = async () => {
      const snapshot = await getDocs(collection(db, "products"));
      snapshot.forEach(doc => {
        const p = doc.data();
        p.id = doc.id;
        produits.value.push(p);
        if (p.promo) produitsPromo.value.push(p);
      });
    };

    const ajouterAuPanier = (produit) => {
      store.dispatch("addToCart", { ...produit, quantity: 1 });
      alert(`${produit.nom} ajouté au panier !`);
    };

    onMounted(fetchProduits);

    return {
      produits,
      produitsPromo,
      ajouterAuPanier
    };
  }
};
</script>

<style scoped>
/* Styles simples */
</style>
