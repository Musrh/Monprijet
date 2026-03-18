<template>
  <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
    <div
      v-for="categorie in categories"
      :key="categorie.slug"
      class="cursor-pointer flex flex-col items-center p-2 bg-white rounded shadow hover:shadow-lg transition"
      @click="goToDetails(categorie.slug)"
    >
      <!-- Emoji ou image -->
      <span class="text-3xl mb-1">{{ categorie.emoji }}</span>
      <span class="text-sm font-semibold text-center">{{ categorie.name }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: "Vitrine",
  props: {
    categories: { type: Array, required: true, default: () => [] },
  },
  setup(_, { emit }) {
    const goToDetails = (slug) => {
      // 🔹 Redirection vers la page Détails.vue
      // On utilise $router pour naviguer
      emit("navigate", slug); // optionnel si parent veut écouter
      window.location.href = `/details/${slug}`;
    };

    return { goToDetails };
  },
};
</script>

<style scoped>
/* styles déjà présents */
</style>
