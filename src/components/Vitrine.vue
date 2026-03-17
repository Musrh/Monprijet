<template>
  <section class="vitrine px-4 mt-6">

    <h2 class="text-2xl font-bold text-left">Vitrine</h2>

    <div v-if="produits.length" class="grid grid-cols-4 sm:grid-cols-4 lg:grid-cols-5 gap-4 mt-4">
      <ProductCard
        v-for="p in produits"
        :key="p.id"
        :product="p"
        @add-to-cart="ajouterAuPanier"
      />
    </div>

    <div v-else class="text-gray-500 text-center mt-4">
      Aucun produit à afficher.
    </div>

  </section>
</template>

<script>
import { ref, onMounted } from "vue";
import { collection, getDocs } from "firebase/firestore";
import { useStore } from "vuex";
import { db } from "../firebase";
import ProductCard from "../views/ProductCard.vue";

export default {
  name: "Vitrine",
  components: { ProductCard },
  setup() {
    const store = useStore();
    const produits = ref([]);

    const ajouterAuPanier = (produit) => {
      const prixFinal = produit.promo ? Math.round(produit.prix * 0.5) : produit.prix;
      store.dispatch("addToCart", {
        id: produit.id,
        nom: produit.nom,
        prix: prixFinal,
        images: produit.images,
        quantity: 1,
      });
      alert(`Le produit "${produit.nom}" a été ajouté à votre panier !`);
    };

    const fetchProduits = async () => {
      const snapshot = await getDocs(collection(db, "PrintfulProducts"));
      snapshot.forEach((doc) => {
        const data = doc.data();
        produits.value.push({
          id: doc.id,
          nom: data.name,
          prix: Number(data.price),
          images: [data.thumbnail, ...(data.variants?.map(v => v.image).filter(Boolean) || [])],
          promo: false,
          availableSizes: data.availableSizes || [],
          availableColors: data.availableColors || [],
        });
      });
    };

    onMounted(fetchProduits);

    return { produits, ajouterAuPanier };
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
