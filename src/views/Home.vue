<template>
  <div class="home">

    <!-- Popup promo, s'affiche une seule fois au chargement -->
    <div
      v-if="showPopup && promoPourPopup"
      class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
    >
      <div class="bg-white p-6 rounded-lg shadow-lg text-center max-w-sm relative">
        <button
          @click="closePopup"
          class="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >✕</button>

        <h2 class="text-xl font-bold mb-2">Promotion spéciale !</h2>
        <img
          :src="promoPourPopup.images"
          :alt="promoPourPopup.nom"
          class="w-full h-48 object-cover rounded mb-4"
        />
        <h3 class="font-semibold">{{ promoPourPopup.nom }}</h3>
        <p><s>{{ promoPourPopup.prix }} €</s> {{ Math.round(promoPourPopup.prix * 0.5) }} €</p>
        <button
          @click="ajouterAuPanier(promoPourPopup)"
          class="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
        >
          Ajouter au panier
        </button>
        <button
          @click="voirPanier"
          class="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Voir panier
        </button>
      </div>
    </div>

    <!-- Slider -->
    <SliderProducts :produits="produits" />

    <!-- Vedette + Promos -->
    <section class="flex flex-col md:flex-row gap-8 mt-8">
      <div class="featured w-full md:w-1/2">
        <h2 class="text-xl font-bold mb-4">Produit en vedette</h2>
        <div v-if="produitVedette" class="border p-4 rounded shadow text-center">
          <img :src="produitVedette.images" :alt="produitVedette.nom" class="w-full h-64 object-cover rounded" />
          <h3 class="font-semibold mt-2">{{ produitVedette.nom }}</h3>
          <p>{{ produitVedette.prix }} €</p>
          <p>Vendu : {{ ventes[produitVedette.id] }} fois</p>
          <button
            @click="ajouterAuPanier(produitVedette)"
            class="mt-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
          >
            Ajouter au panier
          </button>
        </div>
      </div>

      <div class="promos w-full md:w-1/2">
        <h2 class="text-xl font-bold mb-4">Promotions</h2>
        <div v-if="produitsPromo.length" class="relative w-full h-64 rounded shadow-lg overflow-hidden">
          <div
            class="flex transition-transform duration-500"
            :style="{ transform: `translateX(-${currentPromoIndex * 100}%)` }"
          >
            <div v-for="p in produitsPromo" :key="p.id" class="w-full flex-shrink-0 p-2 text-center">
              <img :src="p.images" :alt="p.nom" class="w-full h-48 object-cover rounded" />
              <h3 class="font-semibold mt-2">{{ p.nom }}</h3>
              <p><s>{{ p.prix }} €</s> {{ Math.round(p.prix * 0.5) }} €</p>
              <span class="badge bg-red-500 text-white px-2 py-1 rounded">Promo 50%</span>
              <button
                @click="ajouterAuPanier(p)"
                class="mt-1 bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700 transition"
              >
                Ajouter au panier
              </button>
            </div>
          </div>

          <button
            @click="prevPromo"
            class="absolute top-1/2 left-2 -translate-y-1/2 bg-green-600 text-white rounded-full p-2 hover:bg-green-700"
          >‹</button>
          <button
            @click="nextPromo"
            class="absolute top-1/2 right-2 -translate-y-1/2 bg-green-600 text-white rounded-full p-2 hover:bg-green-700"
          >›</button>
        </div>
      </div>
    </section>

    <!-- Grande image -->
    <section class="mt-8">
      <img
        src="https://via.placeholder.com/1200x400/ffffff/cccccc?text=Grande+Image"
        alt="Grande Image"
        class="w-full object-cover rounded shadow-lg"
      />
    </section>

  </div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import SliderProducts from "./SliderProducts.vue";
import { useStore } from "vuex";

export default {
  components: { SliderProducts },
  setup() {
    const store = useStore();

    const produits = ref([]);
    const produitsPromo = ref([]);
    const commandes = ref([]);
    const produitVedette = ref(null);
    const ventes = ref({});
    const currentPromoIndex = ref(0);
    let promoInterval = null;

    // Popup
    const showPopup = ref(false);
    const promoPourPopup = ref(null);
    const popupDejaOuvert = ref(false); // <-- n’ouvrir qu’une fois

    const closePopup = () => showPopup.value = false;

    const ajouterAuPanier = (produit) => {
      store.dispatch("addToCart", { ...produit, quantity: 1 });
      alert(`${produit.nom} ajouté au panier !`);
      closePopup();
    };

    const voirPanier = () => {
      // Redirection vers page panier
      closePopup();
      window.location.href = "#/panier"; // ou this.$router.push("/panier") si setup
    };

    const fetchProduits = async () => {
      const snapshot = await getDocs(collection(db, "products"));
      snapshot.forEach(doc => {
        const p = doc.data();
        p.id = doc.id;
        produits.value.push(p);
        if (p.promo) produitsPromo.value.push(p);
      });

      if (produitsPromo.value.length > 0 && !popupDejaOuvert.value) {
        promoPourPopup.value = produitsPromo.value[0];
        showPopup.value = true;
        popupDejaOuvert.value = true;
      }
    };

    const fetchCommandes = async () => {
      const snapshot = await getDocs(collection(db, "commandes"));
      snapshot.forEach(doc => commandes.value.push(doc.data()));
    };

    const calculVentes = () => {
      commandes.value.forEach(cmd => {
        if (cmd.statut === "payé" && cmd.items?.length) {
          cmd.items.forEach(item => {
            if (!ventes.value[item.id]) ventes.value[item.id] = 0;
            ventes.value[item.id] += item.quantity;
          });
        }
      });

      let max = 0;
      let vedetteId = null;
      for (const id in ventes.value) {
        if (ventes.value[id] > max) {
          max = ventes.value[id];
          vedetteId = id;
        }
      }
      if (vedetteId) produitVedette.value = produits.value.find(p => p.id === vedetteId) || null;
    };

    const nextPromo = () => {
      if (produitsPromo.value.length > 0)
        currentPromoIndex.value = (currentPromoIndex.value + 1) % produitsPromo.value.length;
    };
    const prevPromo = () => {
      if (produitsPromo.value.length > 0)
        currentPromoIndex.value = (currentPromoIndex.value - 1 + produitsPromo.value.length) % produitsPromo.value.length;
    };

    onMounted(async () => {
      await fetchProduits();
      await fetchCommandes();
      calculVentes();
      if (produitsPromo.value.length > 1) promoInterval = setInterval(nextPromo, 3000);
    });

    onBeforeUnmount(() => {
      if (promoInterval) clearInterval(promoInterval);
    });

    return {
      produits,
      produitsPromo,
      produitVedette,
      ventes,
      currentPromoIndex,
      nextPromo,
      prevPromo,
      showPopup,
      promoPourPopup,
      closePopup,
      ajouterAuPanier,
      voirPanier
    };
  }
};
</script>
