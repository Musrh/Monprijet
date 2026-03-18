<template>
  <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
    <div
      v-for="categorie in categories"
      :key="categorie.slug"
      class="cursor-pointer flex flex-col items-center p-2 bg-white rounded shadow hover:shadow-lg transition"
      @click="selectCategory(categorie.slug)"
    >
      <!-- Emoji ou image de la catégorie -->
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
  emits: ["category-selected"],
  methods: {
    selectCategory(slug) {
      // 🔹 Émettre l'événement vers le parent
      this.$emit("category-selected", slug);
    },
  },
};
</script>

<style scoped>
/* styles déjà présents */
</style>
