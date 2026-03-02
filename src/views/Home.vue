<template>
  <div class="home">

    <!-- Slider -->
    <SliderProducts :produits="produits" />

    <!-- Section Vedette + Promos -->
    <section class="container">

      <!-- PRODUIT EN VEDETTE -->
      <div class="vedette">
        <h2>Produit en vedette</h2>

        <div v-if="produitVedette" class="card">
          <img
            :src="produitVedette.images"
            :alt="produitVedette.nom"
            class="image"
          />
          <h3>{{ produitVedette.nom }}</h3>
          <p>{{ produitVedette.prix }} €</p>
          <p>Vendu : {{ ventes[produitVedette.id] || 0 }} fois</p>

          <button @click="ajouterAuPanier(produitVedette)">
            Ajouter au panier
          </button>
        </div>

        <div v-else>
          Aucun produit vendu.
        </div>
      </div>

      <!-- PRODUITS PROMOS -->
      <div class="promos">
        <h2>Promotions</h2>

        <div v-if="produitsPromo.length">

          <div
            v-for="p in produitsPromo"
            :key="p.id"
            class="card"
          >
            <img
              :src="p.images"
              :alt="p.nom"
              class="image"
            />

            <h3>{{ p.nom }}</h3>

            <p>
              <s>{{ p.prix }} €</s>
              {{ Math.round(p.prix * 0.5) }} €
            </p>

            <button @click="ajouterAuPanier(p)">
              Ajouter au panier
            </button>
          </div>

        </div>

        <div v-else>
          Aucune promotion.
        </div>
      </div>

    </section>

  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { useStore } from "vuex";
import SliderProducts from "./SliderProducts.vue";

export default {
  components: { SliderProducts },

  setup() {
    const store = useStore();

    const produits = ref([]);
    const produitsPromo = ref([]);
    const commandes = ref([]);
    const ventes = ref({});
    const produitVedette = ref(null);

    const ajouterAuPanier = (produit) => {
      store.dispatch("addToCart", { ...produit, quantity: 1 });
    };

    const fetchProduits = async () => {
      const snapshot = await getDocs(collection(db, "products"));

      snapshot.forEach((doc) => {
        const data = doc.data();
        const produit = { id: doc.id, ...data };

        produits.value.push(produit);

        if (produit.promo) {
          produitsPromo.value.push(produit);
        }
      });
    };

    const fetchCommandes = async () => {
      const snapshot = await getDocs(collection(db, "commandes"));
      snapshot.forEach((doc) => {
        commandes.value.push(doc.data());
      });
    };

    const calculVentes = () => {
      commandes.value
