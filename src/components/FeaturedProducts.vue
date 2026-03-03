
<template>
  <section class="my-10 px-6">
    <h2 class="text-2xl font-bold mb-6 text-center">
      🔥 Produits en vedette
    </h2>

    <div v-if="featuredProducts.length" class="grid md:grid-cols-3 gap-6">
      <div
        v-for="produit in featuredProducts"
        :key="produit.id"
        class="border p-4 rounded shadow"
      >
        <img
          :src="produit.images?.[0]"
          class="w-full h-48 object-cover rounded mb-3"
        />

        <h3 class="font-bold text-lg">{{ produit.nom }}</h3>
        <p class="text-gray-600">{{ produit.prix }} MAD</p>

        <span class="text-red-600 font-bold">
          Vendus: {{ ventes[produit.id] }}
        </span>
      </div>
    </div>

    <p v-else class="text-center text-gray-500">
      Aucun produit en vedette
    </p>
  </section>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

const featuredProducts = ref([]);
const ventes = ref({});

onMounted(async () => {
  await calculerProduitsVedettes();
});

async function calculerProduitsVedettes() {
  const snapshot = await getDocs(collection(db, "commandes"));

  const compteur = {};

  snapshot.forEach(doc => {
    const data = doc.data();

    if (!data.id || !data.quantity) return;

    if (!compteur[data.id]) {
      compteur[data.id] = 0;
    }

    compteur[data.id] += data.quantity;
  });

  ventes.value = compteur;

  // 🔥 Trouver max quantity
  const max = Math.max(...Object.values(compteur));

  const idsVedettes = Object.keys(compteur).filter(
    id => compteur[id] === max
  );

  if (!idsVedettes.length) return;

  // 🔥 Charger les produits correspondants
  const productsSnap = await getDocs(collection(db, "products"));

  productsSnap.forEach(doc => {
    if (idsVedettes.includes(doc.id)) {
      featuredProducts.value.push({
        id: doc.id,
        ...doc.data()
      });
    }
  });
}
</script>
