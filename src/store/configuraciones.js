import { database } from '@/firebase'

export default {
  state: {
    configuraciones: {
      adminEmail: ''
    }
  },
  mutations: {
    setConfiguraciones: (state, configuraciones) => (state.configuraciones = configuraciones)
  },
  actions: {
    setConfiguraciones: ({ commit }, configuraciones) => commit('setConfiguraciones', configuraciones),
    saveConfiguraciones: (_, configuraciones) => {
      return database
        .ref('configuraciones')
        .set(configuraciones)
        .catch(err => {
          err.originalMessage = err.message
          err.message = 'No tiene permisos para guardar en la base de datos, por favor inicie sesión'
          return err
        })
    }
  },
  getters: {
    configuraciones: state => state.configuraciones
  }
}
