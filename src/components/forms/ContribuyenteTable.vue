<template lang="pug">
v-layout
  v-flex(xs12 md10 offset-md1 lg8 offset-lg2 xl6 offset-xl3)
    v-card.ma-3(max-width='1000px')
      v-card-title
        .title Lista de Contribuyentes
        v-spacer
        v-text-field(
          v-model='search'
          append-icon='search'
          label='Search'
          single-line
          hide-details
          style="float: right; margin-right: 20px;"
        )

      .v-card-content
        v-data-table.elevation-1(:headers='headers', :items='contribuyentes', :search='search')
          template(v-slot:items='props')
            td.text-xs-left {{ props.item.razonSocial }}
            td.text-xs-center {{ props.item.ruc }}
            td.text-xs-center {{ props.item.digitoVerificador }}
            td.text-xs-left {{ props.item.nombreFantasia }}
            td.justify-center.layout.px-0
              v-tooltip(right)
                template(v-slot:activator="{ on }")
                  v-btn(color="warning", icon, v-on="on", @click='editItem(props.item)')
                    v-icon edit
                span Editar
              v-tooltip(left)
                template(v-slot:activator="{ on }")
                  btn-with-dialog-alert(title='Eliminar contribuyente', icon, v-on='on', @on-confirm='deleteItem(props.item)')
                    v-icon delete
                span Eliminar
          template(v-slot:no-results)
            v-alert(:value='true' color='error' icon='warning') La busqueda "{{ search }}" no tuvo resultados.
          template(v-slot:no-data)
            v-alert(:value="true" color="error" icon="warning") No hay contribuyentes disponibles

      v-card-actions
        v-spacer
        v-tooltip(left)
          template(v-slot:activator="{ on }")
            v-btn(color='success', icon, v-on="on", @click="createItem()")
              v-icon add
          span Agregar nuevo contribuyente

  v-dialog(v-model='dialog', persistent, scrollable, max-width='80vw')
    ContribuyenteForm(v-if="dialog" :form-id="editFormId" @finished="dialog = false")

</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    ContribuyenteForm: _ => import('@/components/forms/ContribuyenteForm')
  },
  data: () => ({
    dialog: false,
    headers: [
      { text: 'Razón Social', align: 'center', value: 'razonSocial' },
      { text: 'RUC', align: 'center', value: 'ruc' },
      { text: 'Dígito verificador', align: 'center', value: 'digitoVerificador' },
      { text: 'Nombre de fantasía', align: 'center', value: 'nombreFantasia' },
      { text: 'Acciones', align: 'center', value: 'title', sortable: false }
    ],
    editFormId: '',
    search: ''
  }),

  computed: {
    ...mapGetters(['contribuyentes'])
  },

  methods: {
    ...mapActions(['deleteContribuyente', 'setSnack']),

    createItem () {
      this.editFormId = ''
      this.dialog = true
    },

    editItem (item) {
      this.editFormId = item.id
      this.dialog = true
    },

    deleteItem (item) {
      this.deleteContribuyente(item.id).then(val => this.setSnack(`El contribuyente "${item.title}" ha sido eliminado`))
    }
  }
}

</script>

<style scoped lang="stylus">
.v-card-content
  height: calc(100vh - 334px)
  overflow: auto

</style>
