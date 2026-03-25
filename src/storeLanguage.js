// storeLanguage.js
export default {
  namespaced: true,

  state: () => ({
    currentLanguage:
      localStorage.getItem("lang") ||
      (navigator.language && navigator.language.startsWith("fr")
        ? "fr"
        : "en"),
  }),

  mutations: {
    SET_LANGUAGE(state, lang) {
      state.currentLanguage = lang;
      localStorage.setItem("lang", lang); // sauvegarde
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
