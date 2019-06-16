import Vue from 'vue'
import { auth, database } from './firebase'
import './plugins/vuetify'
import './plugins/base'
import { sync } from 'vuex-router-sync'
import App from './App.vue'
import router from './router'
import store from './store'
import globalWatchers from './global-watchers'
import loadData from './load-data'
import './registerServiceWorker'

Vue.config.productionTip = false

sync(store, router)

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.authRequired)) {
    if (!store.state.auth.user) {
      next({ path: '/login' })
    } else {
      next()
    }
  } else {
    next()
  }
})

const initializeApp = () => {
  const vueInstance = new Vue({
    router,
    store,
    render: h => h(App)
  }).$mount('#app')

  globalWatchers(vueInstance)
  loadData(vueInstance)
}

let callback = null
let metadataRef = null
auth.onAuthStateChanged(user => {
  // Remove previous listener.
  if (callback) metadataRef.off('value', callback)
  // On user login add new listener.
  if (user) {
    // Check if refresh is required.
    metadataRef = database.ref('metadata/' + user.uid + '/refreshTime')
    callback = () => {
      // Force refresh to pick up the latest custom claims changes.
      // Note this is always triggered on first call. Further optimization could be
      // added to avoid the initial trigger when the token is issued and already contains
      // the latest claims.
      user.getIdToken(true)
      store.dispatch('updateAllState', user)
    }
    // Subscribe new listener to changes on that node.
    metadataRef.on('value', callback)
  } else {
    store.dispatch('updateAllState', null)
  }

  initializeApp()
})
