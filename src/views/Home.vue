<template>
  <div class="home p-4 max-w-7xl mx-auto">

    <!-- Slider -->
    <SliderProducts :produits="produitsSlider" />

    <!-- Section produits vedette et promos côte à côte -->
    <div class="grid md:grid-cols-2 gap-6 mt-6">

      <!-- Produit vedette -->
      <section v-if="produitVedette" class="bg-white p-4 rounded shadow">
        <h2 class="text-xl font-bold mb-2">Produit en vedette</h2>
        <img :src="produitVedette.image" :alt="produitVedette.nom" class="w-full h-48 object-cover mb-2 rounded" />
        <h3 class="font-semibold">{{ produitVedette.nom }}</h3>
        <p>{{ produitVedette.prix }} €</p>
        <p>Vendu : {{ ventes[produitVedette.id] || 0 }} fois</p>
        <button
          @click="ajouterAuPanier(produitVedette)"
          class="mt-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
        >
          Ajouter au panier
        </button>
      </section>

      <!-- Promotions -->
      <section v-if="produitsPromo.length" class="bg-white p-4 rounded shadow">
        <h2 class="text-xl font-bold mb-2">Promotions</h2>
        <div v-for="p in produitsPromo" :key="p.id" class="mb-4 border-b pb-2 flex items-center">
          <img :src="p.image" :alt="p.nom" class="w-24 h-24 object-cover rounded mr-4" />
          <div>
            <h3 class="font-semibold">{{ p.nom }}</h3>
            <p><s>{{ p.prix }} €</s> {{ Math.round(p.prix * 0.5) }} €</p>
          </div>
        </div>
      </section>
    </div>

    <!-- Popup promotion -->
    <div v-if="showPopup" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white p-6 rounded-lg max-w-sm w-full relative">
        <button @click="closePopup" class="absolute top-2 right-2 text-xl">×</button>
        <h2 class="text-lg font-semibold mb-2">Promotion</h2>
        <img :src="popupProduit.image" :alt="popupProduit.nom" class="w-full h-48 object-cover mb-4 rounded" />
        <h3>{{ popupProduit.nom }}</h3>
        <p>{{ popupProduit.prix }} €</p>
        <button
          @click="ajouterAuPanier(popupProduit)"
          class="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
        >
          Ajouter au panier
        </button>
        <button @click="closePopup" class="mt-2 text-gray-600 underline">Voir plus tard</button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { collection, getDocs } from "firebase/firestore";
import { useStore } from "vuex";
import { db } from "../firebase";
import SliderProducts from "./SliderProducts.vue";

export default {
  components: { SliderProducts },
  setup() {
    const store = useStore();

    // Données
    const commandes = ref([]);
    const produits = ref([]);
    const produitsPromo = ref([]);
    const produitVedette = ref(null);
    const ventes = ref({});
    const showPopup = ref(true);

    const popupProduit = ref({
      id: "",
      nom: "",
      prix: 0,
      image: ""
    });

    // Fetch produits
    const fetchProduits = async () => {
      const snapshot = await getDocs(collection(db, "products"));
      snapshot.forEach(doc => {
        const p = doc.data();
        if (p.image) produits.value.push({ ...p, id: doc.id });
      });

      // Définir produits promos (50% arbitrarily)
      produitsPromo.value = produits.value.filter(p => p.promo);

      // Produit vedette : premier produit de la liste
      produitVedette.value = produits.value[0] || null;

      // Popup produit : premier promo
      if (produitsPromo.value.length) {
        popupProduit.value = produitsPromo.value[0];
      }
    };

    // Fetch commandes pour calcul ventes
    const fetchCommandes = async () => {
      const snapshot = await getDocs(collection(db, "commandes"));
      snapshot.forEach(doc => {
        commandes.value.push(doc.data());
      });

      commandes.value.forEach(cmd => {
        if (cmd.items && cmd.items.length) {
          cmd.items.forEach(item => {
            if (!ventes.value[item.id]) ventes.value[item.id] = 0;
            ventes.value[item.id] += item.quantity;
          });
        }
      });
    };

    onMounted(async () => {
      await fetchProduits();
      await fetchCommandes();
    });

    // Ajouter au panier
    const ajouterAuPanier = (produit) => {
      store.dispatch("addToCart", { ...produit, quantity: 1 });
      alert(`${produit.nom} ajouté au panier !`);
      showPopup.value = false;
    };

    const closePopup = () => {
      showPopup.value = false;
    };

    // Slider
    const produitsSlider = produits;

    return {
      produitsSlider,
      produitsPromo,
      produitVedette,
      ventes,
      showPopup,
      popupProduit,
      ajouterAuPanier,
      closePopup
    };
  }
};
</script>

<style scoped>
/* Ajouter éventuellement tes styles ici */
</style>
