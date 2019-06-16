<template lang="pug">
v-layout
  v-flex(xs12 md10 offset-md1 lg8 offset-lg2 xl6 offset-xl3)
    v-card(max-width='1000px' style="margin-bottom: 20px;")
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

      v-data-table.elevation-1(:headers='headers', :items='contribuyentes', :search='search')
        template(v-slot:items='props')
          tr(@click="selectItem(props.item)")
            td.text-xs-left {{ props.item.razonSocial }}
            td.text-xs-center {{ props.item.ruc }} - {{ props.item.digitoVerificador }}
            td.text-xs-left {{ props.item.nombreFantasia }}
        template(v-slot:no-results)
          v-alert(:value='true' color='error' icon='warning') La busqueda "{{ search }}" no tuvo resultados.
        template(v-slot:no-data)
          v-alert(:value="true" color="error" icon="warning") No hay contribuyentes disponibles

</template>

<script>
import { mapGetters } from 'vuex'

export default {
  data: () => ({
    headers: [
      { text: 'Razón Social', align: 'center', value: 'razonSocial' },
      { text: 'RUC', align: 'center', value: 'ruc' },
      { text: 'Nombre de fantasía', align: 'center', value: 'nombreFantasia' }
    ],
    search: ''
  }),

  computed: {
    ...mapGetters(['contribuyentes'])
  },

  methods: {
    selectItem (item) {
      this.$emit('selected', item)
    }
  }
}

</script>
