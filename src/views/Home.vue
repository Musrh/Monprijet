<template>
  <div class="p-4">

    <!-- 🔹 Slider -->
    <SliderProducts :produits="produits" />

    <!-- 🔥 Produits Vedettes -->
    <section v-if="produitsVedettes.length" class="mt-10">
      <h2 class="text-2xl font-bold mb-4">🔥 Produits en vedette</h2>

      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div
          v-for="p in produitsVedettes"
          :key="p.id"
          class="border rounded-xl p-3 shadow hover:shadow-lg transition"
        >
          <img
            :src="p.images"
            class="w-full h-40 object-cover rounded-lg"
          />
          <h3 class="mt-2 font-semibold">{{ p.nom }}</h3>
          <p class="text-gray-600">{{ p.prix }} €</p>
          <p class="text-sm text-green-600">
            Ventes : {{ p.ventes }}
          </p>
        </div>
      </div>
    </section>

    <!-- 💰 Promotions -->
    <section v-if="produitsPromo.length" class="mt-10">
      <h2 class="text-2xl font-bold mb-4">💰 Promotions</h2>

      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div
          v-for="p in produitsPromo"
          :key="p.id"
          class="border rounded-xl p-3 shadow hover:shadow-lg transition"
        >
          <img
            :src="p.images"
            class="w-full h-40 object-cover rounded-lg"
          />
          <h3 class="mt-2 font-semibold">{{ p.nom }}</h3>
          <p class="text-red-600 font-bold">{{ p.prix }} €</p>
        </div>
      </div>
    </section>

  </div>
</template>

<script>
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import SliderProducts from "../components/SliderProducts.vue";

export default {
  components: {
    SliderProducts
  },

  data() {
    return {
      produits: [],
      produitsVedettes: [],
      produitsPromo: []
    };
  },

  async mounted() {
    await this.chargerProduits();
  },

  methods: {
    async chargerProduits() {

      // 🔹 1️⃣ Récupérer tous les produits
      const prodSnap = await getDocs(collection(db, "products"));
      const produits = prodSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      this.produits = produits;

      // 🔹 2️⃣ Filtrer promotions
      this.produitsPromo = produits.filter(p => p.promo === true);

      // 🔹 3️⃣ Calculer produits vedettes via commandes
      const cmdSnap = await getDocs(collection(db, "commandes"));

      const ventesParProduit = {};

      cmdSnap.docs.forEach(doc => {
        const cmd = doc.data();

        if (cmd.items && Array.isArray(cmd.items)) {
          cmd.items.forEach(item => {
            const productId = item.id;
            if (productId && item.quantity) {
              ventesParProduit[productId] =
                (ventesParProduit[productId] || 0) + item.quantity;
            }
          });
        }
      });

      // 🔹 4️⃣ Déterminer le max des ventes
      const ventesValues = Object.values(ventesParProduit);

      if (ventesValues.length > 0) {
        const maxVentes = Math.max(...ventesValues);

        this.produitsVedettes = produits
          .map(p => ({
            ...p,
            ventes: ventesParProduit[p.id] || 0
          }))
          .filter(p => p.ventes === maxVentes && maxVentes > 0);
      } else {
        // Si aucune commande → pas de vedettes
        this.produitsVedettes = [];
      }
    }
  }
};
</script>
