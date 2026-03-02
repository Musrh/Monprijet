<template>
  <div>
    <SliderProducts :produits="produits" />

    <section>
      <div>
        <h2>Produit en vedette</h2>

        <div v-if="produitVedette">
          <img :src="produitVedette.images" />
          <h3>{{ produitVedette.nom }}</h3>
          <p>{{ produitVedette.prix }} €</p>
          <button @click="ajouterAuPanier(produitVedette)">
            Ajouter au panier
          </button>
        </div>
      </div>

      <div>
        <h2>Promotions</h2>

        <div v-for="p in produitsPromo" :key="p.id">
          <img :src="p.images" />
          <h3>{{ p.nom }}</h3>
          <p>{{ p.prix }} €</p>
          <button @click="ajouterAuPanier(p)">
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
import SliderProducts from "./SliderProducts.vue";

export default {
  components: { SliderProducts },
  setup() {
    const store = useStore();
    const produits = ref([]);
    const produitsPromo = ref([]);
    const produitVedette = ref(null);

    const ajouterAuPanier = (produit) => {
      store.dispatch("addToCart", { ...produit, quantity: 1 });
    };

    onMounted(async () => {
      const snapshot = await getDocs(collection(db, "products"));

      snapshot.forEach((doc) => {
        const data = { id: doc.id, ...doc.data() };
        produits.value.push(data);
        if (data.promo) produitsPromo.value.push(data);
      });

      if (produits.value.length > 0) {
        produitVedette.value = produits.value[0];
      }
    });

    return {
      produits,
      produitsPromo,
      produitVedette,
      ajouterAuPanier,
    };
  },
};
</script>
