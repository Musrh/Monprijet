
<template>
  <div class="p-6">
    <h2 class="text-2xl font-bold mb-6">Gestion des Produits (Admin)</h2>

    <button
      @click="ajouterProduit"
      class="bg-green-600 text-white px-4 py-2 rounded mb-6"
    >
      + Ajouter produit
    </button>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div
        v-for="produit in produits"
        :key="produit.id"
        class="border p-4 rounded shadow"
      >
        <img
          :src="produit.images?.[0]"
          class="w-full h-40 object-cover rounded mb-2"
        />

        <h3 class="font-bold">{{ produit.nom }}</h3>
        <p>{{ produit.prix }} €</p>

        <div class="flex gap-2 mt-3">
          <button
            @click="modifierProduit(produit.id)"
            class="bg-orange-500 text-white px-3 py-1 rounded"
          >
            Modifier
          </button>

          <button
            @click="supprimerProduit(produit.id)"
            class="bg-red-600 text-white px-3 py-1 rounded"
          >
            Supprimer
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { getFirestore, collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { useRouter } from "vue-router";

const db = getFirestore();
const router = useRouter();
const produits = ref([]);

const fetchProduits = async () => {
  const snap = await getDocs(collection(db, "products"));
  produits.value = snap.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};

const ajouterProduit = () => {
  router.push("/upload");
};

const modifierProduit = (id) => {
  router.push(`/upload/${id}`);
};

const supprimerProduit = async (id) => {
  if (confirm("Supprimer ce produit ?")) {
    await deleteDoc(doc(db, "products", id));
    fetchProduits();
  }
};

onMounted(fetchProduits);
</script>
