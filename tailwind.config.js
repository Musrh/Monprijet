/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",          // ton fichier principal
    "./src/**/*.{vue,js,ts,jsx,tsx}" // tous les composants Vue et fichiers JS/TS
  ],
  theme: {
    extend: {
      colors: {
        primary: '#22c55e',   // vert moderne
        secondary: '#1e293b', // gris foncé
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // police moderne
      },
    },
  },
  plugins: [],
}
