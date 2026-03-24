// storeLanguage.js
export default {
  namespaced: true, // 🔹 important pour éviter conflits
  state: {
    currentLanguage: "fr", // langue par défaut
  },
  mutations: {
    SET_LANGUAGE(state, lang) {
      state.currentLanguage = lang;
    },
  },
  actions: {
    changeLanguage({ commit }, lang) {
      commit("SET_LANGUAGE", lang);
    },
  },
  getters: {
    currentLanguage: (state) => state.currentLanguage,
  },
};
