import { auth } from '@/firebase'
import router from '@/router'

const initialState = localStorage.session ? JSON.parse(localStorage.getItem('session')) : {
  user: null,
  isAuthenticated: false
}

const updateSessionInLocalStorage = session => localStorage.setItem('session', JSON.stringify(session))

export default {
  state: { ...initialState },
  mutations: {
    setUser: (state, payload) => (state.user = payload),
    setIsAuthenticated: (state, payload) => (state.isAuthenticated = payload)
  },
  actions: {
    updateAllState: ({ commit, dispatch }, user) => {
      commit('setUser', user)
      commit('setIsAuthenticated', !!user)
      dispatch('updateSessionInLocalStorage')
    },
    userLogin: ({ dispatch }, { email, password }) =>
      auth
        .signInWithEmailAndPassword(email, password)
        .then(user => dispatch('updateAllState', user)),
    userLogout: _ =>
      auth
        .signOut()
        .then(_ => router.push('/'))
        .catch(_ => router.push('/')),
    updateSessionInLocalStorage: ({ state }) => updateSessionInLocalStorage(state)
  },
  getters: {
    isAuthenticated: state => state.isAuthenticated
  }
}
