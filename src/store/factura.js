import { saveDataInDatabase, deleteData } from './_commons'

export default {
  state: {
    facturas: [],
    monthSelected: new Date()
  },
  mutations: {
    setFacturas: (state, facturas) => (state.facturas = facturas),
    setMonthSelected: (state, month) => (state.monthSelected = month)
  },
  actions: {
    setFacturas: ({ commit }, facturas) => commit('setFacturas', facturas),
    setMonthSelected: ({ commit }, month) => commit('setMonthSelected', month),
    saveFactura: (_, factura) => saveDataInDatabase('facturas', factura),
    deleteFactura: (_, id) => deleteData('facturas', id)
  },
  getters: {
    getFacturaById: (_, getters) => id => getters.facturas.find(val => val.id === id),
    facturas: state => state.facturas,
    monthSelected: state => state.monthSelected
  }
}
