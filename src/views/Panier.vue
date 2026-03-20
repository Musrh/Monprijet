<template>
  <div class="p-4 max-w-3xl mx-auto">
    <h2 class="text-xl font-bold mb-4">🛒 Mon Panier</h2>

    <div v-if="cart.length === 0">
      <p class="text-gray-500">Votre panier est vide.</p>
    </div>

    <div v-else>
      <div
        v-for="item in cart"
        :key="item.id + '-' + item.taille + '-' + item.couleur"
        class="flex items-center mb-4 border-b pb-2"
      >
        <img
          :src="item.images?.[0] || item.image || '/placeholder.png'"
          :alt="item.nom"
          class="w-20 h-20 object-cover rounded mr-4"
        />

        <div class="flex-1">
          <h3 class="font-semibold">{{ item.nom }}</h3>
          <p>{{ item.prix }} €</p>
          <p v-if="item.taille">📏 Taille : {{ item.taille }}</p>
          <p v-if="item.couleur">🎨 Couleur : {{ item.couleur }}</p>

          <input
            type="number"
            min="1"
            v-model.number="item.quantity"
            @change="updateQuantity(item)"
            class="border w-20 p-1 mt-1"
          />
        </div>

        <button
          @click="remove(item)"
          class="bg-red-500 text-white px-2 py-1 rounded"
        >
          ❌
        </button>
      </div>

      <!-- Adresse -->
      <div class="mt-6">
        <h3 class="font-bold mb-2">Adresse de livraison</h3>

        <input v-model="address1" placeholder="Adresse 1" class="input" />
        <input v-model="address2" placeholder="Adresse 2" class="input" />
        <input v-model="ville" placeholder="Ville" class="input" />
        <input v-model="codePostal" placeholder="Code Postal" class="input" />
        <input v-model="pays" placeholder="Pays" class="input" />
      </div>

      <h3 class="text-lg font-bold mt-4">
        Total : {{ total }} €
      </h3>

      <button
        @click="payerStripe"
        class="bg-green-600 text-white px-4 py-2 rounded mt-4 w-full"
      >
        Payer avec Stripe
      </button>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  data() {
    return {
      address1: "",
      address2: "",
      ville: "",
      codePostal: "",
      pays: "",
    };
  },

  computed: {
    ...mapState(["cart", "user"]),
    total() {
      return this.cart
        .reduce((sum, item) => sum + item.prix * item.quantity, 0)
        .toFixed(2);
    },
  },

  methods: {
    remove(item) {
      this.$store.dispatch("removeItem", item);
    },

    updateQuantity(item) {
      this.$store.dispatch("updateQuantity", item);
    },

    async payerStripe() {
      if (!this.user) {
        alert("Veuillez vous connecter.");
        this.$router.push("/login");
        return;
      }

      if (!this.address1 || !this.ville || !this.codePostal || !this.pays) {
        alert("Veuillez remplir tous les champs d'adresse.");
        return;
      }

      const items = this.cart.map((p) => ({
        id: p.id,
        nom: p.nom,
        prix: p.prix,
        quantity: p.quantity,
        taille: p.taille || null,
        couleur: p.couleur || null,
      }));

      const response = await fetch(
        "https://stripe-backend-production-2ac4.up.railway.app/create-stripe-session",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            items,
            email: this.user.email,
            adresseLivraison: {
              address1: this.address1,
              address2: this.address2,
              ville: this.ville,
              codePostal: this.codePostal,
              pays: this.pays,
            },
          }),
        }
      );

      const data = await response.json();
      if (data.url) window.location.href = data.url;
    },
  },
};
</script>

<style scoped>
.input {
  display: block;
  width: 100%;
  border: 1px solid #ddd;
  padding: 8px;
  margin-bottom: 10px;
  border-radius: 6px;
}
</style>
