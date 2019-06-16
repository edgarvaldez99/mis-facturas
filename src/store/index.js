import Vue from 'vue'
import Vuex from 'vuex'
import auth from './auth'
import configuraciones from './configuraciones'
import contribuyente from './contribuyente'
import factura from './factura'
import snackbar from './snackbar'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    auth,
    configuraciones,
    contribuyente,
    factura,
    snackbar
  }
})
