<template>
  <div class="home">
    <!-- Slider des produits -->
    <SliderProducts :produits="produits" />

    <!-- Section principale : vedette + promos côte à côte -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
      <!-- Produit vedette -->
      <section v-if="produitVedette" class="bg-white p-4 rounded shadow">
        <h2 class="text-xl font-semibold mb-2">Produit en vedette</h2>
        <img :src="produitVedette.image" :alt="produitVedette.nom" class="w-full h-48 object-cover rounded mb-2" />
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

      <!-- Produits en promotion -->
      <section v-if="produitsPromo.length" class="bg-white p-4 rounded shadow">
        <h2 class="text-xl font-semibold mb-2">Promotions</h2>
        <div v-for="p in produitsPromo" :key="p.id" class="mb-4">
          <img :src="p.image" :alt="p.nom" class="w-full h-32 object-cover rounded mb-1" />
          <h3 class="font-semibold">{{ p.nom }}</h3>
          <p><s>{{ p.prix }} €</s> {{ Math.round(p.prix * 0.5) }} €</p>
          <button
            @click="ajouterAuPanier(p)"
            class="mt-1 bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700 transition"
          >
            Ajouter au panier
          </button>
        </div>
      </section>
    </div>

    <!-- Popup promo -->
    <div
      v-if="showPopup"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white p-6 rounded-lg max-w-sm w-full relative">
        <button @click="closePopup" class="absolute top-2 right-2 text-xl">×</button>
        <h2 class="text-lg font-semibold mb-2">Promotion</h2>
        <img :src="popupProduit.image" :alt="popupProduit.nom" class="w-full h-48 object-cover mb-4" />
        <h3>{{ popupProduit.nom }}</h3>
        <p>{{ popupProduit.prix }} €</p>
        <button
          @click="ajouterEtVoirPanier(popupProduit)"
          class="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
        >
          Ajouter au panier et voir le panier
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import SliderProducts from "./SliderProducts.vue";

export default {
  components: { SliderProducts },
  setup() {
    const store = useStore();
    const router = useRouter();

    const produits = ref([]);
    const commandes = ref([]);
    const ventes = ref({});
    const produitsPromo = ref([]);
    const produitVedette = ref(null);

    // Popup promo
    const showPopup = ref(true);
    const popupProduit = ref({
      id: "",
      nom: "",
      prix: 0,
      image: ""
    });

    // Récupérer tous les produits
    const fetchProduits = async () => {
      const snapshot = await getDocs(collection(db, "products"));
      snapshot.forEach(doc => {
        const p = doc.data();
        produits.value.push(p);

        // Exemple simple pour promos
        if (p.promo) produitsPromo.value.push(p);
      });

      // Vedette = premier produit pour exemple
      if (produits.value.length) produitVedette.value = produits.value[0];

      // Popup = premier produit promo
      if (produitsPromo.value.length) popupProduit.value = produitsPromo.value[0];
    };

    // Récupérer toutes les commandes pour calculer les ventes
    const fetchCommandes = async () => {
      const snapshot = await getDocs(collection(db, "commandes"));
      snapshot.forEach(doc => {
        const cmd = doc.data();
        commandes.value.push(cmd);

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

    const ajouterAuPanier = (produit) => {
      store.dispatch("addToCart", { ...produit, quantity: 1 });
      alert(`${produit.nom} ajouté au panier !`);
    };

    const closePopup = () => {
      showPopup.value = false;
    };

    // Ajouter depuis popup et ouvrir le panier
    const ajouterEtVoirPanier = (produit) => {
      store.dispatch("addToCart", { ...produit, quantity: 1 });
      showPopup.value = false;
      router.push("/panier");
    };

    return {
      produits,
      produitsPromo,
      produitVedette,
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
/* Vous pouvez ajouter vos styles ici */
</style>
