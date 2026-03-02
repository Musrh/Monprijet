<template>
  <div class="home">

    <!-- Slider principal -->
    <SliderProducts :produits="produits" />

    <!-- Section produit vedette + promos -->
    <section class="flex flex-col md:flex-row gap-8 mt-8">

      <!-- Produit vedette -->
      <div class="w-full md:w-1/2">
        <h2 class="text-xl font-bold mb-4">Produit en vedette</h2>

        <div v-if="produitVedette" class="border p-4 rounded shadow text-center">
          <img
            :src="produitVedette.images"
            :alt="produitVedette.nom"
            class="w-full h-64 object-cover rounded"
          />
          <h3 class="mt-2 font-semibold">{{ produitVedette.nom }}</h3>
          <p>{{ produitVedette.prix }} €</p>
          <p>Vendu : {{ ventes[produitVedette.id] }} fois</p>

          <button
            @click="ajouterAuPanier(produitVedette)"
            class="mt-2 bg-blue-600 text-white px-4 py-2 rounded"
          >
            Ajouter au panier
          </button>
        </div>

        <div v-else>Aucun produit vendu.</div>
      </div>

      <!-- Promotions -->
      <div class="w-full md:w-1/2">
        <h2 class="text-xl font-bold mb-4">Promotions</h2>

        <div v-if="produitsPromo.length">
          <div
            v-for="p in produitsPromo"
            :key="p.id"
            class="border p-4 rounded shadow text-center mb-4"
          >
            <img
              :src="p.images"
              :alt="p.nom"
              class="w-full h-48 object-cover rounded"
            />
            <h3 class="mt-2 font-semibold">{{ p.nom }}</h3>
            <p>
              <s>{{ p.prix }} €</s>
              {{ Math.round(p.prix * 0.5) }} €
            </p>

            <button
              @click="ajouterAuPanier(p)"
              class="mt-2 bg-blue-600 text-white px-4 py-2 rounded"
            >
              Ajouter au panier
            </button>
          </div>
        </div>

        <div v-else>Aucune promotion.</div>
      </div>

    </section>

  </div>
</template>

<script>
import { ref, onMounted } from "vue";
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

    const ajouterAuPanier = (produit) => {
      store.dispatch("addToCart", { ...produit, quantity: 1 });
      alert("Produit ajouté au panier");
    };

    const fetchProduits = async () => {
      const snapshot = await getDocs(collection(db, "products"));
      snapshot.forEach((doc) => {
        const p = doc.data();
        p.id = doc.id;
        produits.value.push(p);
        if (p.promo) produitsPromo.value.push(p);
      });
    };

    const fetchCommandes = async () => {
      const snapshot = await getDocs(collection(db, "commandes"));
      snapshot.forEach((doc) => commandes.value.push(doc.data()));
    };

    const calculVentes = () => {
      commandes.value.forEach((cmd) => {
        if (cmd.statut === "payé" && cmd.items) {
          cmd.items.forEach((item) => {
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

      if (vedetteId) {
        produitVedette.value =
          produits.value.find((p) => p.id === vedetteId) || null;
      }
    };

    onMounted(async () => {
      await fetchProduits();
      await fetchCommandes();
      calculVentes();
    });

    return {
      produits,
      produitsPromo,
      produitVedette,
      ventes,
      ajouterAuPanier,
    };
  },
};
