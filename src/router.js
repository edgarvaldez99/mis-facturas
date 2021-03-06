import Vue from 'vue'
import Router from 'vue-router'
import Login from './views/Login.vue'
import Forms from './views/Forms.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/',
      name: 'forms',
      component: Forms,
      meta: {
        authRequired: true
      }
    }
  ]
})
