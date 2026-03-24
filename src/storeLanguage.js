import { createStore } from "vuex";

export default createStore({
  state: {
    currentLanguage: "fr", // langue par défaut
  },
  mutations: {
    SET_LANGUAGE(state, lang) {
      state.currentLanguage = lang;
    },
  },
  actions: {
    setLanguage({ commit }, lang) {
      commit("SET_LANGUAGE", lang);
    },
  },
  getters: {
    currentLanguage: (state) => state.currentLanguage,
  },
});
