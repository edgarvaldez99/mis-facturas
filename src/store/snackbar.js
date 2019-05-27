export default {
  state: {
    snack: ''
  },
  mutations: {
    setSnack: (state, snack) => (state.snack = snack)
  },
  actions: {
    setSnack: ({ commit }, snack) => commit('setSnack', snack)
  }
}
