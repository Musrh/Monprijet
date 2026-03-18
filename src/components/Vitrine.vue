<template>
  <section class="px-4 mt-8">
    <h2 class="text-2xl font-bold mb-6">
      Découvrez nos catégories
    </h2>

    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      <router-link
        v-for="cat in categories"
        :key="cat.slug"
        :to="`/categorie/${cat.slug}`"
        class="bg-white border border-gray-200 rounded-xl p-6 
               flex flex-col items-center justify-center
               hover:shadow-lg hover:scale-105 transition duration-300"
      >
        <component :is="cat.icon" class="w-14 h-14 mb-4 text-black" />
        <h3 class="text-center font-semibold text-purple-700">
          {{ cat.name }}
        </h3>
      </router-link>
    </div>
  </section>
</template>

<script>
import {
  DevicePhoneMobileIcon,
  ComputerDesktopIcon,
  HomeIcon,
  PuzzlePieceIcon,
  SparklesIcon,
  DiamondIcon,
  ShoppingBagIcon,
  HeartIcon,
  WrenchScrewdriverIcon,
  FaceSmileIcon,
  TrophyIcon,
  TvIcon
} from "@heroicons/vue/24/outline";

export default {
  name: "Vitrine",
  components: {
    DevicePhoneMobileIcon,
    ComputerDesktopIcon,
    HomeIcon,
    PuzzlePieceIcon,
    SparklesIcon,
    DiamondIcon,
    ShoppingBagIcon,
    HeartIcon,
    WrenchScrewdriverIcon,
    FaceSmileIcon,
    TrophyIcon,
    TvIcon
  },
  data() {
    return {
      categories: [
        { name: "Téléphones & Tablettes", slug: "telephones", icon: "DevicePhoneMobileIcon" },
        { name: "Ordinateurs & Informatique", slug: "ordinateurs", icon: "ComputerDesktopIcon" },
        { name: "Electroménager & Maison", slug: "maison", icon: "HomeIcon" },
        { name: "Jeux Vidéos & Consoles", slug: "gaming", icon: "PuzzlePieceIcon" },
        { name: "Parfums & Coffrets", slug: "parfums", icon: "SparklesIcon" },
        { name: "Accessoires & Bijoux", slug: "bijoux", icon: "DiamondIcon" },
        { name: "Vêtement & Chaussures", slug: "vetements", icon: "ShoppingBagIcon" },
        { name: "Parapharmacie", slug: "parapharmacie", icon: "HeartIcon" },
        { name: "Outillage & Jardinage", slug: "jardin", icon: "WrenchScrewdriverIcon" },
        { name: "Beauté & Santé", slug: "beaute", icon: "FaceSmileIcon" },
        { name: "Boutika Sport", slug: "sport", icon: "TrophyIcon" },
        { name: "Téléviseur / Son & Hifi", slug: "tv", icon: "TvIcon" }
      ]
    };
  }
};
</script>
