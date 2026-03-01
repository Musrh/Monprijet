<template>
  <div class="min-h-screen bg-gray-100 p-4">

    <!-- Slider en haut -->
    <SliderProduits :produits="produits" />

    <!-- Produits en vedette -->
    <section v-if="produitsVedettes.length" class="max-w-5xl mx-auto mb-8">
      <h2 class="text-xl font-bold mb-4">Produits en vedette</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <ProduitCard v-for="p in produitsVedettes" :key="p.id" :produit="p" badge="Meilleure vente" />
      </div>
    </section>

    <!-- Promos -->
    <section v-if="produitsPromo.length" class="max-w-5xl mx-auto mb-8">
      <h2 class="text-xl font-bold mb-4">Promotions</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <ProduitCard v-for="p in produitsPromo" :key="p.id" :produit="p" badge="Promo" />
      </div>
    </section>

  </div>
</template>

<script>
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import SliderProduits from "@/components/SliderProduits.vue";
import ProduitCard from "@/components/ProduitCard.vue";

export default {
  components: { SliderProduits, ProduitCard },
  data() {
    return {
      produits: [],          // Pour le slider
      produitsVedettes: [],  // Calculées via commandes
      produitsPromo: []
    };
  },
  async mounted() {
    try {
      // 1️⃣ Récupérer tous les produits
      const prodSnap = await getDocs(collection(db, "products"));
      const produits = prodSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      this.produits = produits;        // Slider en haut
      this.produitsPromo = produits.filter(p => p.promo); // Promos

      // 2️⃣ Calcul des ventes pour produits vedettes
      const cmdSnap = await getDocs(collection(db, "commandes"));
      const ventesParProduit = {};
      cmdSnap.docs.forEach(doc => {
        const cmd = doc.data();
        cmd.produits.forEach(p => {
          ventesParProduit[p.id] = (ventesParProduit[p.id] || 0) + p.quantité;
        });
      });

      const maxVentes = Math.max(...produits.map(p => ventesParProduit[p.id] || 0));
      this.produitsVedettes = produits
        .map(p => ({ ...p, ventes: ventesParProduit[p.id] || 0 }))
        .filter(p => (ventesParProduit[p.id] || 0) === maxVentes);

    } catch (err) {
      console.error(err);
    }
  }
};
</script>
