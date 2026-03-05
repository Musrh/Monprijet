<template>
  <div class="home-page">
    <SliderProducts :produits="produits" />
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import SliderProducts from "./SliderProducts.vue";

export default {
  components: { SliderProducts },
  setup() {
    const produits = ref([]);

    // 🔹 Charger tous les produits depuis Firestore
    const fetchProduits = async () => {
      const snapshot = await getDocs(collection(db, "products"));
      const loaded = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        loaded.push({
          id: doc.id,
          nom: data.nom || "Produit",
          prix: Number(data.prix || 0),
          promo: data.promo === true,
          images: data.images || ["/placeholder.png"],
        });
      });
      produits.value = loaded;
      console.log("Produits chargés :", produits.value); // debug
    };

    onMounted(() => fetchProduits());

    return { produits };
  },
};
</script>
