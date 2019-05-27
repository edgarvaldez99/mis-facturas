import Vue from 'vue'
import Vuex from 'vuex'
import auth from './auth'
import snackbar from './snackbar'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    auth,
    snackbar
  }
})
