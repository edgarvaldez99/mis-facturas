import firebase, { auth } from '@/firebase'
import router from '@/router'

const initialState = localStorage.session ? JSON.parse(localStorage.getItem('session')) : {
  user: null,
  userSelected: null,
  isAuthenticated: false
}

const updateSessionInLocalStorage = session => localStorage.setItem('session', JSON.stringify(session))

const signOut = _ => {
  router.push('/')
  window.location.reload()
}

export default {
  state: { ...initialState },
  mutations: {
    setUser: (state, payload) => (state.user = payload),
    setUserSelected: (state, payload) => (state.userSelected = payload),
    setIsAuthenticated: (state, payload) => (state.isAuthenticated = payload)
  },
  actions: {
    updateAllState: ({ commit, dispatch }, user) => {
      commit('setUser', user)
      commit('setUserSelected', user)
      commit('setIsAuthenticated', !!user)
      dispatch('updateSessionInLocalStorage')
    },
    createUser: ({ dispatch }, { email, password }) =>
      auth
        .createUserWithEmailAndPassword(email, password)
        .then(authData => {
          dispatch('updateAllState', authData.user)
          return authData
        }),
    userLogin: ({ dispatch }, { email, password }) =>
      auth
        .signInWithEmailAndPassword(email, password)
        .then(authData => dispatch('updateAllState', authData.user)),
    userLogout: _ =>
      auth
        .signOut()
        .then(_ => signOut())
        .catch(_ => signOut()),
    updateSessionInLocalStorage: ({ state }) => updateSessionInLocalStorage(state),
    loginWithGoogle: ({ dispatch }) => {
      const provider = new firebase.auth.GoogleAuthProvider()
      auth.signInWithPopup(provider).then(result => dispatch('updateAllState', result.user))
    },
    setUserSelected: ({ commit }, user) => commit('setUserSelected', user)
  },
  getters: {
    userIsAdmin: state => state.user.getIdTokenResult && state.user.getIdTokenResult(),
    isAuthenticated: state => state.isAuthenticated,
    userSelected: state => state.userSelected
  }
}
