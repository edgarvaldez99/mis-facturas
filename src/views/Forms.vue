<template lang="pug">
div
  v-toolbar
    v-toolbar-title Mis Facturas
    v-spacer
    v-toolbar-items
      v-btn(flat='' @click='userLogout') Cerrar Sesión

  v-expansion-panel
    v-expansion-panel-content(v-if='isAdmin')
      template(v-slot:header)
        div Configuraciones
      ConfiguracionesForm
    v-expansion-panel-content
      template(v-slot:header)
        div Contribuyentes
      ContribuyenteTable
    v-expansion-panel-content
      template(v-slot:header)
        div Facturas
      FacturaTable

</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    ConfiguracionesForm: () => import('@/components/forms/ConfiguracionesForm'),
    ContribuyenteTable: () => import('@/components/forms/ContribuyenteTable'),
    FacturaTable: () => import('@/components/forms/FacturaTable')
  },
  data: () => ({
    isAdmin: false
  }),
  computed: {
    ...mapGetters(['userIsAdmin'])
  },
  methods: {
    ...mapActions(['userLogout'])
  }
}

</script>
