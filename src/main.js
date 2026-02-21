import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";

const app = createApp(App);

app.use(router);
app.use(store);

// Init Vuex auth state
store.dispatch("initAuth");

// Redirection si non connecté
onAuthStateChanged(auth, (user) => {
  if (!user) {
    router.push("/");
  }
});

app.mount("#app");
