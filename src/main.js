import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
// CSS global thème
import "./style.css";

// Import du thème
import './themes/dark.css';
import './themes/pastel.css';

import languageStore from "./components/storeLanguage"; 

const app = createApp(App);

// 🔥 Important : initialise Vuex et le router
app.use(store);


// 🔹 Ajouter le module de langue (si tu veux l’injecter en module séparé)
app.use(languageStore);

app.use(router);

// 🔥 Initialisation de l'auth Firebase avant rendu du menu
store.dispatch("initAuth").then(() => {
  app.mount("#app");
});
