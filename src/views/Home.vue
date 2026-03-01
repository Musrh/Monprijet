<template>
  <div class="p-4">

    <!-- Slider automatique -->
    <SliderProducts :produits="produits" />

    <!-- Produits en vedette -->
    <section v-if="produitsVedettes.length" class="mt-10">
      <h2 class="text-2xl font-bold mb-4">🔥 Produits en vedette</h2>

      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div
          v-for="p in produitsVedettes"
          :key="p.id"
          class="border rounded-xl p-3 shadow hover:shadow-lg transition relative"
        >
          <span class="absolute top-2 left-2 bg-yellow-500 text-white px-2 py-1 rounded text-xs font-bold">
            Best Seller
          </span>

          <img :src="p.image" alt="Image produit" class="w-full h-40 object-cover rounded-lg"/>
          <h3 class="mt-2 font-semibold">{{ p.nom }}</h3>
          <p class="text-gray-600">{{ p.prix }} €</p>
          <p class="text-green-600 text-sm font-semibold">{{ p.ventes }} vendus</p>
        </div>
      </div>
    </section>

    <!-- Promotions -->
    <section v-if="produitsPromo.length" class="mt-10">
      <h2 class="text-2xl font-bold mb-4">💰 Promotions</h2>

      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div
          v-for="p in produitsPromo"
          :key="p.id"
          class="border rounded-xl p-3 shadow hover:shadow-lg transition relative"
        >
          <span class="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
            Promo
          </span>

          <img :src="p.image" alt="Image produit" class="w-full h-40 object-cover rounded-lg"/>
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
import SliderProducts from "./SliderProducts.vue";

export default {
  components: { SliderProducts },

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
      try {
        // 🔹 Récupérer tous les produits
        const prodSnap = await getDocs(collection(db, "products"));
        this.produits = prodSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // 🔹 Filtrer les promotions
        this.produitsPromo = this.produits.filter(p => p.promo === true);

        // 🔹 Calculer les ventes depuis commandes
        const cmdSnap = await getDocs(collection(db, "commandes"));
        const ventesParProduit = {};

        cmdSnap.docs.forEach(doc => {
          const cmd = doc.data();
          if (cmd.statut !== "payé") return;
          if (!cmd.items || !Array.isArray(cmd.items)) return;

          cmd.items.forEach(item => {
            if (!item.id || !item.quantity) return;
            const qty = Number(item.quantity) || 0;
            ventesParProduit[item.id] = (ventesParProduit[item.id] || 0) + qty;
          });
        });

        console.log("Ventes calculées par produit:", ventesParProduit);

        // 🔹 Top 3 produits vendus (vedettes)
        this.produitsVedettes = this.produits
          .map(p => ({ ...p, ventes: ventesParProduit[p.id] || 0 }))
          .filter(p => p.ventes > 0)
          .sort((a, b) => b.ventes - a.ventes)
          .slice(0, 3);

        console.log("Produits vedettes:", this.produitsVedettes);

      } catch (err) {
        console.error("Erreur chargement produits:", err);
      }
    }
  }
};
</script>
