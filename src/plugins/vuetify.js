import Vue from 'vue'
import Vuetify from 'vuetify'
import VCurrency from 'v-currency-field'
import 'v-currency-field/dist/index.css'
import 'vuetify/dist/vuetify.min.css'
import 'material-design-icons-iconfont'

Vue.use(VCurrency)

Vue.use(Vuetify, {
  theme: {
    primary: '#88691A',
    secondary: '#083759'
  }
})
