<template>
  <section class="w-full px-4 py-6">
    <h2 class="text-2xl font-bold mb-4">{{ t("categories") }}</h2>

    <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4 w-full">
      <div
        v-for="cat in categoriesTranslated"
        :key="cat.slug"
        class="flex flex-col items-center p-4 bg-white rounded shadow hover:shadow-lg transition transform hover:-translate-y-1 cursor-pointer"
        @click="goToCategory(cat.slug)"
      >
        <span class="text-4xl mb-2">{{ cat.emoji }}</span>
        <h3 class="text-sm font-semibold text-center truncate">
          {{ cat.name }}
        </h3>
      </div>
    </div>
  </section>
</template>

<script>
import { useRouter } from "vue-router";
import { computed } from "vue";
import { useStore } from "vuex";

export default {
  name: "Vitrine",
  setup() {
    const router = useRouter();
    const store = useStore();

    // 🔹 Langue courante depuis Vuex
    const currentLang = computed(() => store.getters["language/currentLanguage"]);

    // 🔹 Traductions du titre et des catégories
    const translations = {
      fr: {
        categories: "Catégories",
        telephones: "Téléphones",
        ordinateurs: "Ordinateurs",
        chaussures: "Chaussures",
        bijoux: "Bijoux",
        cuisine: "Cuisine",
        accessoires: "Accessoires",
        maison: "Maison",
        beaute: "Beauté",
        watch: "Montres"
      },
      en: {
        categories: "Categories",
        telephones: "Phones",
        ordinateurs: "Computers",
        chaussures: "Shoes",
        bijoux: "Jewelry",
        cuisine: "Kitchen",
        accessoires: "Accessories",
        maison: "Home",
        beaute: "Beauty",
        watch: "Watches"
      }
    };

    // 🔹 Fonction de traduction
    const t = (key) => translations[currentLang.value][key] || key;

    // 🔹 Liste des catégories
    const categories = [
      { nameKey: "telephones", slug: "telephones", emoji: "📱" },
      { nameKey: "ordinateurs", slug: "ordinateurs", emoji: "🖥️" },
      { nameKey: "chaussures", slug: "chaussures", emoji: "👟" },
      { nameKey: "bijoux", slug: "bijoux", emoji: "💍" },
      { nameKey: "cuisine", slug: "cuisine", emoji: "🍳" },
      { nameKey: "accessoires", slug: "accessoires", emoji: "🎒" },
      { nameKey: "maison", slug: "maison", emoji: "🏠" },
      { nameKey: "beaute", slug: "beaute", emoji: "💄" },
      { nameKey: "watch", slug: "watch", emoji: "⌚" }
    ];

    // 🔹 Catégories avec noms traduits
    const categoriesTranslated = computed(() =>
      categories.map((cat) => ({
        ...cat,
        name: t(cat.nameKey)
      }))
    );

    const goToCategory = (slug) => {
    router.push({ name: "CategoryResults", params: { slug } });
    };

    return { categoriesTranslated, goToCategory, t };
  }
};
</script>

<style scoped>
div > div:hover {
  transform: translateY(-3px);
  transition: all 0.2s;
}
</style>
