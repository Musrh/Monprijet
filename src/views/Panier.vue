<template>
  <section class="panier px-4 py-6">

    <h2 class="text-2xl font-bold mb-6">🛒 Mon Panier</h2>

    <!-- Si panier vide -->
    <div v-if="cart.length === 0" class="text-gray-500">
      Votre panier est vide.
    </div>

    <!-- Liste des produits -->
    <div v-else class="space-y-6">

      <div
        v-for="item in cart"
        :key="item.id + '-' + item.taille + '-' + item.couleur"
        class="flex flex-col md:flex-row items-center gap-4 border rounded-lg p-4 shadow bg-white"
      >

        <!-- Image -->
        <img
          :src="item.images?.[0] || '/placeholder.png'"
          class="w-28 h-28 object-cover rounded"
        />

        <!-- Infos -->
        <div class="flex-1 text-center md:text-left">

          <h3 class="font-bold text-lg">
            {{ item.nom }}
          </h3>

          <!-- Taille -->
          <p v-if="item.taille" class="text-sm text-gray-600">
            📏 Taille : {{ item.taille }}
          </p>

          <!-- Couleur -->
          <p v-if="item.couleur" class="text-sm text-gray-600">
            🎨 Couleur : {{ item.couleur }}
          </p>

          <!-- Prix -->
          <p class="text-green-600 font-semibold mt-2">
            {{ item.prix }} €
          </p>

        </div>

        <!-- Quantité -->
        <div class="flex items-center gap-2">

          <button
            @click="decrease(item)"
            class="bg-gray-200 px-2 rounded"
          >-</button>

          <span class="px-3">
            {{ item.quantity }}
          </span>

          <button
            @click="increase(item)"
            class="bg-gray-200 px-2 rounded"
          >+</button>

        </div>

        <!-- Supprimer -->
        <button
          @click="remove(item)"
          class="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
        >
          Supprimer
        </button>

      </div>

      <!-- Total -->
      <div class="text-right mt-6 border-t pt-4">
        <h3 class="text-xl font-bold">
          Total : {{ cartTotal }} €
        </h3>

        <button
          class="mt-4 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Passer la commande
        </button>
      </div>

    </div>

  </section>
</template>

<script>
import { computed } from "vue";
import { useStore } from "vuex";

export default {
  name: "Panier",
  setup() {
    const store = useStore();

    const cart = computed(() => store.state.cart);
    const cartTotal = computed(() => store.getters.cartTotal);

    const increase = (item) => {
      store.dispatch("updateQuantity", {
        id: item.id,
        taille: item.taille,
        couleur: item.couleur,
        quantity: item.quantity + 1
      });
    };

    const decrease = (item) => {
      if (item.quantity > 1) {
        store.dispatch("updateQuantity", {
          id: item.id,
          taille: item.taille,
          couleur: item.couleur,
          quantity: item.quantity - 1
        });
      }
    };

    const remove = (item) => {
      store.dispatch("removeItem", {
        id: item.id,
        taille: item.taille,
        couleur: item.couleur
      });
    };

    return {
      cart,
      cartTotal,
      increase,
      decrease,
      remove
    };
  }
};
</script>

<style scoped>
.panier button {
  transition: 0.2s;
}
</style>
