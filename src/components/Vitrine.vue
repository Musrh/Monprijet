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
        class="group bg-white border border-gray-200 rounded-xl p-6 
               flex flex-col items-center justify-center
               hover:shadow-xl hover:-translate-y-1 
               transition duration-300"
      >
        <!-- SVG -->
        <div class="w-14 h-14 mb-4 text-gray-800 group-hover:text-purple-700 transition">
          <component :is="cat.icon" />
        </div>

        <h3 class="text-center font-semibold text-gray-700 group-hover:text-purple-700">
          {{ cat.name }}
        </h3>
      </router-link>
    </div>
  </section>
</template>

<script>
/* ============================= */
/* ===== SVG COMPONENTS ======== */
/* ============================= */

const PhoneIcon = {
  template: `
  <svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
    <rect x="7" y="2" width="10" height="20" rx="2"/>
    <circle cx="12" cy="18" r="1"/>
  </svg>`
};

const LaptopIcon = {
  template: `
  <svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
    <rect x="3" y="4" width="18" height="12" rx="2"/>
    <path d="M2 18h20"/>
  </svg>`
};

const HomeIcon = {
  template: `
  <svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
    <path d="M3 10l9-7 9 7"/>
    <path d="M9 22V12h6v10"/>
  </svg>`
};

const GameIcon = {
  template: `
  <svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
    <path d="M6 12h4M8 10v4"/>
    <circle cx="16" cy="11" r="1"/>
    <circle cx="18" cy="13" r="1"/>
    <rect x="3" y="8" width="18" height="8" rx="4"/>
  </svg>`
};

const DiamondIcon = {
  template: `
  <svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
    <path d="M3 9l4-5h10l4 5-9 11z"/>
  </svg>`
};

const ShirtIcon = {
  template: `
  <svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
    <path d="M4 4l4-2 4 2 4-2 4 2v6l-4 2v10H8V12l-4-2z"/>
  </svg>`
};

const HeartIcon = {
  template: `
  <svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
    <path d="M12 21s-7-4.35-9-8.5S5 3 12 8s9-1 9 4.5S12 21 12 21z"/>
  </svg>`
};

const ToolsIcon = {
  template: `
  <svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
    <path d="M3 21l6-6"/>
    <path d="M14 7l3-3 3 3-3 3z"/>
  </svg>`
};

const TrophyIcon = {
  template: `
  <svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
    <path d="M6 4h12v4a6 6 0 01-12 0z"/>
    <path d="M9 22h6"/>
  </svg>`
};

const TvIcon = {
  template: `
  <svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
    <rect x="3" y="6" width="18" height="12" rx="2"/>
    <path d="M8 22h8"/>
  </svg>`
};

export default {
  name: "Vitrine",
  components: {
    PhoneIcon,
    LaptopIcon,
    HomeIcon,
    GameIcon,
    DiamondIcon,
    ShirtIcon,
    HeartIcon,
    ToolsIcon,
    TrophyIcon,
    TvIcon
  },
  data() {
    return {
      categories: [
        { name: "Téléphones & Tablettes", slug: "telephones", icon: "PhoneIcon" },
        { name: "Ordinateurs & Informatique", slug: "ordinateurs", icon: "LaptopIcon" },
        { name: "Electroménager & Maison", slug: "maison", icon: "HomeIcon" },
        { name: "Jeux Vidéos & Consoles", slug: "gaming", icon: "GameIcon" },
        { name: "Accessoires & Bijoux", slug: "bijoux", icon: "DiamondIcon" },
        { name: "Vêtement & Chaussures", slug: "vetements", icon: "ShirtIcon" },
        { name: "Parapharmacie", slug: "parapharmacie", icon: "HeartIcon" },
        { name: "Outillage & Jardinage", slug: "jardin", icon: "ToolsIcon" },
        { name: "Boutika Sport", slug: "sport", icon: "TrophyIcon" },
        { name: "Téléviseur / Son & Hifi", slug: "tv", icon: "TvIcon" }
      ]
    };
  }
};
</script>
