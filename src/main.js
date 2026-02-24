import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

const app = createApp(App);

// 🔹 Initialiser l'utilisateur avant de monter l'app
store.dispatch("initAuth").then(() => {
  app.use(store);
  app.use(router);
  app.mount("#app");
});
