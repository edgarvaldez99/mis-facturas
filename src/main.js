import Vue from 'vue'
import { auth } from './firebase'
import './plugins/vuetify'
import { sync } from 'vuex-router-sync'
import App from './App.vue'
import router from './router'
import store from './store'
import globalWatchers from './global-watchers'
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
}

auth.onAuthStateChanged(user => {
  if (user) {
    store.dispatch('updateAllState', user)
  } else {
    store.dispatch('updateAllState', null)
  }

  initializeApp()
})
