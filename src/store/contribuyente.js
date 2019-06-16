import { saveDataInDatabase, deleteData } from './_commons'

export default {
  state: {
    contribuyentes: []
  },
  mutations: {
    setContribuyentes: (state, contribuyentes) => (state.contribuyentes = contribuyentes)
  },
  actions: {
    setContribuyentes: ({ commit }, contribuyente) => commit('setContribuyentes', contribuyente),
    saveContribuyente: (_, contribuyente) => saveDataInDatabase('contribuyentes', contribuyente),
    deleteContribuyente: (_, id) => deleteData('contribuyentes', id)
  },
  getters: {
    getContribuyenteById: (_, getters) => id => getters.contribuyentes.find(val => val.id === id),
    contribuyentes: state => state.contribuyentes
  }
}
