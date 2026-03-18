<template>
  <section class="w-full px-4 py-6">
    <h2 class="text-2xl font-bold mb-4">Catégories</h2>

    <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4 w-full">
      <div
        v-for="cat in categories"
        :key="cat.slug"
        class="flex flex-col items-center p-4 bg-white rounded shadow hover:shadow-lg transition transform hover:-translate-y-1 cursor-pointer"
        @click="goToCategory(cat.slug)"
      >
        <span class="text-4xl mb-2">{{ cat.emoji }}</span>
        <h3 class="text-sm font-semibold text-center truncate">{{ cat.name }}</h3>
      </div>
    </div>
  </section>
</template>

<script>
import { useRouter } from "vue-router";

export default {
  props: {
    categories: {
      type: Array,
      required: true,
      default: () => [
        { name: "Téléphones", slug: "telephones", emoji: "📱" },
        { name: "Chaussures", slug: "chaussures", emoji: "👟" },
        { name: "Accessoires", slug: "accessoires", emoji: "🎒" },
        { name: "Informatique", slug: "informatique", emoji: "💻" },
        { name: "Maison", slug: "maison", emoji: "🏠" },
        { name: "Beauté", slug: "beaute", emoji: "💄" },
      ]
    }
  },
  setup() {
    const router = useRouter();

    const goToCategory = (slug) => {
      router.push({ name: "Details", params: { slug } });
    };

    return { goToCategory };
  }
};
</script>

<style scoped>
div > div:hover {
  transform: translateY(-3px);
  transition: all 0.2s;
}
</style>
