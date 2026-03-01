<template>
  <div class="home p-4">

    <!-- Slider des produits -->
    <SliderProducts :produits="produits" />

    <!-- Section produits vedettes et promotions côte à côte -->
    <div class="grid grid-cols-2 gap-4 my-6">
      <!-- Produit en vedette -->
      <section v-if="produitVedette" class="border p-4 rounded">
        <h2 class="text-lg font-semibold mb-2">Produit en vedette</h2>
        <img :src="produitVedette.image" :alt="produitVedette.nom" class="w-full h-48 object-cover mb-2 rounded"/>
        <h3 class="font-semibold">{{ produitVedette.nom }}</h3>
        <p>{{ produitVedette.prix }} €</p>
        <p>Vendu : {{ ventes[produitVedette.id] || 0 }} fois</p>
        <button @click="ajouterAuPanier(produitVedette)" 
                class="mt-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition">
          Ajouter au panier
        </button>
      </section>

      <!-- Produits en promotion -->
      <section v-if="produitsPromo.length" class="border p-4 rounded">
        <h2 class="text-lg font-semibold mb-2">Promotions</h2>
        <div v-for="p in produitsPromo" :key="p.id" class="mb-4">
          <img :src="p.image" :alt="p.nom" class="w-full h-32 object-cover mb-1 rounded"/>
          <h3 class="font-semibold">{{ p.nom }}</h3>
          <p><s>{{ p.prix }} €</s> {{ Math.round(p.prix * 0.5) }} €</p>
          <span class="bg-red-500 text-white px-2 py-0.5 rounded text-xs">Promo 50%</span>
          <button @click="ajouterAuPanier(p)" 
                  class="mt-1 bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition text-sm">
            Ajouter au panier
          </button>
        </div>
      </section>
    </div>

    <!-- Popup promotion -->
    <div v-if="showPopup" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white p-6 rounded-lg max-w-sm w-full relative">
        <button @click="closePopup" class="absolute top-2 right-2 text-xl">×</button>
        <h2 class="text-lg font-semibold mb-2">Promotion</h2>
        <img :src="popupProduit.image" :alt="popupProduit.nom" class="w-full h-48 object-cover mb-4 rounded"/>
        <h3 class="font-semibold">{{ popupProduit.nom }}</h3>
        <p>{{ popupProduit.prix }} €</p>
        <button @click="ajouterEtVoirPanier" 
                class="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition">
          Ajouter au panier et voir le panier
        </button>
      </div>
    </div>

  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { collection, getDocs } from "firebase/firestore";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { db } from "../firebase";
import SliderProducts from "./SliderProducts.vue";

export default {
  components: { SliderProducts },
  setup() {
    const store = useStore();
    const router = useRouter();

    const produits = ref([]);
    const commandes = ref([]);
    const produitVedette = ref(null);
    const produitsPromo = ref([]);
    const ventes = ref({}); // { idProduit: totalQuantity }

    // Popup
    const showPopup = ref(true);
    const popupProduit = ref({});

    // Ajouter produit au panier (depuis section vedette ou promo)
    const ajouterAuPanier = (produit) => {
      store.dispatch("addToCart", { ...produit, quantity: 1 });
      alert(`${produit.nom} ajouté au panier !`);
    };

    // Ajouter au panier depuis popup et ouvrir panier
    const ajouterEtVoirPanier = () => {
      store.dispatch("addToCart", { ...popupProduit.value, quantity: 1 });
      showPopup.value = false;
      router.push("/panier");
    };

    const closePopup = () => {
      showPopup.value = false;
    };

    // Récupérer les produits Firestore
    const fetchProduits = async () => {
      const snapshot = await getDocs(collection(db, "products"));
      snapshot.forEach(doc => {
        const p = doc.data();
        p.id = doc.id;
        produits.value.push(p);
      });

      // Définir le produit vedette (exemple premier produit)
      if (produits.value.length) produitVedette.value = produits.value[0];

      // Définir produits promo (exemple 50% de réduction sur les suivants)
      produitsPromo.value = produits.value.slice(1, 4); // 2 à 4 premiers
    };

    // Récupérer commandes Firestore pour calcul ventes
    const fetchCommandes = async () => {
      const snapshot = await getDocs(collection(db, "commandes"));
      snapshot.forEach(doc => {
        const cmd = doc.data();
        commandes.value.push(cmd);
      });

      // Calcul des ventes par produit
      commandes.value.forEach(cmd => {
        if (cmd.items && cmd.items.length) {
          cmd.items.forEach(item => {
            if (!ventes.value[item.id]) ventes.value[item.id] = 0;
            ventes.value[item.id] += item.quantity;
          });
        }
      });

      // Définir produit du popup comme premier promo
      if (produitsPromo.value.length) popupProduit.value = produitsPromo.value[0];
    };

    onMounted(async () => {
      await fetchProduits();
      await fetchCommandes();
    });

    return {
      produits,
      produitVedette,
      produitsPromo,
      ventes,
      showPopup,
      popupProduit,
      ajouterAuPanier,
      ajouterEtVoirPanier,
      closePopup
    };
  }
};
</script>

<style scoped>
/* Exemple simple pour popup et vedette/promo */
</style>
