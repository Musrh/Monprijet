import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
// CSS global thème
//import "./style.css";

// Import du thème
import './themes/dark.css';
import './themes/pastel.css';

const app = createApp(App);

// 🔥 Important : initialise Vuex et le router
app.use(store);
app.use(router);

// 🔥 Initialisation de l'auth Firebase avant rendu du menu
store.dispatch("initAuth").then(() => {
  app.mount("#app");
});
