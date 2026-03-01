<template>
  <div class="home">
    <!-- Slider des produits -->
    <SliderProducts :produits="sliderProduits" />

    <!-- Section vedette -->
    <section v-if="produitVedette" class="mb-6">
      <h2 class="text-xl font-bold mb-2">Produit en vedette</h2>
      <div class="product-card">
        <img :src="produitVedette.image" :alt="produitVedette.nom" class="w-full h-48 object-cover rounded" />
        <h3 class="font-semibold mt-2">{{ produitVedette.nom }}</h3>
        <p>{{ produitVedette.prix }} €</p>
        <p>Vendu : {{ ventes[produitVedette.id] || 0 }} fois</p>
        <button
          @click="ajouterAuPanier(produitVedette)"
          class="mt-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
        >
          Ajouter au panier
        </button>
      </div>
    </section>

    <!-- Section promotions -->
    <section v-if="produitsPromo.length" class="mb-6">
      <h2 class="text-xl font-bold mb-2">Promotions</h2>
      <div class="grid grid-cols-2 gap-4">
        <div v-for="p in produitsPromo" :key="p.id" class="product-card">
          <img :src="p.image" :alt="p.nom" class="w-full h-48 object-cover rounded" />
          <h3 class="font-semibold mt-2">{{ p.nom }}</h3>
          <p><s>{{ p.prix }} €</s> {{ Math.round(p.prix * 0.5) }} €</p>
          <button
            @click="ajouterAuPanier(p)"
            class="mt-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
          >
            Ajouter au panier
          </button>
        </div>
      </div>
    </section>

    <!-- Popup promotion -->
    <div
      v-if="showPopup"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white p-6 rounded-lg max-w-sm w-full relative">
        <button @click="closePopup" class="absolute top-2 right-2 text-xl">×</button>
        <h2 class="text-lg font-semibold mb-2">Promotion</h2>
        <img
          :src="popupProduit.image"
          :alt="popupProduit.nom"
          class="w-full h-48 object-cover mb-4 rounded"
        />
        <h3>{{ popupProduit.nom }}</h3>
        <p>{{ popupProduit.prix }} €</p>
        <button
          @click="ajouterAuPanier(popupProduit)"
          class="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
        >
          Ajouter au panier
        </button>
        <router-link
          to="/panier"
          class="mt-2 inline-block bg-white text-green-600 px-3 py-1 rounded font-semibold hover:bg-gray-100"
        >
          Voir panier
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { useStore } from "vuex";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import SliderProducts from "./SliderProducts.vue";

export default {
  components: { SliderProducts },
  setup() {
    const store = useStore();

    const sliderProduits = ref([]);
    const produitsPromo = ref([]);
    const produitVedette = ref(null);
    const ventes = ref({});

    const showPopup = ref(true);
    const popupProduit = ref({
      id: "CSKwfA88jG84Grrqt7Ko",
      nom: "Produit A",
      prix: 100,
      image: "https://res.cloudinary.com/dla18l69k/image/upload/v1772339318/ifugeouigx7n3v7lsew1.jpg"
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

    // Récupérer produits et calcul ventes
    const fetchProduitsEtCommandes = async () => {
      // Slider
      const snapshot = await getDocs(collection(db, "products"));
      snapshot.forEach(doc => {
        const p = doc.data();
        sliderProduits.value.push(p);
        if (p.promo) produitsPromo.value.push(p);
        if (p.vedette) produitVedette.value = p;
      });

      // Commandes pour ventes
      const cmdSnapshot = await getDocs(collection(db, "commandes"));
      cmdSnapshot.forEach(doc => {
        const cmd = doc.data();
        if (cmd.items) {
          cmd.items.forEach(item => {
            if (!ventes.value[item.id]) ventes.value[item.id] = 0;
            ventes.value[item.id] += item.quantity;
          });
        }
      });
    };

    onMounted(fetchProduitsEtCommandes);

    return {
      sliderProduits,
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
